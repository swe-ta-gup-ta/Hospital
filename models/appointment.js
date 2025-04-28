import mongoose, {Schema} from "mongoose";

const appointmentSchema = new Schema({
    doctor_id: {
        type: Schema.Types.ObjectId, 
        ref: 'Doctor', 
        required: true 
    },
    user_id: {
        type: Schema.Types.ObjectId, 
        ref: 'User', 
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