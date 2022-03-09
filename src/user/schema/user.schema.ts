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
  username: String;

  @Prop({ required: true })
  password: String;

  @Prop({ required: true })
  email: String;

  @Prop({ required: true })
  phone: String;

  @Prop({ unique: false })
  firebaseRegisterToken: string;

  @Prop({ required: true })
  role: Role;

  @Prop({ default: 300 })
  gold: Number;

  @Prop({ default: 12 })
  mana: Number;

  @Prop({ default: 0 })
  point: Number;

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  _id: mongoose.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(User);
