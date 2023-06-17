import { UserRepository } from '../application/user.repository';
import { Role, User } from '../domain/entity/user';

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

  async updateAvatar(user: User, savedUrl: string): Promise<void> {
    const newUser = User.fromData({
      ...user.data,
      avatarUrl: savedUrl,
    });
    this._save(newUser);
  }

  async findOneById(id: string): Promise<User | null> {
    const foundIndex = this.users.findIndex((u) => u.id === id);
    if (foundIndex === -1) {
      return null;
    }
    return User.fromData(this.users[foundIndex]);
  }

  private _save(user: User) {
    const foundIndex = this.users.findIndex((u) => u.id === user.data.id);
    if (foundIndex !== -1) {
      this.users[foundIndex] = user.data;
      return;
    }
    this.users = [...this.users, user.data];
  }
}
