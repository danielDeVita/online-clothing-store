/* import { PartialType } from '@nestjs/mapped-types'; */
import { CreateOrderDto } from './create-order.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsOptional } from 'class-validator';
import { PartialType } from '@nestjs/swagger';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  @ApiProperty()
  @IsOptional()
  @IsIn(['pending', 'shipped', 'delivered'], {
    message: 'Status must be one of: pending, shipped, delivered',
  })
  readonly status?: string;
}
