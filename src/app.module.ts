import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { configValidationSchema } from './schema/config.schema';
import { UserModule } from './user/user.module';
import { DictionaryModule } from './dictionary/dictionary.module';
import { WordModule } from './word/word.module';
import { RoomModule } from './room/room.module';
import { CheckModule } from './check/check.module';
import { LoggerMiddleware } from './utils/middleware/logger.middleware';
import { EarnMoreModule } from './earn-more/earn-more.module';
import { ShootingCoordinatesModule } from './shooting-coordinates/shooting-coordinates.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      validationSchema: configValidationSchema,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configServer: ConfigService) => ({
        uri: configServer.get('DB_HOST'),
        // useNewUrlParser: true,
        // useUnifiedTopology: true,
      }),
    }),
    UserModule,
    DictionaryModule,
    WordModule,
    RoomModule,
    CheckModule,
    EarnMoreModule,
    ShootingCoordinatesModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
