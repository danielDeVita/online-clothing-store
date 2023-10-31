import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsPositive,
  IsString,
  IsMongoId,
  IsNotEmpty,
} from 'class-validator';

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
  // @IsNumber()
  // @IsPositive()
  @IsNotEmpty()
  readonly price: number;
  @ApiProperty()
  // @IsNumber()
  @IsNotEmpty()
  readonly stock: number;
  @ApiProperty()
  // @IsString()
  // @IsNotEmpty()
  readonly image: any; //antes era string
  @ApiProperty()
  @IsString()
  readonly brand: string;
  @ApiProperty()
  @IsMongoId()
  readonly category: string;
}
