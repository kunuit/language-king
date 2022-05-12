import {
  Body,
  Controller,
  forwardRef,
  HttpStatus,
  Inject,
  Post,
  Req,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DictionaryService } from 'src/dictionary/dictionary.service';
import { SocketCooGateway } from 'src/shooting-coordinates/shooting-coordinates.gateway';
import { UserService } from 'src/user/user.service';
import { WordService } from 'src/word/word.service';
import { CheckService } from './check.service';
import { CheckDto, CheckShootingCoo } from './dto/check.dto';

@Controller('check')
@UseGuards(AuthGuard('jwt'))
export class CheckController {
  constructor(
    private checkService: CheckService,
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
    @Inject(forwardRef(() => DictionaryService))
    private dictionaryService: DictionaryService,
    @Inject(forwardRef(() => WordService))
    private wordService: WordService,
    @Inject(forwardRef(() => SocketCooGateway))
    private socketCooGateway: SocketCooGateway
  ) { }

  @Post('/')
  @UsePipes(ValidationPipe)
  async check(@Res() res, @Req() req, @Body() checkDto: CheckDto) {
    const { _id } = req.user;
    const { roomId, checkKey } = checkDto;

    const isCheckDetail = await this.checkService.findOne(
      { roomId },
      {},
      { sort: { updatedAt: -1 } },
    );

    if (checkKey.trim().toLowerCase() !== isCheckDetail.checkKey) {
      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'You wrong',
        data: { isCorrect: false, truthyWord: isCheckDetail.checkKey },
      });
    }

    await this.userService.updateManaGoldPoint(_id, { point: 1 });
    return res.status(HttpStatus.OK).json({
      success: true,
      message: 'You right',
      data: { isCorrect: true, truthyWord: isCheckDetail.checkKey },
    });
  }

  @Post('/splice-word')
  @UsePipes(ValidationPipe)
  async checkSpliceWord(@Res() res, @Req() req, @Body() checkDto: CheckDto) {
    const { _id } = req.user;
    const { roomId, checkKey } = checkDto;

    // TODO check 2 words
    let arrKeyNew = checkKey.trim().split(' ');
    if (arrKeyNew.length != 2)
      return res.status(HttpStatus.OK).json({
        success: true,
        resultCode: 320505,
        message: 'Must be 2 words',
        data: { isCorrect: false },
      });

    // TODO check key exists
    const checkKeyExists = await this.checkService.findOne({
      roomId,
      checkKey: checkKey.trim().toLowerCase(),
    });
    if (checkKeyExists)
      return res.status(HttpStatus.OK).json({
        success: true,
        resultCode: 320507,
        message: 'This word was exist',
        data: { isCorrect: false },
      });
    // TODO check end word - head word
    const getOldKey = await this.checkService
      .findOne({ roomId }, {}, { sort: { updatedAt: -1 } })

    let arrKeyOld = getOldKey.checkKey?.trim()?.split(' ');
    //? 'a b' must => 'b c'
    if (arrKeyOld[1] != arrKeyNew[0].toLowerCase())
      return res.status(HttpStatus.OK).json({
        success: true,
        resultCode: 320509,
        message: 'end old word different head new word',
        data: { isCorrect: false },
      });
    //? 'a b' => 'b a' is false
    if (
      arrKeyOld[1] == arrKeyNew[0].toLowerCase() &&
      arrKeyOld[0] == arrKeyNew[1].toLowerCase()
    )
      return res.status(HttpStatus.OK).json({
        success: true,
        resultCode: 320510,
        message: 'We do not play same that',
        data: { isCorrect: false },
      });
    // TODO check word is in vietnamese dictionary
    if (!this.dictionaryService.has(checkKey))
      return res.status(HttpStatus.OK).json({
        success: true,
        resultCode: 320511,
        message: 'The word is not mean',
        data: { isCorrect: false },
      });
    // TODO add new key
    const [addWord, updatedManaGoldPoint, getNextWord] = await Promise.all([
      this.checkService.createCheckDetail({
        roomId,
        checkKey: checkKey?.trim().toLowerCase(),
      }),
      this.userService.updateManaGoldPoint(_id, { point: 1 }),
      this.wordService.getNextSpliceWord({
        roomId,
        oldWord: checkKey?.trim().toLowerCase(),
      }),
    ]);

    if (!!getNextWord.isWin)
      return res.status(HttpStatus.OK).json({
        success: true,
        resultCode: 0,
        message: "You win",
        data: {
          isCorrect: true,
          isWin: true,
        }
      })

    if (addWord && !getNextWord.isWin) {
      await this.checkService.createCheckDetail({
        roomId,
        checkKey: getNextWord.nextWord?.trim().toLowerCase(),
      });
      return res.status(HttpStatus.OK).json({
        success: true,
        resultCode: 0,
        message: 'You right',
        data: { isCorrect: true, isWin: false, nextWord: getNextWord.nextWord },
      });
    }


  }

  @Post('/shooting-coordinates')
  @UsePipes(ValidationPipe)
  async checkShootingCoo(@Res() res, @Req() req, @Body() checkShootingCoo: CheckShootingCoo) {
    const { _id } = req.user
    const { enemyId, orderPlaying, position, roomId, roomKey } = checkShootingCoo

    const checkKeyExists = await this.checkService.findOne({
      roomId,
    });

    const { checkPosition } = checkKeyExists

    if (!checkPosition) {
      return res.status(HttpStatus.OK).json({
        success: true,
        resultCode: 4191139,
        message: 'Not find key to check',
        data: { isCorrect: false },
      });
    }

    if (!!checkPosition) {
      const enemyPositionArray = Object.keys(checkPosition[`${enemyId}`] || {})
      this.socketCooGateway.handlePlayerCheckPosition(roomKey, { enemyId, orderPlaying, position, userId: _id })
      if (enemyPositionArray?.includes(`${position}`)) {

        return res.status(HttpStatus.OK).json({
          success: true,
          resultCode: 0,
          message: 'Hit the target',
          data: checkPosition[`${enemyId}`]?.[`${position}`]
        })
      } else {
        return res.status(HttpStatus.OK).json({
          success: true,
          resultCode: 4191141,
          message: 'Miss the target'
        })
      }
    }

  }
}
