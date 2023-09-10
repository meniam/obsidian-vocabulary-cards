export class Card {
    derivative: string;
    transcription: string;
    explanation: string;

    blurred: string;

    rightCount: number = 0;
    wrongCount: number = 0;

    setRight: (cnt: number) => void;
    setWrong: (cnt: number) => void;

    constructor(derivative: string, transcription: string, explanation: string) {
        this.blurred = 'blurred';
        this.derivative = derivative;
        this.transcription = transcription;
        this.explanation = explanation;

        this.setRight = (cnt: number) => {
            this.rightCount = cnt;
        }

        this.setWrong = (cnt: number) => {
            this.wrongCount = cnt;
        }
    }
}
