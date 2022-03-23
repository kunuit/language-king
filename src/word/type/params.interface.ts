import { ObjectId } from "mongoose";

export interface SpliceWordParams {
    preWord?: String;
}

export interface NextSpliceWordParams {
    roomId?: ObjectId;
    oldWord?: String;
}
