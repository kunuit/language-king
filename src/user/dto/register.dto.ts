import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Role } from '../type/jwt.interface';

export class RegisterDto {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @IsNotEmpty()
  username: String;

  @IsString()
  @MinLength(6)
  @MaxLength(6)
  password: String;

  @IsEmail()
  email: String;

  @Matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, {
    message: 'must is phone VN: XXX-XXX-XXXX',
  })
  phone: String;

  @IsNotEmpty()
  role: Role;
}

export class IsExistPhoneDto {
  @Matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, {
    message: 'must is phone VN: XXX-XXX-XXXX',
  })
  phone: String;
}
