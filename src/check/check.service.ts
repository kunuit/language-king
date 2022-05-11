import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId, Types } from 'mongoose';
import { CheckDetail, CheckDetailDocument } from './schema/check.schema';
import { CreateCheckInFa } from './type/check.interface';

@Injectable()
export class CheckService {
  constructor(
    @InjectModel(CheckDetail.name)
    private checkDetailModel: Model<CheckDetailDocument>,
  ) { }

  async createCheckDetail(
    createCheckInFa: CreateCheckInFa,
  ): Promise<CheckDetailDocument> {
    const create = new this.checkDetailModel({
      ...createCheckInFa,
      _id: new Types.ObjectId(),
    });

    return await this.checkDetailModel.create(create);
  }

  async deleteCheckDetail(_id: ObjectId): Promise<void> {
    await this.checkDetailModel.deleteMany({ _id });
  }

  async find(
    filter: Object,
    anything?: Object,
    options?: Object,
  ): Promise<CheckDetailDocument[]> {
    return await this.checkDetailModel
      .find({ ...filter }, anything ? anything : null, options ? options : null)
      .exec();
  }

  async findOne(
    filter: Object,
    anything?: Object,
    options?: Object,
  ): Promise<CheckDetailDocument> {
    return await this.checkDetailModel
      .findOne(
        { ...filter },
        anything ? anything : null,
        options ? options : null,
      ).exec();
  }
}
