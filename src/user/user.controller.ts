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
import { RegisterDto } from './dto/register.dto';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private configServer: ConfigService,
  ) {}

  @Post('/register')
  @UsePipes(ValidationPipe)
  async register(@Res() res, @Body() registerDto: RegisterDto) {
    const [isUser, isEmail, isPhone] = await Promise.all([
      this.userService.doesTypeExists('username', registerDto.username),
      this.userService.doesTypeExists('email', registerDto.email),
      this.userService.doesTypeExists('phone', registerDto.phone),
    ]);

    if (isUser || isPhone || isEmail) {
      return res.status(HttpStatus.OK).json({
        success: false,
        message: `${isUser ? 'username,' : ''}${isPhone ? ' phone,' : ''}${
          isEmail ? ' email,' : ''
        } already exists`,
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
}
