import { Request, Response } from 'express';

import User from '../models/User';
import { generateToken } from '../utils/generateToken';

class UserController {
  // public async index(req: Request, res: Response): Promise<Response> {
  //   try {
  //     const users = await User.find();

  //     return res.json(users);
  //   } catch (err) {
  //     return res.status(400).json({ Mensagge: 'Get Failed', Error: err });
  //   }
  // }

  public async store(req: Request, res: Response): Promise<Response> {
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
      return res.status(400).json({ Mensagge: 'Register Failed', Error: err });
    }
  }
}

export default new UserController();
