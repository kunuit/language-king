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
import { CreateRoomDto } from './dto/room.dto';
import { RoomService } from './room.service';
import { UserService } from 'src/user/user.service';

@Controller('room')
@UseGuards(AuthGuard('jwt'))
export class RoomController {
  constructor(
    private roomService: RoomService,
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
  ) {}

  @Post('/')
  @UsePipes(ValidationPipe)
  async createRoom(
    @Res() res,
    @Req() req,
    @Body() createRoomDto: CreateRoomDto,
  ) {
    try {
      const {
        name,
        timeline,
        type,
        memQu,
        numberOfQuestion,
        level,
      } = createRoomDto;
      const { _id } = req.user;

      const isMana = await this.userService.isMana(_id);

      if (!isMana)
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: 'You are run out of mana',
        });

      const newRoom = await this.roomService.createRoom({
        name,
        timeline,
        ownRoom: _id,
        type,
        memQu,
        numberOfQuestion,
        level,
      });

      await Promise.all([
        this.roomService.joinRoom({
          roomId: newRoom._id,
          userId: _id,
        }),
        this.userService.updateManaGoldPoint(_id, {
          mana: -1,
        }),
      ]);

      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'We have a new room',
        data: { room: newRoom },
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error,
      });
    }
  }

  @Get('/join/:roomKey')
  @UsePipes(ValidationPipe)
  async joinRoom(@Res() res, @Req() req, @Param() param) {
    try {
      const { roomKey } = param;
      const { _id } = req.user;

      const isHasRoom = await this.roomService.findOne({ roomKey });
      // check this room key is not exits
      if (!isHasRoom) {
        return res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          message: `${roomKey} room key is not exits`,
        });
      }

      const isJoin = await this.roomService.findOneRD({
        roomId: isHasRoom._id,
        userId: _id,
      });

      // check have joint yet
      if (isJoin) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: `You had join ${isHasRoom.name} room`,
        });
      }

      await Promise.all([
        this.roomService.joinRoom({
          roomId: isHasRoom._id,
          userId: _id,
        }),
        this.userService.updateManaGoldPoint(_id, {
          mana: -1,
        }),
      ]);

      return res.status(HttpStatus.OK).json({
        success: true,
        message: `You joint ${isHasRoom.name} room`,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error,
      });
    }
  }
}
