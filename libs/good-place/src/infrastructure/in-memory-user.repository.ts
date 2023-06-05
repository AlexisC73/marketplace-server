import { UserRepository } from '../application/user.repository';
import { User } from '../domain/user';

export class InMemoryUserRepository implements UserRepository {
  users: User['data'][] = [];
  async save(user: User) {
    this._save(user);
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    const fundIndex = this.users.findIndex((u) => u.email === email);
    if (fundIndex === -1) {
      return undefined;
    }
    return User.fromData(this.users[fundIndex]);
  }

  private _save(user: User) {
    this.users = [...this.users, user.data];
  }
}
