import jwt from 'jsonwebtoken';
import authConfig from '../config/auth.json';

export const generateToken = (
  params: string | Buffer | Record<string, unknown>
): string => {
  return jwt.sign(params, authConfig.secret, {
    expiresIn: 86400 // data expire, one day
  });
};
