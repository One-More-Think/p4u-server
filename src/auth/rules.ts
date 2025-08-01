import { User } from 'users/entities/user.entity';
import { AccessTokenPayload } from './types';

export const generatePayload = (user: User): AccessTokenPayload => {
  return {
    id: user.id,
    snsId: user.snsId,
    snsType: user.snsType,
    email: user.email,
  };
};
