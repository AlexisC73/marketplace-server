export enum Role {
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR',
  CLIENT = 'CLIENT',
  SELLER = 'SELLER',
}

export class User {
  private constructor(
    private readonly _id: string,
    private readonly _name: string,
    private readonly _email: string,
    private readonly _password: string,
    private readonly _role: Role,
    private readonly _createdAt: Date,
  ) {}

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get email(): string {
    return this._email;
  }

  get password(): string {
    return this._password;
  }

  get role(): Role {
    return this._role;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get data() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      password: this.password,
      role: this.role,
      createdAt: this.createdAt,
    };
  }

  static fromData(data: User['data']): User {
    return new User(
      data.id,
      data.name,
      data.email,
      data.password,
      data.role,
      data.createdAt,
    );
  }
}
