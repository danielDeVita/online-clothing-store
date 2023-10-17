import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { TokenManager } from './tokenManager'; // Ensure the path is correct

@Injectable()
export class AuthGuard implements CanActivate {
  private tokenManager: TokenManager;

  constructor() {
    this.tokenManager = new TokenManager('LALALA');
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) return false;

    const verifiedToken = this.tokenManager.verifyToken(token);

    return !!verifiedToken;
  }
}
