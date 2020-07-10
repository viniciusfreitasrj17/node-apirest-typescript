import { Response, Request, NextFunction } from 'express';
import jwt, { VerifyErrors } from 'jsonwebtoken';

import authConfig from '../config/auth.json';
import { TReq, TDecoded } from '../types/user';

export default function (
  req: Request & TReq,
  res: Response & void,
  next: NextFunction
): Promise<Response> | string | any {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ Error: 'No token provided' });
  }

  const parts = authHeader.split(' ');

  if (parts.length !== 2) {
    return res.status(401).json({ Error: 'Token error' });
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).json({ Error: 'Token malformatted' });
  }

  jwt.verify(
    token,
    authConfig.secret,
    (
      err: VerifyErrors | null,
      decoded: Record<string, unknown> | undefined | TDecoded
    ): void => {
      if (err) {
        return res.status(401).json({ Error: 'Token invalid' });
      }

      req.userId = (<TDecoded>decoded).id;
      return next();
    }
  );
}
