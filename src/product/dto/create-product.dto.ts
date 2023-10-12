import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive, IsString } from 'class-validator';

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  readonly name: string;
  @ApiProperty()
  @IsString()
  readonly description: string;
  @ApiProperty()
  @IsString()
  readonly size: string;
  @ApiProperty()
  @IsString()
  readonly color: string;
  @ApiProperty()
  @IsNumber()
  @IsPositive()
  readonly price: number;
  @ApiProperty()
  @IsNumber()
  readonly stock: number;
  @ApiProperty()
  @IsString()
  readonly image: string;
  @ApiProperty()
  @IsString()
  readonly brand: string;
}
