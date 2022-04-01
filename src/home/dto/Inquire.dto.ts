import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class inquireDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  message: string;
}
