import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { Product } from '../product/entities/product.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    const products = await Promise.all(
      createOrderDto.products.map((productId) =>
        this.productModel.findById(productId),
      ),
    );

    const total = products.reduce((sum, product) => sum + product.price, 0);

    for (const product of products) {
      let productToUpdate = await this.productModel.findById(product.id);
      if (!productToUpdate)
        throw new NotFoundException(`Product with id ${product.id} not found`);
      if (productToUpdate.stock > 0) {
        productToUpdate.stock -= 1;
      } else {
        throw new HttpException(
          `Out of stock for ${product.name}`,
          HttpStatus.I_AM_A_TEAPOT,
        );
      }
      await productToUpdate.save();
    }

    const newOrder = await this.orderModel.create({ ...createOrderDto, total });
    return newOrder.save();
  }

  async findAll() {
    return await this.orderModel
      .find()
      .populate('user', { _id: 0, __v: 0, password: 0 })
      .populate({
        path: 'products',
        populate: {
          path: 'category',
          select: '-_id -__v',
        },
      });
  }

  async findOne(id: string) {
    const order = await this.orderModel
      .findById(id)
      .populate('user', { _id: 0, __v: 0, password: 0 })
      .populate({
        path: 'products',
        populate: {
          path: 'category',
          select: '-_id -__v',
        },
      });
    if (!order) throw new NotFoundException(`Order with id ${id} not found`);
    return order;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    const foundOrder = await this.orderModel.findById(id);
    let total = foundOrder.total;

    if (updateOrderDto.products && updateOrderDto.products.length > 0) {
      const products = await Promise.all(
        updateOrderDto.products.map((productId) =>
          this.productModel.findById(productId),
        ),
      );
      total = products.reduce((sum, product) => sum + product.price, 0);

      for (const product of products) {
        let productToUpdate = await this.productModel.findById(product.id);
        if (!productToUpdate)
          throw new NotFoundException(
            `Product with id ${product.id} not found`,
          );
        if (productToUpdate.stock > 0) {
          productToUpdate.stock -= 1;
        } else {
          throw new HttpException(
            `Out of stock for ${product.name}`,
            HttpStatus.I_AM_A_TEAPOT,
          );
        }
        await productToUpdate.save();
      }
    }

    const order = await this.orderModel.findByIdAndUpdate(
      id,
      { ...updateOrderDto, total },
      {
        new: true,
      },
    );
    if (!order) throw new NotFoundException(`Order with id ${id} not found`);
    return (
      await order.populate('user', { _id: 0, __v: 0, password: 0 })
    ).populate({
      path: 'products',
      populate: {
        path: 'category',
        select: '-_id -__v',
      },
    });
  }

  async remove(id: string) {
    const order = await this.orderModel.findByIdAndDelete(id);
    if (!order) throw new NotFoundException(`Order with id ${id} not found`);
    return { message: 'Order deleted', order };
  }
}
