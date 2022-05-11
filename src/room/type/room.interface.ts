import { ObjectId } from 'mongoose';

export enum Type {
  chaoTicLetter = 'chaoticLetter',
  truthyAndFalsyWord = 'truthyAndFalsyWord',
  description = 'descriptionWord',
  listenWord = 'listenWord',
  spliceWord = 'spliceWord',
  shootingCoordinates = "shootingCoordinates"
}

export enum EnemyType {
  pve = 'pve',
  pvp = 'pvp'
}

export enum Level {
  copper = 'copper',
  silver = 'silver',
  gold = 'gold',
  platinum = 'platinum',
}

export enum StatusWaiting {
  waiting = 0,
  ready = 1,
}

export interface CreateRoomInFa {
  name: String;
  memQu: Number;
  ownRoom: ObjectId;
  type: Type;
  timeline: Number;
  level: Level;
  numberOfQuestion: Number;
  enemyType: EnemyType
}

export interface JoinRoomInFa {
  roomId: ObjectId;
  userId: ObjectId;
}
