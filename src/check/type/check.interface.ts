import { ObjectId } from 'mongoose';

export interface CreateCheckInFa {
  checkKey?: string;
  checkPosition?: Object;
  roomId: ObjectId;
}
