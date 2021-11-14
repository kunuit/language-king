import { ObjectId } from 'mongoose';

export enum Type {
  chaoTicLetter = 'chaoticLetter',
  truthyAndFalsyWord = 'truthyAndFalsyWord',
  description = 'descriptionWord',
}

export interface CreateRoomInFa {
  name: String;
  memQu: Number;
  ownRoom: ObjectId;
  type: Type;
  timeLine: Number;
}

export interface JoinRoomInFa {
  roomId: ObjectId;
  userId: ObjectId;
}
