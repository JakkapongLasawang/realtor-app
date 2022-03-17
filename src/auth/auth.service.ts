import { ConflictException, HttpException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { SignupDto } from './dtos/signup.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserType } from '@prisma/client';
import { SigninDto } from './dtos/signin.dto';
import { ProductKeyDto } from './dtos/productKey.dto';

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}

  async signup(payload: SignupDto, userType: UserType) {
    const { email, password, name, phone } = payload;
    const userExists = await this.prismaService.user.findUnique({
      select: { id: true },
      where: {
        email,
      },
    });

    if (userExists) throw new ConflictException();

    const hash = await bcrypt.hash(password, 10);
    const user = await this.prismaService.user.create({
      data: {
        email,
        name,
        phone,
        password: hash,
        user_type: userType,
      },
    });
    return this.generateJWT(name, user.id);
  }

  async signin({ email, password }: SigninDto) {
    const user = await this.prismaService.user.findUnique({
      select: { id: true, name: true, password: true },
      where: {
        email,
      },
    });

    if (!user) throw new HttpException('Invalid credentials', 400);

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) return this.generateJWT(user.name, user.id);

    return new HttpException('Invalid credentials', 400);
  }

  private generateJWT(name: string, id: number) {
    const jwtToken = jwt.sign({ name, id }, process.env.JWT_TOKEN_KEY, {
      expiresIn: Number(process.env.JWT_EXPIRES_IN),
    });
    return { token: jwtToken };
  }

  async generateProductKey({ email, userType }: ProductKeyDto) {
    const string = `${email}-${userType}-${process.env.PRODUCT_KEY}`;
    const hash = await bcrypt.hash(string, 10);
    return { product_key: hash };
  }

  async compareProductKey(
    email: string,
    userType: UserType,
    productKey: string,
  ) {
    const string = `${email}-${userType}-${process.env.PRODUCT_KEY}`;
    return await bcrypt.compare(string, productKey);
  }
}
