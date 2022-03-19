import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserType } from '@prisma/client';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { PrismaService } from 'src/prisma/prisma.service';

export interface JWTPayload {
  name: string;
  id: number;
  iat: number;
  exp: number;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prismaService: PrismaService,
  ) {}
  async canActivate(context: ExecutionContext) {
    const roles = this.reflector.getAllAndOverride('roles', [
      context.getHandler(),
      context.getClass(),
    ]) as UserType[];

    if (roles?.length) {
      const request = context.switchToHttp().getRequest() as Request;
      const token = request.headers?.authorization?.split('Bearer ')[1];
      try {
        const payload = (await jwt.verify(
          token,
          process.env.JWT_TOKEN_KEY,
        )) as JWTPayload;
        const user = await this.prismaService.user.findUnique({
          select: { user_type: true },
          where: { id: payload.id },
        });
        if (!user) return false;
        if (roles.includes(user.user_type)) return true;
        return false;
      } catch (error) {
        return false;
      }
    }
    return true;
  }
}
