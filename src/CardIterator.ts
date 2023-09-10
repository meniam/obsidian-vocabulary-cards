import {Card} from "./Card";
import {CardList} from "./CardList";

export class CardsIterator {
    wordsArr: Card[];
    nextIndex: number;

    next: () => { value: Card, done: boolean };

    constructor(words: CardList) {
        this.wordsArr = words.words;
        this.nextIndex = 0;
        this.next = () => {
            if (this.nextIndex >= this.wordsArr.length)
                return {value: new Card('', '', ''), done: true};
            return {value: this.wordsArr[this.nextIndex++], done: false};
        }
    }
}
