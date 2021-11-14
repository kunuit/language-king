import {
  Body,
  Controller,
  Get,
  HttpStatus,
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

@Controller('room')
@UseGuards(AuthGuard('jwt'))
export class RoomController {
  constructor(private roomService: RoomService) {}

  @Post('/')
  @UsePipes(ValidationPipe)
  async createRoom(
    @Res() res,
    @Req() req,
    @Body() createRoomDto: CreateRoomDto,
  ) {
    try {
      const { name, timeLine, type, memQu } = createRoomDto;
      const { _id } = req.user;

      const newRoom = await this.roomService.createRoom({
        name,
        timeLine,
        ownRoom: _id,
        type,
        memQu,
      });

      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'We have a new room',
        data: { room: newRoom },
      });
    } catch (error) {
      console.log(`error`, error);
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

      await this.roomService.joinRoom({
        roomId: isHasRoom._id,
        userId: _id,
      });

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
