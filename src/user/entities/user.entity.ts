import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  /* @Prop({ required: true })
  username: string; */
  @Prop({ required: true, unique: true })
  email: string;
  @Prop({ required: true })
  password: string;
  @Prop()
  firstName: string;
  @Prop()
  lastName: string;
  @Prop() //('customer' or 'admin')
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
