import * as crypto from 'crypto';

export class TokenManager {
  private secretKey: string;

  constructor(secretKey: string) {
    this.secretKey = secretKey;
  }

  createToken(userId: string): string {
    const timestamp = Date.now();
    const data = `${userId}:${timestamp}`;
    const signature = crypto
      .createHmac('sha256', this.secretKey)
      .update(data)
      .digest('hex');
    const token = `${data}:${signature}`;
    return token;
  }

  verifyToken(token: string): { userId: string; timestamp: number } | null {
    const [userId, timestamp, receivedSignature] = token.split(':');
    const data = `${userId}:${timestamp}`;
    const expectedSignature = crypto
      .createHmac('sha256', this.secretKey)
      .update(data)
      .digest('hex');
    if (receivedSignature === expectedSignature) {
      return {
        userId,
        timestamp: parseInt(timestamp),
      };
    }
    return null;
  }
}
