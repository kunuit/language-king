import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import cacheManager from 'cache-manager'
import * as redisStore from 'cache-manager-redis-store';

import { TypeENV } from 'common/env.type';
import { User, UserSchema } from './schema/user.schema';
import { JwtStrategy } from './strategy/jwt.strategy';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    ConfigModule,
    CacheModule.register({
      store: redisStore,
      host: 'localhost',
      port: 6379
    }),
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
          var memoryStore = cacheManager.caching({ store: redisStore, ttl: 3600 })
          const schema = UserSchema;

          schema.pre<User>('save', async function (next: Function) {
            const user = this;

            // const salt = await bcrypt.genSalt(10);
            // const hashedPassword = await bcrypt.hash(User.password, salt);

            // User.password = hashedPassword;
            memoryStore.set(`${user._id?.toString()}`, user, { ttl: 3600 })

            next();
          });

          return schema;
        },
      },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService, JwtStrategy],
  exports: [UserService],
})
export class UserModule { }
