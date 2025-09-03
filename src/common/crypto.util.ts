import * as crypto from 'crypto';

export async function pbkdf2Async(password: string, salt: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(password, salt, 100000, 32, 'sha256', (err, derivedKey) => {
      if (err) reject(err);
      else resolve(derivedKey);
    });
  });
}

export function generateSalt(): string {
  return crypto.randomBytes(16).toString('base64');
}

export function generateIV(): Buffer {
  return crypto.randomBytes(12);
}

export function aesGcmEncrypt(key: Buffer, iv: Buffer): { cipher_text: string; tag: Buffer } {
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const encrypted = Buffer.concat([cipher.update(key), cipher.final()]);
  const tag = cipher.getAuthTag();
  return { cipher_text: Buffer.concat([encrypted, tag]).toString('base64'), tag };
}

// 복호화 함수도 필요하다면 아래처럼 추가 가능
export function aesGcmDecrypt(cipher_text: string, key: Buffer, iv: Buffer): Buffer {
  const data = Buffer.from(cipher_text, 'base64');
  const encrypted = data.slice(0, data.length - 16);
  const tag = data.slice(data.length - 16);
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(encrypted), decipher.final()]);
}
