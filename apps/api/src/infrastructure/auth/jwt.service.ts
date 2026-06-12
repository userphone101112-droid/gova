/**
 * JWT Service
 * 
 * JWT token generation and verification.
 */

export interface TokenPayload {
  userId: string;
  email: string;
}

export class JWTService {
  constructor(
    private readonly jwt: {
      sign: (payload: any, options?: any) => string;
      verify: (token: string, options?: any) => any;
    }
  ) {}

  generateToken(payload: TokenPayload): string {
    return this.jwt.sign(payload);
  }

  generateAccessToken(payload: TokenPayload): string {
    return this.jwt.sign(payload, { expiresIn: '15m' });
  }

  generateRefreshToken(payload: TokenPayload): string {
    return this.jwt.sign(payload, { expiresIn: '7d' });
  }

  verifyToken(token: string): TokenPayload {
    const decoded = this.jwt.verify(token);
    return {
      userId: decoded.userId,
      email: decoded.email,
    };
  }
}
