import { UserRepository } from '../application/user.repository';
import { User } from '../domain/user';

export class InMemoryUserRepository implements UserRepository {
  users: User['data'][] = [];
  async save(user: User) {
    if (this.users.find((u) => u.email === user.email)) {
      throw new Error('User already exists');
    }
    this._save(user);
  }

  private _save(user: User) {
    this.users = [...this.users, user.data];
  }
}
