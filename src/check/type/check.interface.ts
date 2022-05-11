import { ObjectId } from 'mongoose';

export interface CreateCheckInFa {
  checkKey?: String;
  checkPosition?: Object;
  roomId: ObjectId;
}
