
import { ObjectId } from 'mongoose';

export interface SetUpPositionParams {
    positions: Object
    roomId: ObjectId
    roomKey: string
}