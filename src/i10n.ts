interface i10n {
    [key: string]: string
}

export const i10n: { iKnow: i10n, repeat: i10n, total: i10n, parseError: i10n} = {
    iKnow: {
        "en": "I know",
        "ru": "Знаю",
        "es": "Yo sé"
    },
    repeat: {
        "en": "Repeat",
        "ru": "Повторить",
        "es": "Repetir"
    },
    total: {
        "en": "Total cards",
        "ru": "Всего карточек",
        "es": "Total de tarjetas"
    },
    parseError: {
        "en": "Parse error",
        "ru": "Ошибка обработки",
        "es": "Parse error"
    }

}

