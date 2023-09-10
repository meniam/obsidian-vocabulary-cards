import {Plugin} from "obsidian";
import {Card} from "./Card";
import {CardList} from "./CardList";

export class CardStat {
    plugin: Plugin;
    file: string;
    stat: any;

    getStat: (card: Card) => any
    rightAnswer: (card: Card) => void;
    wrongAnswer: (card: Card) => void;
    save: () => void;

    constructor(plugin: Plugin) {
        this.plugin = plugin;
        this.file = '.voca_stat.json';
        this.stat = {};

        plugin.app.vault.adapter.exists(this.file).then((exists) => {
            if (!exists) {
                return;
            }
            plugin.app.vault.adapter.read(this.file).then((cont) => {
                let stat;
                try {
                    stat = JSON.parse(cont)
                } catch (e) {
                    stat = {}
                }

                this.stat = stat;
            });
        });

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
            this.save();
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
            this.save();
        }

        this.save = () => {
            if (!plugin.app.vault.adapter.exists(this.file)) {
                plugin.app.vault.create(this.file, '{}').then();
            }

            try {
                plugin.app.vault.adapter.write(this.file, JSON.stringify(this.stat)).then();
            } catch (e) {
                console.log(e);
            }
        }
    }
}
