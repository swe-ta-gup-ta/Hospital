import mongoose, {Schema} from "mongoose";

const hospitalSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    ownership: {
        type: String,
        enum: ['government', 'private']
    },
    timing: {
        type: String,
        required: true
    },
})

export const Hospital = mongoose.model('Hospital', hospitalSchema)