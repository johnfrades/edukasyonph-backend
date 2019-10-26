import * as mongoose from 'mongoose';

export const GradesSchema = new mongoose.Schema({
    createdAt: {
        type: Date,
        default: Date.now
    },
    student: {
        type: String,
        required: true
    },
    finalGrade: {
        type: Number,
        required: true
    },
    quarter: {
        type: String,
        required: true
    }
});

export interface IGradesSchema extends mongoose.Document {
    createdAt: string;
    student: string;
    finalGrade: number;
    quarter: string;
}

