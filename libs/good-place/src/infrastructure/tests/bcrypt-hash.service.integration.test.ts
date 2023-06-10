import { BcryptHashService } from '../bcrypt-hash.service';
import * as bcrypt from 'bcrypt';

describe('BcryptService', () => {
  test('should hash a text', async () => {
    const text = 'any_text';
    const hashService = new BcryptHashService();
    const hashedText = await hashService.hash(text);
    expect(hashedText).not.toBe(text);
  });

  test('should verify a text and a hash', async () => {
    const text = 'any_text';
    const hashService = new BcryptHashService();
    const hashedText = await bcrypt.hash(text, 10);
    const isValid = await hashService.verify(text, hashedText);
    expect(isValid).toBe(true);
  });
});
