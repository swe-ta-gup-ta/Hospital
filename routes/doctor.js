import express from 'express'

import { 
    appointmentComplete, 
    cancelAppointment, 
    doctorAppointments, 
    doctorDashboard, 
    doctorList, 
    doctorProfile, 
    loginDoctor, 
    updateProfile 
} from '../controllers/doctor.js'

import authDoctor from '../middlewares/authDoctor.js'

const doctorRouter  = express.Router()

doctorRouter.get('/list', doctorList)
doctorRouter.post('/login', loginDoctor)
doctorRouter.get('/appointments', authDoctor, doctorAppointments)
doctorRouter.post('/complete-appointment', authDoctor, appointmentComplete)
doctorRouter.post('/cancel-appointment', authDoctor, cancelAppointment)
doctorRouter.get('/dashboard', authDoctor, doctorDashboard)
doctorRouter.get('/profile', authDoctor, doctorProfile)
doctorRouter.get('/update-profile', authDoctor, updateProfile)

export default doctorRouter