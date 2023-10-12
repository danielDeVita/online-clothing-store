import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Product extends Document {
  @Prop()
  name: string;
  @Prop()
  description: string;
  @Prop()
  size: string;
  @Prop()
  color: string;
  @Prop()
  price: number;
  @Prop()
  stock: number;
  @Prop()
  image: string;
  @Prop()
  brand: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
