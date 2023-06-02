import { UserRepository } from '../application/user.repository';
import { User } from '../domain/user';

export class InMemoryUserRepository implements UserRepository {
  users: User['data'][] = [];
  async save(user: User) {
    this._save(user);
  }

  private _save(user: User) {
    this.users = [...this.users, user.data];
  }
}
