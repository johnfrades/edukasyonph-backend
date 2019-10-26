import * as mongoose from 'mongoose';
import {GradesSchema, IGradesSchema} from "./grades";

export const dbCollection = {
    grades: mongoose.model<IGradesSchema>('Grade', GradesSchema),
};
