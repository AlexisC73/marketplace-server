import { Role, User } from '../domain/user';

export const userBuilder = ({
  id = 'test-id',
  name = 'John',
  email = 'test@test.fr',
  password = 'password',
  role = Role.CLIENT,
  createdAt = new Date('2023-06-02T12:00:00Z'),
}: {
  id?: string;
  name?: string;
  email?: string;
  password?: string;
  role?: Role;
  createdAt?: Date;
} = {}) => {
  const props = { id, name, email, password, role, createdAt };
  return {
    withId: (_id: string) => userBuilder({ ...props, id: _id }),
    withName: (_name: string) => userBuilder({ ...props, name: _name }),
    withEmail: (_email: string) => userBuilder({ ...props, email: _email }),
    withPassword: (_password: string) =>
      userBuilder({ ...props, password: _password }),
    withRole: (_role: Role) => userBuilder({ ...props, role: _role }),
    withCreatedAt: (_createdAt: Date) =>
      userBuilder({ ...props, createdAt: _createdAt }),
    build: (): User => User.fromData(props),
  };
};
