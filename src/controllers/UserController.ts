import { Request, Response } from 'express';
import bycript from 'bcryptjs';
import crypto from 'crypto';

import User from '../models/User';
import { generateToken } from '../utils/generateToken';
import mailer from '../services/mailer';

class UserController {
  // public async index(req: Request, res: Response): Promise<Response> {
  //   try {
  //     const users = await User.find();

  //     return res.json(users);
  //   } catch (err) {
  //     return res.status(400).json({ Mensagge: 'Get Failed', Error: err });
  //   }
  // }

  public async create(req: Request, res: Response): Promise<Response> {
    const { email } = req.body;

    try {
      if (await User.findOne({ email })) {
        return res.status(400).json({ Error: 'User already exists' });
      }

      const user = await User.create(req.body);

      user.password = undefined;

      return res.json({
        user,
        token: generateToken({ id: user._id })
      });
    } catch (err) {
      return res.status(400).json({ Mensagge: 'Register Failed' });
    }
  }

  public async auth(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email }).select('+password');

      if (!user) {
        return res.status(400).json({ Error: 'User not found' });
      }

      if (!(await bycript.compare(password, user.password))) {
        return res.status(400).json({ Error: 'Invalid Password' });
      }

      user.password = undefined;

      return res.json({
        user,
        token: generateToken({ id: user._id })
      });
    } catch (err) {
      return res.status(400).json({ Mensagge: 'Authenticate Failed' });
    }
  }

  public async forgotPassword(req: Request, res: Response): Promise<Response> {
    const { email } = req.body;

    try {
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ Error: 'User not found' });
      }

      const token = crypto.randomBytes(20).toString('hex');

      const now = new Date();
      now.setHours(now.getHours() + 1);

      await User.findByIdAndUpdate(user.id, {
        $set: {
          passwordResetToken: token,
          passwordResetExpires: now
        }
      });

      mailer.sendMail(
        {
          to: email,
          from: 'viniciusfreitasrj17@gmail.com',
          template: 'forgotPassword',
          context: { token }
        },
        err => {
          if (err) {
            return res
              .status(400)
              .json({ Error: 'Cannot send forgot password email' });
          }

          res.send();
        }
      );
    } catch (err) {
      res.status(400).json({ Mensagge: 'Error on forgot password, try again' });
    }
  }

  public async resetPassword(req: Request, res: Response): Promise<Response> {
    const { email, token, password } = req.body;

    try {
      const user = await User.findOne({ email }).select(
        '+passwordResetToken passwordResetExpires'
      );

      if (!user) {
        return res.status(400).json({ Error: 'User not found' });
      }

      if (token !== user.passwordResetToken) {
        return res.status(400).json({ Error: 'Token invalid' });
      }

      const now = new Date();

      if (now > user.passwordResetExpires) {
        return res
          .status(400)
          .json({ Error: 'Token expired, generate a new one' });
      }

      user.password = password;

      await user.save();

      res.send();
    } catch (err) {
      res.status(400).json({ Mensagge: 'Error on reset password, try again' });
    }
  }
}

export default new UserController();
