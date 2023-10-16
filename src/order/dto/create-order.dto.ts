import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateOrderDto {
  @ApiProperty()
  @IsMongoId()
  readonly user: string;
  @ApiProperty()
  @IsArray()
  @IsMongoId({
    each: true,
    message: 'Invalid product ID in the products array',
  })
  readonly products: string[];
  @ApiProperty()
  @IsNumber()
  @IsOptional()
  readonly total?: number = 0;
  @ApiProperty()
  @IsOptional()
  @IsString()
  readonly status?: string = 'pending';
}
