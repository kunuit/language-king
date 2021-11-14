import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ObjectId } from 'mongoose';

export class CheckDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  checkKey: String;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  roomId: ObjectId;
}
