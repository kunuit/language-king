import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class GetGiftLuckyLaKiButtonDto {
  percentLucky: Number;
}
