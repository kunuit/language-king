import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CheckService } from './check.service';
import { CheckDto } from './dto/check.dto';

@Controller('check')
@UseGuards(AuthGuard('jwt'))
export class CheckController {
  constructor(private checkService: CheckService) {}

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
        data: { isCorrect: false },
      });
    }

    return res.status(HttpStatus.OK).json({
      success: true,
      message: 'You right',
      data: { isCorrect: true },
    });
  }
}
