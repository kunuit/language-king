import { ObjectId } from 'mongoose';

export interface SpliceWordParams {
  preWord?: string;
}

export interface NextSpliceWordParams {
  roomId?: ObjectId;
  oldWord?: string;
}
