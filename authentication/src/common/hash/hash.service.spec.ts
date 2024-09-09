import { Test, TestingModule } from '@nestjs/testing';
import { HashingService } from './hash.service';
import { createHash } from 'crypto';

describe('HashingService', () => {
  let hashingService: HashingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HashingService],
    }).compile();

    hashingService = module.get<HashingService>(HashingService);
  });

  describe('hash', () => {
    it('should hash the plaintext with the given salt', () => {
      const plaintext = 'password123';
      const salt = 'randomsalt';
      const expectedHash = createHash('sha256')
        .update(plaintext + salt)
        .digest('hex');

      const hash = hashingService.hash(plaintext, salt);
      expect(hash).toEqual(expectedHash);
    });
  });

  describe('compare', () => {
    it('should return true for matching plaintext and hash', () => {
      const plaintext = 'password123';
      const salt = 'randomsalt';
      const hash = hashingService.hash(plaintext, salt);

      const result = hashingService.compare(plaintext, salt, hash);
      expect(result).toBe(true);
    });

    it('should return false for non-matching plaintext and hash', () => {
      const plaintext = 'password123';
      const salt = 'randomsalt';
      const wrongPlaintext = 'wrongpassword';
      const hash = hashingService.hash(plaintext, salt);

      const result = hashingService.compare(wrongPlaintext, salt, hash);
      expect(result).toBe(false);
    });
  });

  describe('generateSalt', () => {
    it('should generate a salt of length 32', () => {
      const salt = hashingService.generateSalt();
      expect(salt).toHaveLength(32); // 16 bytes = 32 hex characters
    });

    it('should generate a different salt each time', () => {
      const salt1 = hashingService.generateSalt();
      const salt2 = hashingService.generateSalt();
      expect(salt1).not.toEqual(salt2);
    });
  });
});
