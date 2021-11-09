import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { configValidationSchema } from './schema/config.schema';
import { UserModule } from './user/user.module';
import { DictionaryModule } from './dictionary/dictionary.module';
import { WordModule } from './word/word.module';
import { RoomModule } from './room/room.module';

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
  ],
})
export class AppModule {}
