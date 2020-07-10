import { Document } from 'mongoose';

export interface IUser extends Document {
  name?: string;
  email?: string;
  password?: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  createAt?: Date;
}

export type TReq = {
  userId: string | number | unknown;
  headers: {
    authorization: string;
  };
};

export type TDecoded = {
  id: string | number | unknown;
};
