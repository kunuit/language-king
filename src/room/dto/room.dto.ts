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
  name: string;

  @ApiProperty()
  @IsNumber()
  memQu: number;

  @ApiProperty()
  @IsEnum(Type)
  @IsNotEmpty()
  type: Type;

  @ApiProperty()
  @IsNumber()
  timeline: number;

  @ApiProperty()
  @IsNumber()
  numberOfQuestion: number;

  @ApiProperty()
  @IsString()
  level: Level;

  @ApiProperty()
  @IsEnum(EnemyType)
  enemyType: EnemyType;
}
