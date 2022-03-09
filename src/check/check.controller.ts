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
import { UserService } from 'src/user/user.service';
import { CheckService } from './check.service';
import { CheckDto } from './dto/check.dto';

@Controller('check')
@UseGuards(AuthGuard('jwt'))
export class CheckController {
  constructor(
    private checkService: CheckService,
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
  ) {}

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
}
