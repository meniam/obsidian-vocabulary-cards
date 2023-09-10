import {CardsIterator} from "./CardIterator";
import YAML from "yaml";
import {Card} from "./Card";

function shuffle(arr: number[]): any {
    for (let i = 0; i < arr.length; ++i) {
        const r = Math.floor(Math.random() * arr.length);
        let temp = arr[i];
        arr[i] = arr[r];
        arr[r] = temp;
    }
}

export class CardList {
    words: Card[] = [];
    length: number = 0;

    error: string = "";

    [index: number]: Card;

    getRandomCardList: () => CardList;
    fromArray: (arr: Card[]) => CardList;
    setStat: (stat: any) => void;
    push: (card: Card) => void;
    getRandomWord: () => Card;

    [Symbol.iterator] = () => {
        return new CardsIterator(this);
    }

    constructor(src: string) {
        const data: any = YAML.parse(src);

        for (let key in data) {
            // skip loop if the property is from prototype
            if (!data.hasOwnProperty(key)) continue;

            let obj = data[key];

            let card: Card;
            let derivative: string = '';
            let transcription: string = '';
            let explanation: string = '';

            if (typeof obj === 'object' && !Array.isArray(obj) && obj !== null) {
                for (let prop in obj) {
                    // skip loop if the property is from prototype
                    if (!obj.hasOwnProperty(prop)) continue;

                    if (['deriv', 'word', 'source', 'w', 'wd'].includes(prop)) {
                        derivative = (obj[prop] + '').toString().trim();
                    }

                    if (['transcript', 'ts', 'transcription'].includes(prop)) {
                        transcription = (obj[prop] + '').toString().trim();
                    }

                    if (['expl', 'explanation', 'translate', 'tr', 'transl', 'trans'].includes(prop)) {
                        explanation = (obj[prop] + '').toString().trim();
                    }
                }

                if (!derivative) {
                    derivative = key.trim();
                }


            } else { // Parse Single Line Form
                derivative = key.trim();

                let str: string = obj ? obj.trim() : '';
                const found = str.match(/^<([^>]+)>(.*)/);
                if (found && found?.length > 1) {
                    transcription = found[1].toString().trim();
                    explanation = found[2].toString().trim();
                } else {
                    explanation = str.trim();
                }
            }
            card = new Card(derivative, transcription, explanation);
            this.words.push(card);
            this.length = this.words.length;
        }

        // lines.forEach(value => {
        //     const separatorPos = value.indexOf(separator);
        //     if (separatorPos === -1 || value.length <= separatorPos + 1)
        //         return;
        //
        //     const word = value.slice(0, separatorPos).trim();
        //     const explanation = value.slice(separatorPos + 1).trim();
        //
        //     this.words.push(new Word(word, explanation));
        //     this.length = this.words.length;
        // });
        this.getRandomCardList = () => {
            let result = new CardList("");

            let indexArr: number[] = Array.from(Array(this.length).keys());
            shuffle(indexArr);
            return result;
        }

        this.fromArray = (arr: Card[]) => {
            let result = new CardList("");
            arr.forEach(value => {
                result.push(value)
            })

            return result;
        }

        this.push = (card: Card) => {
            this.words.push(card);
        }

        this.getRandomWord = () => {
            return this.words[Math.floor(Math.random() * this.length)];
        }

        this.setStat = (obj: any): void => {
            this.words.forEach(value => {
                if (obj[value.derivative] === undefined) {
                    value.setRight(0);
                    value.setWrong(0);
                } else {
                    value.setRight(obj[value.derivative].r);
                    value.setWrong(obj[value.derivative].w);
                }
            })
        }
    }
}
