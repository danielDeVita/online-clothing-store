import * as crypto from 'crypto';

// interface Options {
//   expiresIn?: number;
// }

// interface SignInput {
//   //not used for typing values
//   payload: object;
//   secret: string;
//   options?: Options;
// }

const defaultOptions = {
  expiresIn: 8.64e7, // 1 day
};

class TokenManager {
  private static createSignature({
    // secret,
    encodedHeader,
    encodedPayload,
  }: {
    secret: string;
    encodedHeader: string;
    encodedPayload: string;
  }) {
    return crypto
      .createHmac('sha256', 'LULULU') //hardcoded secret NOT ok, just for simplicity
      .update(encodedHeader + '.' + encodedPayload)
      .digest('base64');
  }

  static sign({ payload, secret, options = {} }: any) {
    //:SignInput
    const mergedOptions = { ...defaultOptions, ...options };

    const header = { alg: 'HS256', typ: 'JWT' };

    const encodedHeader = Buffer.from(JSON.stringify(header)).toString(
      'base64',
    );
    const date = Date.now();
    const expiresIn = date + mergedOptions.expiresIn;

    const encodedPayload = Buffer.from(
      JSON.stringify({ ...payload, exp: expiresIn }),
    ).toString('base64');

    const signature = TokenManager.createSignature({
      encodedPayload,
      encodedHeader,
      secret,
    });

    console.log(`                header: ${encodedHeader}
                payload: ${encodedPayload}
                signature: ${signature}`);

    return `${encodedHeader}.${encodedPayload}.${signature}`;
  }

  static decode(token: string) {
    const parts = token.split('.');

    if (parts.length !== 3) {
      throw new Error('Invalid JWT');
    }

    const payload = parts[1];

    return JSON.parse(Buffer.from(payload, 'base64').toString('utf-8'));
  }

  static verify(token: string, secret: string) {
    const parts = token.split('.');

    if (parts.length !== 3) {
      throw new Error('Invalid token');
    }

    const [encodedHeader, encodedPayload, signature] = parts;

    const candidateSignature = TokenManager.createSignature({
      encodedHeader,
      encodedPayload,
      secret,
    });

    if (signature !== candidateSignature) {
      throw new Error('Invalid signature');
    }

    const decoded = TokenManager.decode(token);

    const { exp } = decoded;

    if (TokenManager.dateInPast({ exp })) {
      throw new Error('Token has expired');
    }
    console.log('token received:', token);

    return decoded;
  }

  private static dateInPast({ exp }: { exp: number }) {
    //helper FN for expiration
    const currentDate = new Date();

    return (
      new Date(exp).setHours(0, 0, 0, 0) <= currentDate.setHours(0, 0, 0, 0)
    );
  }
}

export default TokenManager;

/* import * as crypto from 'crypto';

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
} */

/* import * as crypto from 'crypto';

export class TokenManager {
  private secretKey: string;

  constructor(secretKey: string) {
    this.secretKey = secretKey;
  }

  private encodeBase64(str: string): string {
    return Buffer.from(str).toString('base64');
  }

  private decodeBase64(str: string): string {
    return Buffer.from(str, 'base64').toString('utf-8');
  }

  private stringify(obj: any): string {
    return JSON.stringify(obj);
  }

  private generateExpectedSignature(
    data: string,
    receivedSignature: string,
  ): string {
    const expectedSignature = `${data}:${receivedSignature}`;
    return expectedSignature;
  }

  generateToken(userId: string): string {
    const timestamp = Date.now().toString();
    const data = `${userId}:${timestamp}`;
    const signature = crypto
      .createHmac('sha256', this.secretKey)
      .update(data)
      .digest('hex');
    const header = this.encodeBase64(
      this.stringify({ alg: 'HS256', typ: 'JWT' }),
    );
    const token = `${header}.${this.encodeBase64(
      this.stringify({ data, signature }),
    )}`;
    return token;
  }

  verifyToken(token: string): { userId: string; timestamp: number } | null {
    if (!token) {
      return null;
    }

    const [header, payload] = token.split('.');
    const decodedPayload = JSON.parse(this.decodeBase64(payload));
    const { data, signature: receivedSignature } = decodedPayload; // Destructure receivedSignature here
    const [userId, timestamp] = data.split(':');
    const expectedSignature = this.generateExpectedSignature(
      data,
      receivedSignature,
    ); // Pass received data and signature here

    console.log('Received token:', token);
    console.log('Received data:', data);
    console.log('Received signature:', receivedSignature);

    console.log('Expected signature:', expectedSignature);
    console.log('Expected signaturo:', data + ':' + receivedSignature);

    if (data + ':' + receivedSignature === expectedSignature) {
      return {
        userId,
        timestamp: parseInt(timestamp),
      };
    }

    return null;
  }
} */
