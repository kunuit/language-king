import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ObjectId } from 'mongoose';

export class CheckDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  checkKey: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  roomId: ObjectId;
}

export class CheckShootingCoo {
  @ApiProperty()
  @IsString()
  enemyId: ObjectId;

  @ApiProperty()
  @IsNumber()
  orderPlaying: number;

  @ApiProperty()
  @IsNumber()
  position: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  roomId: ObjectId;

  @ApiProperty()
  @IsString()
  roomKey: String;
}
