import { CacheModule, forwardRef, Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Room, RoomSchema } from './schema/room.schema';
import { RoomDetail, RoomDetailSchema } from './schema/room-detail.schema';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from 'src/user/user.module';
// import { EventsGateway } from './shooting-coordinates.gateway';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    forwardRef(() => UserModule),
    ConfigModule,
    CacheModule.register({
      store: redisStore,
      host: 'localhost',
      port: 6379
    }),
    MongooseModule.forFeatureAsync([
      {
        name: Room.name,
        useFactory: () => {
          const schema = RoomSchema;
          // handle something for middleware
          return schema;
        },
      },
    ]),
    MongooseModule.forFeatureAsync([
      {
        name: RoomDetail.name,
        useFactory: () => {
          const schema = RoomDetailSchema;
          // handle something for middleware
          return schema;
        },
      },
    ]),
  ],
  providers: [RoomService],
  controllers: [RoomController],
  exports: [RoomService]
})
export class RoomModule { }
