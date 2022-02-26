import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class AuthCredentialsDto {
  @Matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, {
    message: 'must is phone: XXX-XXX-XXXX',
  })
  phone: String;

  @IsString()
  @MinLength(6)
  @MaxLength(6)
  password: String;

  @IsString()
  @IsNotEmpty()
  firebaseRegisterToken: String;

  @IsBoolean()
  isGuest: Boolean;
}
