import bcrypt from 'bcrypt';

export class PasswordHasher {
  constructor(private readonly salt: number) {
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.salt);
  }

  async comparePasswordsWithHash(password: string, hash: string): Promise<boolean> {
    try {
      return await bcrypt.compare(password, hash);
    } catch {
      return false;
    }
  }


}