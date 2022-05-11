import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type, Level, EnemyType } from '../type/room.interface';

export class CreateRoomDto {
  @ApiProperty()
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @IsNotEmpty()
  name: String;

  @ApiProperty()
  @IsNumber()
  memQu: Number;

  @ApiProperty()
  @IsEnum(Type)
  @IsNotEmpty()
  type: Type;

  @ApiProperty()
  @IsNumber()
  timeline: Number;

  @ApiProperty()
  @IsNumber()
  numberOfQuestion: Number;

  @ApiProperty()
  @IsString()
  level: Level;

  @ApiProperty()
  @IsEnum(EnemyType)
  enemyType: EnemyType
}
