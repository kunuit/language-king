import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from 'src/user/schema/user.schema';

import { Room } from './room.schema';

export type RoomDetailDocument = RoomDetail & Document;

@Schema({
  timestamps: true,
})
export class RoomDetail {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Room' })
  roomId: Room;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  _id: mongoose.ObjectId;
}

export const RoomDetailSchema = SchemaFactory.createForClass(RoomDetail);
