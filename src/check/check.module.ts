import { Module } from '@nestjs/common';
import { CheckService } from './check.service';
import { CheckController } from './check.controller';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CheckDetail, CheckDetailSchema } from './schema/check.schema';

@Module({
  imports: [
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
export class CheckModule {}
