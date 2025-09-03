import { Injectable } from "@nestjs/common";
import * as crypto from 'crypto';

@Injectable()
export class CryptoService {
    private readonly iv_length = 12; // AES-GCM IV length
    private readonly salt_length = 16; // Salt length for PBKDF2
    private readonly key_length = 32; // AES-256 key length
    private readonly iterations = 100000; // PBKDF2 iterations
    private readonly digest = 'sha256'; // Hashing algorithm for PBKDF2

    /**
 * PBKDF2를 Promise 기반으로 래핑
 * 100000번 이지만 성능 이슈 생기면 체크 할 필요 잇음
 */
    public async deriveKey(password: string, salt_string: string): Promise<Buffer> {
        const salt = Buffer.from(salt_string, 'base64'); // Ensure salt is in Buffer format
        return new Promise((resolve, reject) => {
            crypto.pbkdf2(password, salt, this.iterations, this.key_length, this.digest, (err, derivedKey) => {
                if (err)
                    reject(err);
                else
                    resolve(derivedKey);

            });
        });
    }

    // Salt 생성
    public generateSalt(): string {
        return crypto.randomBytes(this.salt_length).toString('base64');
    }

    // IV 생성
    public generateIV(): string {
        return crypto.randomBytes(this.iv_length).toString('base64');
    }

    // AES-GCM 암호화
    public encrypt(key: Buffer, iv_string: string): string {
        const iv = Buffer.from(iv_string, 'base64'); // Ensure IV is in Buffer format
        const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
        const encrypted = Buffer.concat([cipher.update(key), cipher.final()]);
        const tag = cipher.getAuthTag();
        return Buffer.concat([encrypted, tag]).toString('base64');
    }

    // AES-GCM 복호화
    public decrypt(cipher_text: string, key: Buffer, iv: string): Buffer {
        const ivBuffer = Buffer.from(iv, 'base64'); // Ensure IV is in Buffer format
        const data = Buffer.from(cipher_text, 'base64');
        const encrypted = data.slice(0, data.length - 16);
        const tag = data.slice(data.length - 16);
        const decipher = crypto.createDecipheriv('aes-256-gcm', key, ivBuffer);
        decipher.setAuthTag(tag);
        return Buffer.concat([decipher.update(encrypted), decipher.final()]);
    }
}