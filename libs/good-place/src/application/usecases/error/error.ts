export class InvalidTypeError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = 'InvalidTypeError';
  }
}
export class UserNotFoundError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = 'UserNotFoundError';
  }
}
export class UnauthorizedError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

export class BadRequestError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = 'BadRequestError';
  }
}

export class NoPrivilegeGranted extends Error {
  constructor(message?: string) {
    super(message);
    this.name = 'NoPrivilegeGranted';
  }
}
