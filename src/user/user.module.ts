import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { TypeENV } from 'common/env.type';
import { User, UserSchema } from './schema/user.schema';
import { JwtStrategy } from './strategy/jwt.strategy';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get(TypeENV.JWT_SECRET_ACCESS),
        signOptions: {
          expiresIn: 3600,
        },
      }),
    }),
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        useFactory: () => {
          const schema = UserSchema;

          // schema.pre<User>('save', async function (next: Function) {
          //   const User = this;

          //   const salt = await bcrypt.genSalt(10);
          //   const hashedPassword = await bcrypt.hash(User.password, salt);

          //   User.password = hashedPassword;

          //   next();
          // });

          return schema;
        },
      },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService, JwtStrategy],
})
export class UserModule {}
