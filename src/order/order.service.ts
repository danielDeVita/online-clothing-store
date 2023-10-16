import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';

@Injectable()
export class OrderService {
  constructor(@InjectModel(Order.name) private orderModel: Model<Order>) {}

  async create(createOrderDto: CreateOrderDto) {
    const newOrder = await this.orderModel.create(createOrderDto);
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
    const order = await this.orderModel.findByIdAndUpdate(id, updateOrderDto, {
      new: true,
    });
    if (!order) throw new NotFoundException(`Order with id ${id} not found`);
    return order;
  }

  async remove(id: string) {
    const order = await this.orderModel.findByIdAndDelete(id);
    if (!order) throw new NotFoundException(`Order with id ${id} not found`);
    return { message: 'Order deleted', order };
  }
}
