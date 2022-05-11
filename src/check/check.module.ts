import { forwardRef, Module } from '@nestjs/common';
import { CheckService } from './check.service';
import { CheckController } from './check.controller';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CheckDetail, CheckDetailSchema } from './schema/check.schema';
import { UserModule } from 'src/user/user.module';
import { DictionaryModule } from 'src/dictionary/dictionary.module';
import { WordModule } from 'src/word/word.module';
import { ShootingCoordinatesModule } from './../shooting-coordinates/shooting-coordinates.module';

@Module({
  imports: [
  forwardRef(() => UserModule),
    forwardRef(() => DictionaryModule),
    forwardRef(() => WordModule),
    forwardRef(() => ShootingCoordinatesModule),
    ConfigModule,
    MongooseModule.forFeatureAsync([
      {
        name: CheckDetail.name,
        useFactory: () => {
          const schema = CheckDetailSchema;
          // handle something for middleware
          return schema;
        },
      },
    ]),
  ],
  providers: [CheckService],
  controllers: [CheckController],
  exports: [CheckService],
})
export class CheckModule { }
