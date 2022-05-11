import { Module, forwardRef } from '@nestjs/common';
import { CheckModule } from 'src/check/check.module';
import { RoomModule } from 'src/room/room.module';
import { ShootingCoordinatesController } from './shooting-coordinates.controller';
import { SocketCooGateway } from './shooting-coordinates.gateway';
import { ShootingCoordinatesService } from './shooting-coordinates.service';

@Module({
  imports: [forwardRef(() => RoomModule), forwardRef(() => CheckModule)],
  controllers: [ShootingCoordinatesController],
  providers: [ShootingCoordinatesService, SocketCooGateway],
  exports: [SocketCooGateway]
})
export class ShootingCoordinatesModule { }
