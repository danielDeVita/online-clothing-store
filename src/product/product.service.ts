import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const newProduct = await this.productModel.create(createProductDto);
    return newProduct.save();
  }

  async findAll(size: string) {
    if (size) {
      return await this.productModel
        .find({ size })
        .populate('category', { _id: 0, __v: 0 });
    } else
      return await this.productModel
        .find()
        .populate('category', { _id: 0, __v: 0 });
  }

  async findOne(id: string) {
    const product = await this.productModel
      .findById(id)
      .populate('category', { _id: 0, __v: 0 });
    if (!product)
      throw new NotFoundException(`Product with id ${id} not found`);
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.productModel.findByIdAndUpdate(
      id,
      updateProductDto,
      { new: true },
    );
    if (!product)
      throw new NotFoundException(`Product with id ${id} not found`);
    return product;
  }

  async remove(id: string) {
    const product = await this.productModel.findByIdAndDelete(id);
    if (!product)
      throw new NotFoundException(`Product with id ${id} not found`);
    return { message: 'Product deleted', product };
  }
}
