import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { RandomInt } from 'common/utils/math';
import { DictionaryService } from '../dictionary/dictionary.service';

@Injectable()
export class WordService {
  constructor(
    @Inject(forwardRef(() => DictionaryService))
    private readonly dictionaryService: DictionaryService,
  ) {}

  getChaoticWord() {
    const wordTmp = this.dictionaryService.randomWordInList({ number: 2 });
    console.log(wordTmp);
    let textObject = { ...wordTmp?.trim()?.toLowerCase().replace(/ /gi, '') };

    let keyText = Object.keys(textObject);

    const data = Object.keys(textObject).map((obj, res) => {
      const tmpKey = RandomInt(0, keyText.length);
      const tmp = textObject[`${keyText[tmpKey]}`];
      keyText = keyText.filter((e) => e != keyText[tmpKey]);
      return tmp;
    });

    return {
      chaoticWord: data.join('/'),
      truthyWord: wordTmp?.trim()?.toLowerCase(),
    };
  }

  async getTrueAndFalseWord() {
    const wordTmp = this.dictionaryService.randomWordInList({ number: 2 });
    const trueWordArray = wordTmp?.trim()?.toLowerCase().split(' ');

    let falsyWordTotal = [];

    const GeneralArray = [
      ['ẽ', 'ẻ'],
      ['ễ', 'ể'],
      ['ũ', 'ủ'],
      ['ỗ', 'ổ'],
      ['õ', 'ỏ'],
      ['ỡ', 'ở'],
      ['ậ', 'ặ'],
      ['gi', 'd'],
    ].reduce((pre, item) => {
      let checkGeneralTmp = this.checkGeneralCase(trueWordArray, item);
      if (checkGeneralTmp.length > 0) return [...pre, ...checkGeneralTmp];
      return pre;
    }, []);

    const FirstSlotArray = [
      ['l', 'n'],
      ['x', 's'],
      ['d', 'r'],
    ].reduce((pre, item) => {
      let checkFirstTmp = this.checkFirstPos(trueWordArray, item);
      if (checkFirstTmp.length > 0) return [...pre, ...checkFirstTmp];
      return pre;
    }, []);

    const CheckGiRTmp = this.checkGiRFirstPos(trueWordArray);
    const CheckChTrTmp = this.checkTrChFirstPos(trueWordArray);

    const LastSlotArray = [
      ['n', 'ng'],
      ['t', 'c'],
    ].reduce((pre, item) => {
      let checkLastTmp = this.checkLastPos(trueWordArray, item);
      if (checkLastTmp.length > 0) return [...pre, ...checkLastTmp];
      return pre;
    }, []);
    if (CheckGiRTmp.length > 0) {
      falsyWordTotal = [...falsyWordTotal, ...CheckGiRTmp];
    }
    if (CheckChTrTmp.length > 0) {
      falsyWordTotal = [...falsyWordTotal, ...CheckChTrTmp];
    }
    if (GeneralArray.length > 0) {
      falsyWordTotal = [...falsyWordTotal, ...GeneralArray];
    }
    if (FirstSlotArray.length > 0) {
      falsyWordTotal = [...falsyWordTotal, ...FirstSlotArray];
    }
    if (LastSlotArray.length > 0) {
      falsyWordTotal = [...falsyWordTotal, ...LastSlotArray];
    }

    if (falsyWordTotal.length === 0) {
      return this.getTrueAndFalseWord();
    } else {
      return {
        truthyWord: wordTmp?.trim()?.toLowerCase(),
        falsyWord: falsyWordTotal.map((word) => word.join(' ')),
      };
    }
  }

  checkFirstPos(array: string[], twoWordCheck: string[]) {
    let result = [];

    if (
      (array[0][0].includes('n') && ['g', 'h'].includes(array[0][1])) ||
      (array[1][0].includes('n') && ['g', 'h'].includes(array[1][1]))
    )
      return [];

    if (array[0][0].toLowerCase() === twoWordCheck[0]) {
      result = [
        ...result,
        [array[0].replace(twoWordCheck[0], twoWordCheck[1]), array[1]],
      ];
    }
    if (array[0][0].toLowerCase() === twoWordCheck[1]) {
      result = [
        ...result,
        [array[0].replace(twoWordCheck[1], twoWordCheck[0]), array[1]],
      ];
    }
    if (array[1][0].toLowerCase() === twoWordCheck[0]) {
      result = [
        ...result,
        [array[0], array[1].replace(twoWordCheck[0], twoWordCheck[1])],
      ];
    }
    if (array[1][0].toLowerCase() === twoWordCheck[1]) {
      result = [
        ...result,
        [array[0], array[1].replace(twoWordCheck[1], twoWordCheck[0])],
      ];
    }
    // return [] or falsy word
    return result;
  }

