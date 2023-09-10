import {i10n} from "./i10n";
import {moment} from "obsidian";

export function renderError(error: string, el: HTMLElement) {
    let container = el.createEl('table', {cls: "voca-error"});

    container.createEl('div', {cls: 'voca-error_header', text: i10n.parseError[moment.locale()]});

    container.createEl('div', {cls: 'voca-error_text', text: error});
}
