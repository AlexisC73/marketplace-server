import { UserRepository } from '../application/user.repository';
import { User } from '../domain/user';

export class InMemoryUserRepository implements UserRepository {
  users: User[] = [];
  async save(user: User) {
    this.users.push(user);
  }
}
