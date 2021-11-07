import { Controller, Get, HttpStatus, Req, Res } from '@nestjs/common';
import { WordService } from './word.service';

@Controller('word')
export class WordController {
  constructor(private wordService: WordService) {}

  @Get('/')
  async getChaoticWord(@Res() res, @Req() req) {
    const chaoTicWord = this.wordService.getChaoticWord();
    return res.status(HttpStatus.OK).json({
      success: true,
      message: 'We have a chaotic word',
      data: { chaoTicWord },
    });
  }

  @Get('/trueandfalse')
  async getTrueAndFalseWord(@Res() res, @Req() req) {
    const trueAndFalseWord = this.wordService.getTrueAndFalseWord();

    // console.log(`trueAndFalseWord`, trueAndFalseWord);

    return res.status(HttpStatus.OK).json({
      success: true,
      message: 'We have a chaotic word',
      // data: { chaoTicWord },
    });
  }
}
