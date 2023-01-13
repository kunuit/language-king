import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from 'src/user/schema/user.schema';
import { EnemyType, Level, Type } from '../type/room.interface';

export type RoomDocument = Room & Document;

@Schema({
  timestamps: true,
})
export class Room {
  @Prop({ trim: true, required: true })
  name: string;

  @Prop({ required: true, unique: true })
  roomKey: string;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  ownRoom: User;

  @Prop({ default: 1 })
  memQu: number;

  @Prop({ default: 9 })
  timeline: number;

  @Prop({ required: true })
  type: Type;

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  _id: mongoose.ObjectId;

  @Prop({ default: 5 })
  numberOfQuestion: number;

  @Prop({ default: Level.copper })
  level: Level;

  @Prop({ default: EnemyType.pve })
  enemyType: EnemyType;
}

export const RoomSchema = SchemaFactory.createForClass(Room);
