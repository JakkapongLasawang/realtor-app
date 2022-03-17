import { ApiProperty } from '@nestjs/swagger';
import { UserType } from '@prisma/client';
import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';

export class ProductKeyDto {
  @ApiProperty({ default: 'realtor@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ default: UserType.REALTOR })
  @IsEnum(UserType)
  userType: UserType;
}
