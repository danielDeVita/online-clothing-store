import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsMongoId, IsNumber, IsString } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty()
  @IsMongoId()
  readonly user: string;
  @ApiProperty()
  @IsArray()
  readonly products: string[];
  @ApiProperty()
  @IsNumber()
  readonly total: number;
  @ApiProperty()
  @IsString()
  readonly status: string;
}
