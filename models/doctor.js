import mongoose, {Schema} from "mongoose";

const doctorSchema = new mongoose.Schema({  
    name: { 
        type: String, 
        required: true 
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    contactInfo: { 
        type: String, 
        required: true 
    },
    about: { 
        type: String, 
        required: true 
    },
    available: { 
        type: Boolean, 
        default: true
    },
    speciality: {
        type: String,
        required: true
    },
    degree: {
        type: String,
        required: true
    },
    experience: {
        type: String,
        required: true  
    },
    fees: { 
        type: Number, 
        required: true 
    },
    password: {
        type: String,
        required: true
    },
    address: { 
        type: String, 
        required: true 
    },
    image: { 
        type: String, 
        required: true 
    },
});

export const Doctor = mongoose.model('Doctor', doctorSchema)
export default Doctor