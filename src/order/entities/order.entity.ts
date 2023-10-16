import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Product } from 'src/product/entities/product.entity';
import { User } from 'src/user/entities/user.entity';

@Schema()
export class Order extends Document {
  @Prop({ type: Types.ObjectId, ref: User.name })
  user: User | Types.ObjectId;
  @Prop({ type: [{ type: Types.ObjectId, ref: Product.name }] })
  products: Types.Array<Product>;
  @Prop()
  total: number;
  @Prop()
  status: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
