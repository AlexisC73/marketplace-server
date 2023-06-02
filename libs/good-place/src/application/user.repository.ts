import { User } from '../domain/user';

export abstract class UserRepository {
  abstract save: (user: User) => Promise<void>;
}
