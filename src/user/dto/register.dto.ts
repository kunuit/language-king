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
  @MinLength(8)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password too weak',
  })
  password: String;

  @IsEmail()
  email: String;

  @Matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, {
    message: 'must is phone: XXX-XXX-XXXX',
  })
  phone: String;

  @IsNotEmpty()
  role: Role;
}
