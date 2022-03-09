import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as randomstring from 'randomstring';
import { RoomDetail, RoomDetailDocument } from './schema/room-detail.schema';
import { Room, RoomDocument } from './schema/room.schema';
import { CreateRoomInFa, JoinRoomInFa } from './type/room.interface';

@Injectable()
export class RoomService {
  logger: Logger;
  constructor(
    @InjectModel(Room.name) private roomModel: Model<RoomDocument>,
    @InjectModel(RoomDetail.name)
    private roomDetailModel: Model<RoomDetailDocument>,
  ) {
    this.logger = new Logger();
  }

  //* room
  async createRoom(createRoomInFa: CreateRoomInFa): Promise<Room> {
    const randomKey = randomstring.generate(7);
    const create = new this.roomModel({
      ...createRoomInFa,
      roomKey: randomKey,
      _id: new Types.ObjectId(),
    });

    return await this.roomModel.create(create);
  }

  async find(filter: Object): Promise<Room[]> {
    return await this.roomModel.find({ ...filter }).exec();
  }
  async findOne(filter: Object): Promise<Room> {
    return await this.roomModel.findOne({ ...filter }).exec();
  }

  //* room detail
  async joinRoom(joinRoomInFa: JoinRoomInFa): Promise<RoomDetailDocument> {
    const create = new this.roomDetailModel({
      ...joinRoomInFa,
      _id: new Types.ObjectId(),
    });

    return await this.roomDetailModel.create(create);
  }

  async findRD(filter: Object): Promise<RoomDetailDocument[]> {
    return await this.roomDetailModel.find({ ...filter }).exec();
  }
  async findOneRD(filter: Object): Promise<RoomDetailDocument> {
    return await this.roomDetailModel.findOne({ ...filter }).exec();
  }
}
