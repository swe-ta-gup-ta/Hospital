import mongoose, {Schema} from "mongoose";

const reportSchema = new Schema({
    appointment_id: { 
      type: Schema.Types.ObjectId, 
      ref: 'Appointment', 
      required: true 
    },
    report_result:{
      type: String
    },
    medicines: {
      type: [String]
    },
    report_date: {
      type: Date, 
      default: Date.now 
    },
    doctor_remarks: {
      type: String
    }
  });

export const Report = mongoose.model('report', reportSchema)