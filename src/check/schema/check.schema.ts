import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Room } from 'src/room/schema/room.schema';

export type CheckDetailDocument = CheckDetail & Document;

@Schema({
  timestamps: true,
})
export class CheckDetail {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Room' })
  roomId: Room;

  @Prop({ type: String })
  checkKey: string;

  @Prop({ type: Object })
  checkPosition: Object;

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  _id: mongoose.ObjectId;
}

export const CheckDetailSchema = SchemaFactory.createForClass(CheckDetail);
