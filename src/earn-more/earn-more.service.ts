import { Injectable, Logger } from '@nestjs/common';
import { RandomInt } from 'common/utils/math';

@Injectable()
export class EarnMoreService {
  private logger = new Logger('EarnMoreService');
  constructor() {}

  getLuckyManaGift(percentLucky: Number): Number {
    let mana = 0;
    const isGift = Math.random() * 100 <= percentLucky;

    if (!!isGift) {
      mana = RandomInt(1, 4);
    }
    return mana;
  }
}
