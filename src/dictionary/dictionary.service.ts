import { Injectable } from '@nestjs/common';
import path from 'path';
import fs from 'fs';

@Injectable()
export class DictionaryService {
  wordByUser: string[];
  words: string[];
  lower_words: string[];
  dictionaryMain: JSON;
  dictionaryByUser: JSON;
  definitions: Object;
  RandomIntDic: Function;
  RandomListDic: Function;
  filePath: any;
  filePathByUser: any;
  constructor() {
    this.filePath = path.resolve(__dirname, './data/Viet74K.txt');
    this.filePathByUser = path.resolve(__dirname, './data/VietByUser.txt');
    let data = fs.readFileSync(this.filePath, 'utf-8');
    let dataByUser = fs.readFileSync(this.filePathByUser, 'utf-8');
    this.wordByUser = dataByUser.split('\n');
    this.words = [...data.split('\n'), ...dataByUser.split('\n')];
    this.lower_words = [
      ...data.toLowerCase().split('\n'),
      ...dataByUser.toLowerCase().split('\n'),
    ];
    this.dictionaryMain = require('./data/dictionary.json');
    this.dictionaryByUser = require('./data/dictionaryByUser.json');
    this.definitions = { ...this.dictionaryMain, ...this.dictionaryByUser };
  }
  list(word) {
    return this.words.filter((e) => {
      let tmp = e.split(' ');
      if (tmp.length == 2 && tmp[0] == word) return tmp;
    });
  }
  async addWordToDictionary(word) {
    this.definitions = { ...this.definitions, ...word };
    this.dictionaryByUser = { ...this.dictionaryByUser, ...word };
    await fs.writeFileSync(
      path.resolve(__dirname, './data/dictionaryByUser.json'),
      JSON.stringify(this.dictionaryByUser),
    );
  }
  async addWordToTxt(word) {
    this.words = [...this.words, word];
    this.lower_words = [...this.lower_words, word];
    this.wordByUser = [...this.wordByUser, word];
    await fs.writeFileSync(
      path.resolve(__dirname, './data/VietByUser.txt'),
      this.wordByUser.join('\n'),
    );
  }
  randomWordInList({ number = 2 }) {
    this.RandomIntDic = function (min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
    };
    this.RandomListDic = function (list) {
      return list[this.RandomIntDic(250, list.length)];
    };
    let word = this.RandomListDic(this.words);
    let legWord = word.split(' ');
    if (legWord.length === number) return word;
    return this.randomWordInList({ number });
  }
  has(word) {
    if (!word) return false;
    const isHas = this.words.some(e => e?.trim() === word.toLowerCase());
    return isHas
  }
  lookup(word) {
    return this.definitions[word];
  }
}
