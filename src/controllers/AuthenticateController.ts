import { Request, Response } from 'express';
import bycript from 'bcryptjs';

import User from '../models/User';
import { generateToken } from '../utils/generateToken';

class AuthenticateController {
  public async store(req: Request, res: Response): Promise<Response> {
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
      return res
        .status(400)
        .json({ Mensagge: 'Authenticate Failed', Error: err });
    }
  }
}

export default new AuthenticateController();
