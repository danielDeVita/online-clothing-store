import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import TokenManager from './tokenManager'; 

@Injectable()
export class AuthGuard implements CanActivate {
  // private tokenManager: TokenManager;

  // constructor() {
  //   this.tokenManager = new TokenManager();
  // }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) return false;

    // const verifiedToken = this.tokenManager.verify(token);
    const verifiedToken = TokenManager.verify(token, 'LALALA');

    return !!verifiedToken;
  }
}
