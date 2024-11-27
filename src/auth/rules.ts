import { User } from 'users/entities/user.entity';
import { AccessTokenPayload } from './types';

export const generatePayload = (user: User): AccessTokenPayload => {
  return {
    sub: user.id,
    snsId: user.snsId,
    snsType: user.snsType,
    email: user.email,
  };
};
