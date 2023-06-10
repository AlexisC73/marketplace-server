import { Injectable } from '@nestjs/common';
import { HashService } from '../application/hash.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptHashService implements HashService {
  async hash(text: string): Promise<string> {
    return bcrypt.hash(text, 10);
  }
  async verify(text: string, hash: string): Promise<boolean> {
    return bcrypt.compare(text, hash);
  }
}
