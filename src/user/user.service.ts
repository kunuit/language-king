import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import * as randRomString from 'randomstring';
import * as bcrypt from 'bcrypt';

import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { RegisterDto } from './dto/register.dto';
import { User, UserDocument } from './schema/user.schema';
import { CreateToken, JwtPayload, Role, tokenType } from './type/jwt.interface';
import { TypeENV } from 'common/env.type';

@Injectable()
export class UserService {
  private logger = new Logger('UserService');
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async create(registerDto: RegisterDto): Promise<User> {
    const createdUser = await new this.userModel(registerDto);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(createdUser.password, salt);

    createdUser.password = hashedPassword;

    return await createdUser.save();
  }

  async findOne(payload: object): Promise<any> {
    const user = await this.userModel.findOne(payload).exec();
    if (!user) {
      throw new HttpException(
        { message: 'invalid user', success: false },
        HttpStatus.OK,
      );
    }
    return user;
  }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userModel.findOne({ username }).exec();
    if (user && user.password === password) return user;
    return null;
  }

  // check exists
  async doesTypeExists(type: String, value: any): Promise<any> {
    const user = await this.userModel
      .findOne({
        [`${type}`]: value,
      })
      .exec();
    if (user) {
      return true;
    }
    return false;
  }

  async login(authCredentialsDto: AuthCredentialsDto): Promise<any> {
    const {
      username,
      password,
      firebaseRegisterToken,
      isGuest,
    } = authCredentialsDto;
    let user;

    if (isGuest) {
      const create = new this.userModel({
        username,
        password: 'Guest123!',
        email: 'guest123@gmail.com',
        phone: randRomString.generate({
          length: 10,
          charset: 'numeric',
        }),
        role: Role.guest,
        _id: new Types.ObjectId(),
      });
      user = await this.create(create);
    }

    if (!isGuest) {
      // find user in db
      user = await this.findOne({ username });

      // console.log(`password, user.password`, password, user.password);

      // compare passwords
      const areEqual = await bcrypt.compare(password, user.password);
      if (!areEqual) {
        throw new HttpException(
          { message: 'wrong password', success: false },
          HttpStatus.OK,
        );
      }
    }

    console.log(`user 1`, user);

    user.firebaseRegisterToken = firebaseRegisterToken;
    console.log(`user 2`, user);
    await user.save();

    // generate and sign access token, refresh token
    const accessToken = this._createToken({
      username,
      type: tokenType.AccessToken,
    });

    const refreshToken = this._createToken({
      username,
      type: tokenType.RefreshToken,
    });

    return {
      success: true,
      message: 'User has been created successfully',
      data: {
        ...accessToken,
        ...refreshToken,
        username: user.username,
        phone: user.phone,
        email: user.email,
        createdAt: user.createdAt,
      },
    };
  }

  async logout(_id: string): Promise<any> {
    const user = await this.userModel.findOne({ _id }).exec();

    user.firebaseRegisterToken = null;

    await user.save();
    return true;
  }

  private _createToken(createToken: CreateToken): any {
    const { username, type } = createToken;
    const token = this.jwtService.sign(
      { username },
      {
        secret:
          type === tokenType.AccessToken
            ? this.configService.get(TypeENV.JWT_SECRET_ACCESS)
            : this.configService.get(TypeENV.JWT_SECRET_REFRESH),
        expiresIn:
          type === tokenType.AccessToken
            ? this.configService.get(TypeENV.EXPIRES_IN_ACCESS)
            : this.configService.get(TypeENV.EXPIRES_IN_REFRESH),
      },
    );
    return {
      [`expiresIn-${type}`]:
        type === tokenType.AccessToken
          ? this.configService.get(TypeENV.EXPIRES_IN_ACCESS)
          : this.configService.get(TypeENV.EXPIRES_IN_REFRESH),
      [`${type}`]: token,
    };
  }
}
