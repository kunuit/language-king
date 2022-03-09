import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PassportStrategy } from '@nestjs/passport';
import { Model } from 'mongoose';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { User, UserDocument } from '../schema/user.schema';
import { JwtPayload } from '../type/jwt.interface';
import { ConfigService } from '@nestjs/config';
import { TypeENV } from '../../../common/env.type';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get(TypeENV.JWT_SECRET_ACCESS),
    });
  }
  async validate(payload: JwtPayload): Promise<User> {
    const { phone } = payload;
    const user = await this.userModel.findOne({ phone });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
