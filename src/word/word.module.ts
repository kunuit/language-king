import { forwardRef, Module } from '@nestjs/common';
import { WordService } from './word.service';
import { DictionaryModule } from '../dictionary/dictionary.module';
import { WordController } from './word.controller';
import { RoomModule } from 'src/room/room.module';
import { CheckModule } from 'src/check/check.module';

@Module({
  imports: [
    forwardRef(() => DictionaryModule),
    forwardRef(() => RoomModule),
    forwardRef(() => CheckModule),
  ],
  providers: [WordService],
  controllers: [WordController],
  exports: [WordService],
})
export class WordModule { }
