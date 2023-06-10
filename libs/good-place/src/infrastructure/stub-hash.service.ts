export class StubHashService {
  async hash(text: string) {
    return text;
  }
  async verify(text: string, hash: string) {
    return text === hash;
  }
}
