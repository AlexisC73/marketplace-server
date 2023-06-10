export abstract class HashService {
  abstract hash: (text: string) => Promise<string>;
  abstract verify: (text: string, hash: string) => Promise<boolean>;
}
