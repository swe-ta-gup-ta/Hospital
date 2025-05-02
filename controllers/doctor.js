import Doctor from "../models/doctor.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import Appointment from "../models/appointment.js";


const changeAvailability = async (req, res) => {
    try {

        const {doctorId} = req.body

        const doctorData = await Doctor.findById(doctorId)
        await Doctor.findByIdAndUpdate(doctorId, {available: !available})
        res.json({success: true, message: "Availability changed"})


    } catch (error) {
        console.log(error);
        res.status(401).json({ success: false, message: error.message });
    }
}

const doctorList = async (req, res) => {
    try {
        
        const doctors = await Doctor.find({}).select(['-password', '-email'])
        res.json({success: true, doctors})

    } catch (error) {
        console.log(error);
        res.status(401).json({ success: false, message: error.message });
    }
}

//API for doctor login
const loginDoctor = async (req, res) => {
    try {
        

        const {email, password} = req.body
        const doctor = await Doctor.findOne({email})

        if(!doctor){
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, doctor.password)

        if(isMatch){
            const doctorToken = jwt.sign({id: doctor._id}, process.env.JWT_SECRET)

            res.json({success: true, doctorToken})
        } else {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

    } catch (error) {
        console.log(error);
        res.status(401).json({ success: false, message: error.message });
    }
}

// API to get doctor appointments for docor panel 
const doctorAppointments = async (req, res) => {
    try {
        
        const {doctorId} = req.body
        const appointments = await Appointment.find({doctorId})

        res.json({success: true, appointments})

    } catch (error) {
        console.log(error);
        res.status(401).json({ success: false, message: error.message });
    }
}

//API to mark appointments completed
const appointmentComplete = async (req, res) => {
    try {
        
        const {doctorId, appointmentId} = req.body
        const appointmentData = await Appointment.findById(appointmentId)
        
        if(appointmentData && appointmentData.doctorId === doctorId){
            await Appointment.findByIdAndUpdate(appointmentId, {isCompleted: true})
            return res.json({success: true, message: "Appointment completed"})
        }
        else{
            return res.json({success: true, message: "Mark failed"})
        }

    } catch (error) {
        console.log(error);
        res.status(401).json({ success: false, message: error.message });
    }
}

//API to mark appointments completed
const cancelAppointment = async (req, res) => {
    try {
        
        const {doctorId, appointmentId} = req.body
        const appointmentData = await Appointment.findById(appointmentId)
        
        if(appointmentData && appointmentData.doctorId === doctorId){
            await Appointment.findByIdAndUpdate(appointmentId, {cancelled: true})
            return res.json({success: true, message: "Appointment cancelled"})
        }
        else{
            return res.json({success: true, message: "Cancelllation failed"})
        }

    } catch (error) {
        console.log(error);
        res.status(401).json({ success: false, message: error.message });
    }
}

//API to get dashboard data for doctor panel
const doctorDashboard = async (req, res) => {
    try {
        const {doctorId} = req.body
        const appointments = Appointment.find({doctorId})

        let earnings = 0;

        appointments.map((item) => {
            if(item.isCompleted){
                earnings += item.amount
            }
        })

        let patients = []

        (await appointments).map(() => {
            if(!patients.includes(item.userId)){
                patients.push(item.userId)
            }
        })


        const dashData = {
            earnings,
            appointments: (await appointments).length,
            patients: patients.length,
            latestAppointments : appointments.reverse().slice(0, 5)
        }

        res.json({success: true, dashData})

    } catch (error) {
        console.log(error);
        res.status(401).json({ success: false, message: error.message });
    }
}

//API to get doctor profile data  
const doctorProfile = async (req, res) => {
    try {
        const doctorId = req.doctorId;

        const doctorData = await Doctor.findById(doctorId).select('-password');

        if (!doctorData) {
            return res.status(404).json({ success: false, message: 'Doctor not found' });
        }

        res.status(200).json({ success: true, doctorData });

    } catch (error) {
        console.log(error);
        res.status(401).json({ success: false, message: error.message });
    }
}

//API to update doctor profile fro doctor panel
const updateProfile = async (req, res) => {
    try {
        

        const {doctorId, fees, address, available} = req.body
        
        await Doctor.findByIdAndUpdate(doctorId, {fees, address, available})

        res.json({success: true, message: "Profile updated"})

    } catch (error) {
        console.log(error);
        res.status(401).json({ success: false, message: error.message });
    }
}

export { 
    changeAvailability, 
    doctorList , 
    loginDoctor, 
    doctorAppointments, 
    appointmentComplete, 
    cancelAppointment, 
    doctorDashboard, 
    doctorProfile, 
    updateProfile
}