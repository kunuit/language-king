import { ObjectId } from 'mongoose';

export interface CreateCheckInFa {
  checkKey: String;
  roomId: ObjectId;
}