  checkTrChFirstPos(array: string[]) {
    let result = [];
    if (array[0][0].includes('t') && array[0][1].includes('r')) {
      result = [...result, [array[0].replace('tr', 'ch'), array[1]]];
    }
    if (array[0][0].includes('c') && array[0][1].includes('h')) {
      result = [...result, [array[0].replace('ch', 'tr'), array[1]]];
    }
    if (array[1][0].includes('t') && array[1][1].includes('r')) {
      result = [...result, [array[0], array[1].replace('tr', 'ch')]];
    }
    if (array[1][0].includes('c') && array[1][1].includes('h')) {
      result = [...result, [array[0], array[1].replace('ch', 'tr')]];
    }
    return result;
  }

  checkGiRFirstPos(array: string[]) {
    let result = [];
    if (array[0][0].includes('g') && array[0][1].includes('i')) {
      result = [...result, [array[0].replace('gi', 'r'), array[1]]];
    }
    if (array[0][0].includes('r')) {
      result = [...result, [array[0].replace('r', 'gi'), array[1]]];
    }
    if (array[1][0].includes('g') && array[1][1].includes('i')) {
      result = [...result, [array[0], array[1].replace('gi', 'r')]];
    }
    if (array[1][0].includes('r')) {
      result = [...result, [array[0], array[1].replace('r', 'gi')]];
    }
    return result;
  }

  checkGeneralCase(array: string[], twoWordCheck: string[]) {
    let result = [];
    if (array[0].includes(twoWordCheck[0])) {
      result = [
        ...result,
        [array[0].replace(twoWordCheck[0], twoWordCheck[1]), array[1]],
      ];
    }
    if (array[0].includes(twoWordCheck[1])) {
      result = [
        ...result,
        [array[0].replace(twoWordCheck[1], twoWordCheck[0]), array[1]],
      ];
    }
    if (array[1].includes(twoWordCheck[0])) {
      result = [
        ...result,
        [array[0], array[1].replace(twoWordCheck[0], twoWordCheck[1])],
      ];
    }
    if (array[1].includes(twoWordCheck[1])) {
      result = [
        ...result,
        [array[0], array[1].replace(twoWordCheck[1], twoWordCheck[0])],
      ];
    }
    return result;
  }

  checkLastPos(array: string[], towWordCheck: string[]) {
    let result = [];
    if (array[0][array[0].length - 1].includes(towWordCheck[0])) {
      result = [
        ...result,
        [
          this.replaceOneLetterAtPos(
            array[0],
            towWordCheck[1],
            array[0].length - 1,
          ),
          array[1],
        ],
      ];
    }
    if (array[0][array[0].length - 1].includes(towWordCheck[1])) {
      result = [
        ...result,
        [
          this.replaceOneLetterAtPos(
            array[0],
            towWordCheck[0],
            array[0].length - 1,
          ),
          array[1],
        ],
      ];
    }
    if (array[1][array[1].length - 1].includes(towWordCheck[0])) {
      result = [
        ...result,
        [
          array[0],
          this.replaceOneLetterAtPos(
            array[1],
            towWordCheck[1],
            array[1].length - 1,
          ),
        ],
      ];
    }
    if (array[1][array[1].length - 1].includes(towWordCheck[1])) {
      result = [
        ...result,
        [
          array[0],
          this.replaceOneLetterAtPos(
            array[1],
            towWordCheck[0],
            array[1].length - 1,
          ),
        ],
      ];
    }
    return result;
  }

  replaceOneLetterAtPos(word: any, letter: string, pos: number) {
    const textObject = { ...word };
    textObject[pos] = letter;
    return Object.values(textObject).join('');
  }
}
