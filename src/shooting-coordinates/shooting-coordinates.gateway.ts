import { CACHE_MANAGER, forwardRef, Inject, Injectable } from '@nestjs/common';
import {
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsResponse,
} from '@nestjs/websockets';
import { Cache } from 'cache-manager';

import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Server } from 'socket.io';
import { RoomService } from 'src/room/room.service';
import { StatusWaiting } from 'src/room/type/room.interface';
import { UserService } from 'src/user/user.service';

@Injectable()
@WebSocketGateway(80, {
    cors: {
        origin: '*',
    },
    namespace: 'shooting_coordinates'
})
export class SocketCooGateway {
    private namespace = "shooting_coordinates"
    constructor(
        // private namespace = "shooting_coordinates",
        @Inject(forwardRef(() => RoomService))
        private roomService: RoomService
        // private userService: UserService,
    ) { }

    @WebSocketServer()
    server: Server;

    @SubscribeMessage('joinRoom')
    async joinRoom(@MessageBody() data: any): Promise<Observable<WsResponse<number>>> {
        console.log('data', data)

        const { roomKey, userInfo } = data


        console.log(`${roomKey}`)

        this.server.socketsJoin(`${roomKey}`)

        if (!userInfo) return;

        console.log(`${roomKey}`)

        let dataRoomCached: any = await this.roomService.getCacheRoom?.(`${this.namespace}_${roomKey}`)
        dataRoomCached = { ...(dataRoomCached || {}), [`${userInfo?._id}`]: userInfo }

        await this.roomService.setCacheRoom(`${this.namespace}_${roomKey}`, dataRoomCached)

        this.server.in(`${roomKey}`).emit("newPlayer", { userInfo })
        return
    }

    @SubscribeMessage('playerReady')
    async playerReady(@MessageBody() data: any): Promise<Observable<WsResponse<number>>> {
        console.log('data, playerReady', data)
        const { roomKey, userInfoId, date } = data

        let dataRoomCached: any = await this.roomService.getCacheRoom?.(`${this.namespace}_${roomKey}`)
        console.log('dataRoomCached before', dataRoomCached)
        dataRoomCached[`${userInfoId}`].status = 1;
        console.log('dataRoomCached after', dataRoomCached)

        const isAllPlayerReady: Boolean = Object.values(dataRoomCached || {}).reduce((count: number, cur: any) => {
            if (count === 2) return 2;
            if (cur?.status === StatusWaiting.ready) return count + 1;
            return count
        }, 0) >= 2

        this.server.in(`${roomKey}`).emit("playerIsReady", dataRoomCached[`${userInfoId}`])

        // if (isAllPlayerReady) {
        //     this.server.in(`${roomKey}`).emit("allPlayerIsReady")
        // } else {
        // }

        await this.roomService.setCacheRoom(`${this.namespace}_${roomKey}`, dataRoomCached)

        console.log(`${roomKey}`)
        return
    }

    async handlePlayerHadPositions(roomKey: String, data: any): Promise<Observable<WsResponse<number>>> {
        console.log('eventName, data', data)
        const { userId } = data;
        let dataRoomCached: any = await this.roomService.getCacheRoom?.(`${this.namespace}_${roomKey}`)
        console.log('dataRoomCached before', dataRoomCached)
        dataRoomCached[`${userId}`].status = 2;
        console.log('dataRoomCached after', dataRoomCached)
        await this.roomService.setCacheRoom(`${this.namespace}_${roomKey}`, dataRoomCached)
        this.server.in(`${roomKey}`).emit("playerHadPositions", dataRoomCached[`${userId}`])

        if (Object.values(dataRoomCached || {})?.every((e: any) => e.status === 2)) {
            this.server.in(`${roomKey}`).emit("orderPlayer", { order: Object?.keys(dataRoomCached || {}) })
        }
        return
    }

    async handlePlayerCheckPosition(roomKey: String, data: any): Promise<Observable<WsResponse<number>>> {
        console.log('data, roomKey', data, roomKey)

        const { userId, enemyId, position, orderPlaying } = data

        this.server.in(`${roomKey}`).emit("playerCheckPosition", { userId, enemyId, position, orderPlaying: orderPlaying === 0 ? 1 : 0 })
        return
    }
}