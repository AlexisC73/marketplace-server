import { User } from '../domain/user';

export abstract class UserRepository {
  abstract save: (user: User) => Promise<void>;
  abstract findOneByEmail: (email: string) => Promise<User | undefined>;
  abstract updateAvatar: (user: User, savedUrl: string) => Promise<void>;
  abstract findOneById: (id: string) => Promise<User>;
}
