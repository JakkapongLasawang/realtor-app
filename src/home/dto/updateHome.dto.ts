import { ApiProperty } from '@nestjs/swagger';
import { PropertyType } from '@prisma/client';
import { IsEnum, IsOptional, IsNumber, IsString } from 'class-validator';

export class UpdateHomeDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  numberOfBedrooms?: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  numberOfBathrooms?: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  city?: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  price?: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  landSize?: number;

  @ApiProperty({ enum: PropertyType })
  @IsEnum(PropertyType)
  @IsOptional()
  propertyType?: PropertyType;
}
