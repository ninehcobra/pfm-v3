import { User } from '../entities/user.entity';

export interface IUserRepository {
  create(user: Partial<User>): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  update(id: string, data: Partial<User>): Promise<User>;
  findByRefreshToken(token: string): Promise<User | null>;
}

export const USER_REPOSITORY = 'IUserRepository';
