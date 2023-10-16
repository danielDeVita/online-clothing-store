import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { Product } from 'src/product/entities/product.entity';

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

    const newOrder = await this.orderModel.create({ ...createOrderDto, total });
    return newOrder.save();
  }

  async findAll() {
    return await this.orderModel
      .find()
      .populate('user', { _id: 0, __v: 0, password: 0 })
      .populate('products', { _id: 0, __v: 0 });
  }

  async findOne(id: string) {
    const order = await this.orderModel
      .findById(id)
      .populate('user', { _id: 0, __v: 0, password: 0 })
      .populate('products', { _id: 0, __v: 0 });
    if (!order) throw new NotFoundException(`Order with id ${id} not found`);
    return order;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    const foundOrder = await this.orderModel.findById(id);
    let total = foundOrder.total;
    /* let total = 0; */
    if (updateOrderDto.products && updateOrderDto.products.length > 0) {
      const products = await Promise.all(
        updateOrderDto.products.map((productId) =>
          this.productModel.findById(productId),
        ),
      );
      total = products.reduce((sum, product) => sum + product.price, 0);
    }
    // } else {
    //  /*  const order = await this.orderModel.findById(id);
    //   total = order.total; */
    // }

    const order = await this.orderModel.findByIdAndUpdate(
      id,
      { ...updateOrderDto, total },
      {
        new: true,
      },
    );
    if (!order) throw new NotFoundException(`Order with id ${id} not found`);
    return order;
  }

  async remove(id: string) {
    const order = await this.orderModel.findByIdAndDelete(id);
    if (!order) throw new NotFoundException(`Order with id ${id} not found`);
    return { message: 'Order deleted', order };
  }
}
