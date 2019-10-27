import {min, orderBy, isEmpty} from 'lodash';
import {IGradesSchema} from "../models/grades";
import {dbCollection} from "../models";
import {GradesUtil} from "../utils/grades.util";

export class HomeRepository {

    public async saveQuarterAndGrades(value: string) {
        if (!value) {
            throw Error('No value inputted. Please input a value!');
        }

        const [quarter, ...studentGrades] = value.split('\n');

        if (isEmpty(studentGrades)) {
            throw Error('No students found! Please input the student names and their respective grades.');
        }

        // Process saving quarter and student grades
        if (!GradesUtil.quarterIsValid(quarter)) {
            throw Error('Quarter text is not valid, Please follow this format: "Quarter 1, 2019"');
        }

        // Process student grades
        const studentsWithAverageGrades = this.getStudentAverageGrades(studentGrades.filter(Boolean), quarter);
        const saveToDbPromises = studentsWithAverageGrades.map(data => {
            return dbCollection.grades.findOneAndUpdate({
                student: data.student,
                quarter: data.quarter
            }, data, {upsert: true});
        });
        await Promise.all(saveToDbPromises);
    }

    private getStudentAverageGrades(studentGrades: string[], quarter: string) {
        const studentNameMatch = /[a-zA-Z]+\s+[a-zA-Z]+/g;
        const studentGradesAvg = studentGrades.reduce((acc, cur) => {
            const splitValue = cur.split(' ').filter(Boolean);
            const student = cur.match(studentNameMatch)[0];
            const filteredValues = splitValue.filter(value => {
                const arrName = student.split(' ');
                const foundName = arrName.find(name => value === name);
                return !foundName;
            });

            const scores = GradesUtil.segregateScoresArr(filteredValues);
            const homeworkScoresArr = scores.H;
            const testScoresArr = scores.T;

            // Get the test and homework scores
            const lowestHomeworkScore = min(scores.H);

            if (lowestHomeworkScore <= 68) {
                const lowScoreIdx = homeworkScoresArr.findIndex(score => score === lowestHomeworkScore);
                homeworkScoresArr.splice(lowScoreIdx, 1);
            }

            const testScoresAverage = GradesUtil.roundToTenth(GradesUtil.scoreAverageByArr(testScoresArr));
            const homeworkScoresAverage = GradesUtil.roundToTenth(GradesUtil.scoreAverageByArr(homeworkScoresArr));
            const finalGrade = GradesUtil.getFinalGrade(testScoresAverage, homeworkScoresAverage);
            const dataToReturn: Partial<IGradesSchema> = {
                student,
                finalGrade,
                quarter
            };
            acc.push(dataToReturn);
            return acc;
        }, []);
        return orderBy(studentGradesAvg, ['student'], ['asc']);
    }

    public getStudentsWithGradesGroupedByQuarter() {
        return dbCollection.grades.aggregate([
            {
                $group: {
                    _id: '$quarter',
                    studentsWithGrades: {
                        '$push': {
                            student: '$student',
                            grade: '$finalGrade'
                        }
                    }
                }
            }
        ]);
    }

    public deleteQuarter(quarter: string) {
        return dbCollection.grades.deleteMany({quarter});
    }
}
