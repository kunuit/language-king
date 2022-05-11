import { Controller, Inject, UseGuards, forwardRef, Post, UsePipes, ValidationPipe, Req, Res, Body, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CheckService } from 'src/check/check.service';
import { RoomService } from 'src/room/room.service';
import { SetUpPositionParams } from './type/shooting-coordinates.inteface';
import { User } from 'src/user/schema/user.schema';
import { SocketCooGateway } from './shooting-coordinates.gateway';

@Controller('shooting-coordinates')
@UseGuards(AuthGuard('jwt'))
export class ShootingCoordinatesController {
    constructor(
        @Inject(forwardRef(() => RoomService))
        private roomService: RoomService,
        @Inject(forwardRef(() => CheckService))
        private checkService: CheckService,
        private socketCooGateway: SocketCooGateway
    ) { }
    // private a: SocketCooGateway

    @Post('/')
    @UsePipes(ValidationPipe)
    async setUpPosition(@Req() req, @Res() res, @Body() setUpPositionParams: SetUpPositionParams) {
        const { positions, roomId, roomKey } = setUpPositionParams;
        const { _id } = req.user

        console.log('positions, roomId, _id', positions, roomId, _id)

        const getKeyExits = await this.checkService
            .findOne({ roomId }, {}, { sort: { updatedAt: -1 } })

        if (!getKeyExits) {
            await this.checkService.createCheckDetail({
                roomId,
                checkPosition: { [`${_id}`]: positions }
            })
        }
        if (!!getKeyExits) {
            let positionTmp = { ...getKeyExits.checkPosition, [`${_id}`]: positions }
            getKeyExits.checkPosition = positionTmp;
            await getKeyExits.save()
        }

        this.socketCooGateway.handlePlayerHadPositions(roomKey, { userId: _id })

        return res.status(HttpStatus.OK).json({
            success: true,
            message: 'We have a new room',
            data: { room: getKeyExits }
        });
    }
}
