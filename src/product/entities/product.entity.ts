import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Category } from 'src/category/entities/category.entity';

@Schema()
export class Product extends Document {
  @Prop()
  name: string;
  @Prop()
  description: string;
  @Prop({ index: true })
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
  @Prop({ type: Types.ObjectId, ref: Category.name })
  category: Category | Types.ObjectId;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
