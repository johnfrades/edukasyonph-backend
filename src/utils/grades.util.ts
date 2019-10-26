import {isNaN} from 'lodash';

export class GradesUtil {

    static scoreAverageByArr(scoresArr: number[]) {
        return scoresArr.reduce((acc, cur, idx) => {
            acc += cur;

            if (idx === scoresArr.length - 1) {
                acc = acc / scoresArr.length;
            }
            return acc;
        }, 0)
    }

    static quarterIsValid(quarterText: string) {
        return quarterText.startsWith('Quarter');
    }

    static roundToTenth(value) {
        const multiplier = Math.pow(10, 1);
        return Math.round(value * multiplier) / multiplier;
    }

    static getFinalGrade(testScoreAvg: number, homeworkScoreAvg: number) {
        const testFinal = testScoreAvg * 0.6;
        const homeworkFinal = homeworkScoreAvg * 0.4;
        return this.roundToTenth(testFinal + homeworkFinal);
    }

    static segregateScoresArr(filteredValues: string[]) {
        return filteredValues.reduce((acc, cur) => {
            const grade = Number(cur);
            if (isNaN(grade)) {
                acc.currentType = cur;
                return acc;
            }

            acc[acc.currentType].push(grade);
            return acc;
        }, {
            T: [],
            H: [],
            currentType: ''
        });
    }

}
