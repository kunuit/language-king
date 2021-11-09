import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from 'src/user/schema/user.schema';
import { Type } from '../type/room.interface';

export type RoomDocument = Room & Document;

@Schema({
  timestamps: true,
})
export class Room {
  @Prop({ trim: true, required: true })
  name: String;

  @Prop({ required: true, unique: true })
  roomKey: String;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  ownRoom: User;

  @Prop({ default: 1 })
  memQu: Number;

  @Prop({ default: 25 })
  timeLine: Number;

  @Prop({ required: true })
  type: Type;

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  _id: mongoose.ObjectId;
}

export const RoomSchema = SchemaFactory.createForClass(Room);
