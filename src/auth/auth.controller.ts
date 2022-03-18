import {
  Body,
  Controller,
  Param,
  ParseEnumPipe,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { UserType } from '@prisma/client';
import { AuthService } from './auth.service';
import { ProductKeyDto } from './dtos/productKey.dto';
import { SignupDto, UserTypeDto } from './dtos/signup.dto';
import { SigninDto } from './dtos/signin.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup/:userType')
  async signup(@Body() body: SignupDto, @Param() { userType }: UserTypeDto) {
    const { email, productKey } = body;
    if (userType !== UserType.BUYER) {
      if (!body.productKey) throw new UnauthorizedException();

      const isMatch = await this.authService.compareProductKey(
        email,
        userType,
        productKey,
      );

      if (!isMatch) throw new UnauthorizedException();
    }

    return this.authService.signup(body, userType);
  }

  @Post('signin')
  async signin(@Body() body: SigninDto) {
    return this.authService.signin(body);
  }

  @Post('key')
  async generateProductKey(@Body() Body: ProductKeyDto) {
    return this.authService.generateProductKey(Body);
  }
}
