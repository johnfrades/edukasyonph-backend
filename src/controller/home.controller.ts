import {Request, Response} from 'express';
import {HomeRepository} from "../repository/home.repository";

export class HomeController {
    private homeRepo = new HomeRepository();

    public enterGradesByText = async (req: Request, res: Response) => {
        try {
            const {text} = req.body;
            await this.homeRepo.saveQuarterAndGrades(text);
            res.status(200).end();
        } catch (err) {
            console.error(`[HomeController.enterGradesByText]: ${err.name} : ${err.message}`);
            res.status(400).json(err.message);
        }
    }

    public enterGradesByFile = async (req: Request, res: Response) => {
        try {
            const gradesTxt = req.files[0];
            const gradesString = (Buffer.from(gradesTxt.buffer)).toString();
            await this.homeRepo.saveQuarterAndGrades(gradesString);
            res.status(200).end();
        } catch (err) {
            console.error(`[HomeController.enterGradesByFile]: ${err.name} : ${err.message}`);
            res.status(400).json(err.message);
        }
    };

    public getGrades = async (req: Request, res: Response) => {
        try {
            const data = await this.homeRepo.getStudentsWithGradesGroupedByQuarter();
            res.status(200).json(data);
        } catch (err) {
            console.error(`[HomeController.getGrades]: ${err.name} : ${err.message}`);
            res.status(400).json('Error. Please try again.');
        }
    }

    public deleteQuarter = async (req: Request, res: Response) => {
        try {
            const {value} = req.params;
            console.log(value)
            await this.homeRepo.deleteQuarter(value);
            res.status(200).end();
        } catch (err) {
            console.error(`[HomeController.getGrades]: ${err.name} : ${err.message}`);
            res.status(400).json('Error. Please try again.');
        }
    }
}
