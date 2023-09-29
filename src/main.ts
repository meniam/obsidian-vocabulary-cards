import {moment, Plugin} from 'obsidian';

import "./styles.scss";
import {CardStat} from "./CardStat";
import {i10n} from "./i10n";
import {CardList} from "./CardList";
import {Card} from "./Card";
import {renderError} from "./Renderer";


export default class VocabularyView extends Plugin {
    async onload()
    {
        const cs = new CardStat(this)

        this.registerMarkdownCodeBlockProcessor("voca-table", (source, el) => {
            console.log('register table');
            renderTable(source, el)
        });

        this.registerMarkdownCodeBlockProcessor("voca-card", (source, el) => {
            parseCardCodeBlock(cs, source, el)
        });
        console.log('end');

    }
}

function createEmpty(el: HTMLElement) {
    let cardEl = el.createEl('div', {cls: "voca-card"});
    cardEl.createEl('div', {cls: 'voca-card-empty', text: 'No cards found.'});
}

function renderSingleCard(card: Card, cardList: CardList, cardStat: CardStat, el: HTMLElement) {
    el.innerHTML = '';

    let cardEl = el.createEl('div', {cls: "voca-card"});

    if (!card) {
        createEmpty(el);
        return;
    }

    let statData: any = cardStat.getStat(card);

    const stat = cardEl.createEl('span', {cls: 'voca-card_stat'});

    const rightCount: number = parseInt(statData[0]);
    const wrongCount: number = parseInt(statData[1]);

    if (cardList.length) {
        cardEl.createEl('span', {cls: 'voca-card_stat-total', title: i10n.total[moment.locale()], text: cardList.length.toString()});
    }

    if (rightCount && wrongCount) {
        stat.createEl('span', {cls: 'voca-card_stat-wrong', text: wrongCount.toString()});
        stat.createEl('span', {cls: 'voca-card_stat-delimiter', text: '/'});
        stat.createEl('span', {cls: 'voca-card_stat-right', text: rightCount.toString()});
    } else if (rightCount) {
        stat.createEl('span', {cls: 'voca-card_stat-right', text: rightCount.toString()});
    } else if (wrongCount) {
        stat.createEl('span', {cls: 'voca-card_stat-wrong', text: wrongCount.toString()});
    }

    cardEl.createEl('span', {cls: 'voca-card-derivative', text: card.derivative});
    cardEl.createEl('span', {cls: 'voca-card-ts', text: card.transcription ? card.transcription : ' '});

    const maxMove =  card.explanation.length < 10 ? 8 : 16;
    let spacing = Math.floor(Math.random() * maxMove)
    if (Math.floor(Math.random() * 2) === 1) {
        spacing = -spacing;
    }

    const blurred = cardEl.createEl('span', {cls: 'voca-card-explanation-blurred', text: card.explanation, attr: {style: 'letter-spacing: '+spacing+'px;'} });
    cardEl.addEventListener("click", () => {
        blurred.classList.replace('voca-card-explanation-blurred', 'voca-card-explanation');
        blurred.style.letterSpacing = '0px';
    });

    //cardEl.createEl('span', {cls: 'voca-card-explanation', text: card.explanation});

    let btns = cardEl.createEl('div', {cls: 'voca-card_buttons'});

    let wrong = btns.createEl('button', {cls: 'voca-card_button-danger', text: i10n.repeat[moment.locale()]});
    wrong.addEventListener("click", () => {
        //cardStat.loadCardListStat(wordList);
        cardStat.wrongAnswer(card);
        renderNextCard(cardStat, cardList, el);
    });

    let success = btns.createEl('button', {cls: 'voca-card_button-success', text: i10n.iKnow[moment.locale()]});
    success.addEventListener("click", () => {
        cardStat.rightAnswer(card);
        renderNextCard(cardStat, cardList, el);
    });
}

function parseCardCodeBlock(cardStat: CardStat, source: string, el: HTMLElement) {
    el.innerHTML = '';
    const wordList = new CardList(source);
    if (wordList.length < 1) return;

    renderNextCard(cardStat, wordList, el);
}

function renderNextCard(cardStat: CardStat, cardList: CardList, el: HTMLElement) {
    let card = cardList.getRandomWord();
    renderSingleCard(card, cardList, cardStat, el);
}

function renderTable(source: string, el: HTMLElement) {
    try {
        const wordList = new CardList(source);
        if (wordList.length < 1) return;

        let tableEl = el.createEl('table', {cls: "voca-table"});

        let tableBody = tableEl.createEl('tbody');

        for (const word of wordList) {
            let trEl = tableBody.createEl('tr');
            let derivative = trEl.createEl('td', {cls: 'voca-table_derivative'});

            derivative.createEl('span', {cls: 'voca-table_derivative-text', text: word.derivative});
            if (word.transcription) {
                const transcription = derivative.createEl('span', {cls: 'voca-table_derivative-transcription'});
                transcription.createEl('span', {cls: 'voca-table_derivative-transcription-delimiter', text: '/'});
                transcription.createEl('span', {cls: 'voca-table_derivative-transcription-text', text: word.transcription});
                transcription.createEl('span', {cls: 'voca-table_derivative-transcription-delimiter', text: '/'});
            }

            let explanation = trEl.createEl('td', {cls: 'voca-table_explanation'});

            //expl.createEl('span', {cls: 'voca-table-ts', text: '[' + word.ts + ']'});
            explanation.createEl('span', {'text': word.explanation});

        }
    } catch (e: any) {
        renderError(e.message, el);
    }
}
