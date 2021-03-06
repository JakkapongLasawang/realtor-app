import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';

export class UserInterceptor implements NestInterceptor {
  async intercept(context: ExecutionContext, next: CallHandler<any>) {
    const request = context.switchToHttp().getRequest() as Request;

    // if undefined skip
    const token = request.headers?.authorization?.split('Bearer ')[1];
    const user = await jwt.decode(token);
    request.user = user;
    return next.handle();
  }
}
