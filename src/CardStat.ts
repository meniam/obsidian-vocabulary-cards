import {Plugin} from "obsidian";
import {Card} from "./Card";

export class CardStat {
    plugin: Plugin;
    file: string;
    stat: any;

    getStat: (card: Card) => any
    rightAnswer: (card: Card) => void;
    wrongAnswer: (card: Card) => void;
    loadStat: () => void;
    saveStat: () => void;

    constructor(plugin: Plugin) {
        this.plugin = plugin;
        this.file = '.voca_stat.json';
        this.stat = {};

        this.loadStat = async () => {
            this.stat = Object.assign({}, await plugin.loadData());
        }

        this.loadStat();

        this.saveStat = async () => {
            await plugin.saveData(this.stat);
        }

        this.getStat = (card: Card): any => {
            if (this.stat[card.derivative] === undefined) {
                return [0, 0]
            } else {
                return [this.stat[card.derivative].r, this.stat[card.derivative].w];
            }
        }

        this.rightAnswer = (card: Card) => {
            if (this.stat[card.derivative] === undefined) {
                this.stat[card.derivative] = {
                    r: 1,
                    w: 0
                }
            } else {
                this.stat[card.derivative].r++;
            }
            card.setWrong(this.stat[card.derivative].r);
            this.saveStat();
        }

        this.wrongAnswer = (card: Card) => {
            if (this.stat[card.derivative] === undefined) {
                this.stat[card.derivative] = {
                    r: 0,
                    w: 1
                }
            } else {
                this.stat[card.derivative].w++;
            }

            card.setWrong(this.stat[card.derivative].w);
            this.saveStat();
        }
    }
}
