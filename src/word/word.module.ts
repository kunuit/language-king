import { forwardRef, Module } from '@nestjs/common';
import { WordService } from './word.service';
import { DictionaryModule } from '../dictionary/dictionary.module';
import { WordController } from './word.controller';

@Module({
  imports: [forwardRef(() => DictionaryModule)],
  providers: [WordService],
  controllers: [WordController],
})
export class WordModule {}
