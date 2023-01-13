import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Role } from '../type/jwt.interface';

export class AuthCredentialsDto {
  @Matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, {
    message: 'must is phone VN: XXX-XXX-XXXX',
  })
  phone: string;

  @IsString()
  @MinLength(6)
  @MaxLength(6)
  password: string;

  @IsString()
  @IsNotEmpty()
  firebaseRegisterToken: string;

  @IsEnum(Role)
  role: Role;
}
