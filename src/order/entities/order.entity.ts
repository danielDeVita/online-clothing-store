import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Product } from '../../product/entities/product.entity';
import { User } from '../../user/entities/user.entity';

@Schema()
export class Order extends Document {
  @Prop({ type: Types.ObjectId, ref: User.name })
  user: User | Types.ObjectId;
  @Prop({ type: [{ type: Types.ObjectId, ref: Product.name }] })
  products: Types.Array<Product | Types.ObjectId>;
  @Prop()
  total: number;
  @Prop({
    required: true,
    enum: ['pending', 'shipped', 'delivered'],
    default: 'pending',
  })
  status: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
