import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Request,
  Req,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { IsExistPhoneDto, RegisterDto } from './dto/register.dto';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private configServer: ConfigService,
  ) {}

  @Post('/register')
  @UsePipes(ValidationPipe)
  async register(@Res() res, @Body() registerDto: RegisterDto) {
    const isPhone = await this.userService.doesTypeExists(
      'phone',
      registerDto.phone,
    );

    if (isPhone) {
      return res.status(HttpStatus.OK).json({
        success: false,
        message: `${isPhone ? ' phone,' : ''} already exists`,
      });
    }

    const user = await this.userService.create(registerDto);
    return res.status(HttpStatus.OK).json({
      success: true,
      message: 'User has been created successfully',
      data: {
        user,
      },
    });
  }

  @Post('/isExistPhone')
  async isExistPhone(@Res() res, @Body() isExistPhoneDto: IsExistPhoneDto) {
    const user = await this.userService.doesTypeExists(
      'phone',
      isExistPhoneDto?.phone,
    );

    return res.status(HttpStatus.OK).json({
      success: true,
      message: 'Check exist done!',
      data: {
        isExist: !!user,
        username: user?.username,
      },
    });
  }

  @Post('/login')
  async login(
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto,
  ): Promise<any> {
    return await this.userService.login(authCredentialsDto);
  }

  @Get('logout')
  @UseGuards(AuthGuard('jwt'))
  async logout(@Req() req, @Res() res): Promise<any> {
    const isLogout = await this.userService.logout(req.user._id);

    if (isLogout) {
      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'User has been logout',
      });
    } else {
      return res.status(HttpStatus.OK).json({
        success: false,
        message: 'User can not logout',
      });
    }
  }

  @Get('getMe')
  @UseGuards(AuthGuard('jwt'))
  async getMe(@Req() req): Promise<any> {
    return await this.userService.getMe(req.user._id);
    // const meInfo =

    // if (meInfo) {
    //   return res.status(HttpStatus.OK).json({
    //     data: meInfo,
    //     success: true,
    //     message: 'User has been logout',
    //   });
    // } else {
    //   return res.status(HttpStatus.OK).json({
    //     success: false,
    //     message: 'User can not logout',
    //   });
    // }
  }
}
