import mongoose, {Schema} from "mongoose";

const appointmentSchema = new Schema({
    doctorId: {
        type: String, 
        required: true 
    },
    userId: {
        type: String,
        required: true 
    },
    slotDate: {
        type: String,
        required: true
    },
    slotTime: {
        type: String,
        required: true
    },
    doctorData: { 
        type: Object,
        required: true
    },
    userData: { 
        type: Object,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    cancelled: {
        type: Boolean,
        default: false
    },
    payment: {
        type: Boolean,
        default: false
    },
    isCompleted: {
        type: Boolean,
        default: false
    },
});

export const Appointment = mongoose.model('Appointment', appointmentSchema)
export default Appointment

