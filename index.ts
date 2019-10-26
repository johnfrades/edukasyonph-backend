import * as express from 'express';
import * as bodyParser from "body-parser";
import {Routes} from "./routes";
import * as mongoose from "mongoose";
import {CONFIG} from "./config";
import * as cors from 'cors';


class App {
    public app: express.Application;

    constructor() {
        this.initialize();
    }

    private initialize() {
        this.app = express();
        this.configInit();
        this.routesInit();
        this.databaseInit();
    }

    private configInit() {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({extended: true}));
        this.app.use(cors({ credentials: true, origin: '*' }));
    }

    private routesInit() {
        const router = express.Router();
        new Routes(router);
        this.app.use('/api', router);
    }

    private async databaseInit() {
        (<any>mongoose).Promise = global.Promise;
        await mongoose.connect(CONFIG.database);
        console.log('Database connected!');
    }
}

export default new App();
