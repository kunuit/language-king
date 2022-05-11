import { CACHE_MANAGER, HttpException, HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
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
import { ParamsPlus, PayloadFindOne } from './type/params';
import { Cache } from 'cache-manager';

@Injectable()
export class UserService {
  private logger = new Logger('UserService');
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
    private configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) { }

  async create(registerDto: RegisterDto): Promise<User> {
    const createdUser = await new this.userModel({
      ...registerDto,
      _id: new Types.ObjectId(),
    });

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(createdUser.password, salt);

    createdUser.password = hashedPassword;

    return await createdUser.save();
  }

  async findOne(payload: PayloadFindOne): Promise<UserDocument> {
    const isCacheUser = await this.cacheManager.get(`${payload._id?.toString()}`)
    if (!!isCacheUser) return this.userModel.hydrate(isCacheUser);
    const user = await this.userModel.findOne(payload).exec()
    if (!user) {
      throw new HttpException(
        { message: 'invalid user', success: false },
        HttpStatus.OK,
      );
    }
    return user;
  }

  async validateUser(username: String, password: String): Promise<any> {
    const user = await this.findOne({ username });
    if (user && user.password === password) return user;
    return null;
  }

  // check exists
  async doesTypeExists(type: String, value: any): Promise<any> {
    const user = await this.userModel.findOne({
      [`${type}`]: value,
    });
    if (user) {
      return user;
    }
    return false;
  }

  async login(authCredentialsDto: AuthCredentialsDto): Promise<any> {
    const { phone, password, firebaseRegisterToken, role } = authCredentialsDto;
    let user;

    if (role === Role.guest) {
      user = await this.create({
        username: `#${randRomString.generate({
          length: 10,
          charset: 'numeric',
        })}`,
        password: `${randRomString.generate({
          length: 6,
          charset: 'numeric',
        })}`,
        email: 'guest123@gmail.com',
        phone,
        role: Role.guest,
      });
    }

    if (role === Role.user) {
      // find user in db
      user = await this.findOne({ phone });

      // compare passwords
      const areEqual = await bcrypt.compare(password, user.password);
      if (!areEqual) {
        throw new HttpException(
          { message: 'wrong password', success: false },
          HttpStatus.OK,
        );
      }
    }

    user.firebaseRegisterToken = firebaseRegisterToken;
    await user.save();

    // generate and sign access token, refresh token
    const accessToken = this._createToken({
      phone,
      _id: user?._id,
      type: tokenType.AccessToken,
    });

    const refreshToken = this._createToken({
      phone,
      _id: user?._id,
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
        role: user.role,
        mana: user.mana,
        gold: user.gold,
        point: user.point,
        _id: user?._id?.toString(),
      },
    };
  }

  async logout(_id: String): Promise<any> {
    const user = await this.findOne({ _id });

    user.firebaseRegisterToken = null;

    await user.save();
    return true;
  }

  async update(_id: String, updateParams: Object): Promise<any> {
    const user = await this.userModel.findByIdAndUpdate({ _id }, updateParams);
    if (!user) {
      throw new HttpException(
        { message: 'invalid user', success: false },
        HttpStatus.OK,
      );
    }
    return user;
  }

  async updateManaGoldPoint(
    _id: String,
    paramsPlus: ParamsPlus,
  ): Promise<User> {
    const user = await this.findOne({ _id });
    user.gold = +user.gold + +(paramsPlus.gold || 0);
    user.mana = +user.mana + +(paramsPlus.mana || 0);
    user.point = +user.point + +(paramsPlus.point || 0);
    return await user.save();
  }

  async isMana(_id: String): Promise<Boolean> {
    const user = await this.findOne({ _id });
    if (user.mana <= 0) return false;
    return true;
  }

  private _createToken(createToken: CreateToken): any {
    const { phone, _id, type } = createToken;
    const token = this.jwtService.sign(
      { phone, _id },
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
