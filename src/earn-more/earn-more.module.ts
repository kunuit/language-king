import { forwardRef, Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';

import { EarnMoreService } from './earn-more.service';
import { EarnMoreController } from './earn-more.controller';

@Module({
  imports: [forwardRef(() => UserModule)],
  providers: [EarnMoreService],
  controllers: [EarnMoreController],
})
export class EarnMoreModule {}
