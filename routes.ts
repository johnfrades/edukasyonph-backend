import * as multer from 'multer';
import * as express from 'express';
import {HomeController} from "./src/controller/home.controller";

export class Routes {

    private storage = multer.memoryStorage();
    private upload = multer({
        storage: this.storage,
        limits: {
            fileSize: 1024 * 1024 * 10,
            files: 1
        }
    });

    constructor(private router: express.Router) {
        this.homeRoute();
    }

    private homeRoute() {
        const homeController = new HomeController();
        this.router.get('/test', (req, res) => {
            res.json('Ok!')
        });
        this.router.get('/grades', homeController.getGrades)

        this.router.post('/submitByText', homeController.enterGradesByText);
        this.router.post('/submitByFile', this.upload.array('file', 1), homeController.enterGradesByFile);

        this.router.delete('/quarter/:value', homeController.deleteQuarter);
    }
}
