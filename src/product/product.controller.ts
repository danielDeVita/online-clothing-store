import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AuthGuard } from 'src/auth/authGuard';

@ApiBearerAuth()
@ApiTags('Product')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new product',
    description: 'This api used to create a new product in the database',
  })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  /* @UseGuards(AuthGuard) */
  /* @UseGuards(JwtAuthGuard) */
  @Get()
  @ApiOperation({
    summary: 'Fetch all products',
    description: 'This API is used for fetching all products',
  })
  findAll(@Query('size') size?: string) {
    return this.productService.findAll(size);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Find one product by id',
    description:
      'this api is used to get details of particular product by its ID',
  })
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update an existing product',
    description: 'This API is used update an existing product',
  })
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'delete a product',
    description: 'this api delete single product',
  })
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}
