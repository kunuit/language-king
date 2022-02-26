import {
  Body,
  Controller,
  forwardRef,
  Get,
  HttpStatus,
  Inject,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from 'src/user/user.service';
import { GetGiftLuckyLaKiButtonDto } from './dto/gift.dto';
import { EarnMoreService } from './earn-more.service';

@Controller('earn-more')
export class EarnMoreController {
  constructor(
    private earnMoreService: EarnMoreService,
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('/gift-lucky-laki-button')
  @UsePipes(ValidationPipe)
  async returnGiftLuckyLaKiButton(
    @Req() req,
    @Res() res,
    @Body() getGiftLuckyLaKiButtonDto: GetGiftLuckyLaKiButtonDto,
  ) {
    const { _id } = req.user;
    const { percentLucky } = getGiftLuckyLaKiButtonDto;

    const manaGift = this.earnMoreService.getLuckyManaGift(percentLucky);

    const user = await this.userService.findOne({ _id });

    if (!!user) {
      user.mana = user.mana + manaGift;
    }

    await user.save();

    return res.status(HttpStatus.OK).json({
      success: true,
      message: `Congratulation`,
      data: {
        manaGift,
      },
    });
  }
}
