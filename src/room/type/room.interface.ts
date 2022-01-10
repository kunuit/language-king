import { ObjectId } from 'mongoose';

export enum Type {
  chaoTicLetter = 'chaoticLetter',
  truthyAndFalsyWord = 'truthyAndFalsyWord',
  description = 'descriptionWord',
}

export enum Level {
  copper = 'copper',
  silver = 'silver',
  gold = 'gold',
  platinum = 'platinum',
}

export interface CreateRoomInFa {
  name: String;
  memQu: Number;
  ownRoom: ObjectId;
  type: Type;
  timeline: Number;
  level: Level;
  numberOfQuestion: Number;
}

export interface JoinRoomInFa {
  roomId: ObjectId;
  userId: ObjectId;
}
