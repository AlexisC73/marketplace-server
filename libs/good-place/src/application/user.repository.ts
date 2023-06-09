import { User } from '../domain/entity/user';

export abstract class UserRepository {
  abstract save: (user: User) => Promise<void>;
  abstract findOneByEmail: (email: string) => Promise<User | null>;
  abstract updateAvatar: (user: User, savedUrl: string) => Promise<void>;
  abstract findOneById: (id: string) => Promise<User | null>;
}
