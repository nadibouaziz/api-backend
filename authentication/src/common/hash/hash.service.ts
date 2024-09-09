import { Injectable } from '@nestjs/common';
import { createHash, randomBytes } from 'crypto';

/**
 * Simple Hashing Service that will be improved later
 * Implement all possibilities of hashing. ( encrypt too ? )
 * https://nodejs.org/api/crypto.html
 */
@Injectable()
export class HashingService {
  private readonly algorithm = 'sha256';
  private readonly digest = 'hex';

  hash(plaintext: string, salt: string): string {
    const key = createHash(this.algorithm)
      .update(plaintext + salt)
      .digest(this.digest);

    return key;
  }

  compare(plaintext: string, salt: string, hash: string): boolean {
    const computedHash = this.hash(plaintext, salt);
    return computedHash === hash;
  }

  generateSalt(): string {
    return randomBytes(16).toString('hex');
  }
}
