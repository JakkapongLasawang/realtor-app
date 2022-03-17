import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { HomeModule } from './home/home.module';

@Module({
  imports: [PrismaModule, AuthModule, UserModule, HomeModule],
  controllers: [AppController],
})
export class AppModule {}
