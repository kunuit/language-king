import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Role } from '../type/jwt.interface';

export type UserDocument = User & Document;

@Schema({
  timestamps: true,
})
export class User {
  @Prop({ trim: true, dropDups: true, index: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ unique: false })
  firebaseRegisterToken: string;

  @Prop({ required: true })
  role: Role;

  @Prop({ default: 300 })
  gold: number;

  @Prop({ default: 12 })
  mana: number;

  @Prop({ default: 0 })
  point: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  _id: mongoose.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(User);
