import {
  Controller,
  Get,
  HttpStatus,
  Req,
  Res,
  Param,
  Inject,
  forwardRef,
  ValidationPipe,
  UsePipes,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RandomInt } from 'common/utils/math';
import { CheckService } from 'src/check/check.service';
import { RoomService } from 'src/room/room.service';
import { Type } from 'src/room/type/room.interface';
import { WordService } from './word.service';

@Controller('word')
export class WordController {
  constructor(
    private wordService: WordService,
    @Inject(forwardRef(() => RoomService))
    private roomService: RoomService,
    @Inject(forwardRef(() => CheckService))
    private checkService: CheckService,
  ) {}

  // @Get('/')
  // async getChaoticWord(@Res() res, @Req() req) {
  //   const chaoTicWord = this.wordService.getChaoticWord();
  //   return res.status(HttpStatus.OK).json({
  //     success: true,
  //     message: 'We have a chaotic word',
  //     data: { chaoTicWord },
  //   });
  // }

  // @Get('/true-and-false')
  // async getTrueAndFalseWord(@Res() res, @Req() req) {
  //   const trueAndFalseWord = this.wordService.getTrueAndFalseWord();

  //   // console.log(`trueAndFalseWord`, trueAndFalseWord);

  //   return res.status(HttpStatus.OK).json({
  //     success: true,
  //     message: 'We have a chaotic word',
  //     // data: { chaoTicWord },
  //   });
  // }

  @UseGuards(AuthGuard('jwt'))
  @Get('/bot-res/:roomId')
  @UsePipes(ValidationPipe)
  async botRes(@Req() req, @Res() res, @Param() param) {
    const { roomId } = param;
    const { _id } = req.user;

    const isRoom = await this.roomService.findOne({ _id: roomId });

    if (!isRoom)
      return res.status(HttpStatus.NOT_FOUND).json({
        success: false,
        message: 'Not found this room',
      });

    const isJointRoom = await this.roomService.findOneRD({
      roomId,
      userId: _id,
    });
    if (!isJointRoom)
      return res.status(HttpStatus.NOT_FOUND).json({
        success: false,
        message: 'Not Join this room',
      });

    const { type } = isRoom;

    let data;

    if (type === Type.chaoTicLetter) {
      data = { ...data, word: await this.wordService.getChaoticWord() };
    }

    if (type === Type.truthyAndFalsyWord) {
      data = { ...data, word: await this.wordService.getTrueAndFalseWord() };

      // number of word is 2
      const randomOneWord =
        data.word.falsyWord[RandomInt(0, data.word.falsyWord.length)];
      let truthyAndFalsyWord =
        Math.random() * 10 > 5
          ? [data.word.truthyWord, randomOneWord]
          : [randomOneWord, data.word.truthyWord];

      data.word = { ...data.word, truthyAndFalsyWord };
      delete data.word.falsyWord;
    }

    await this.checkService.createCheckDetail({
      roomId,
      checkKey: data.word.truthyWord,
    });

    delete data.word.truthyWord;

    return res.status(HttpStatus.OK).json({
      success: true,
      message: `We have a word`,
      data,
    });
  }
}
