import validator from 'validator'
import bcrypt from 'bcrypt'
import {v2 as cloudinary} from 'cloudinary'
import Doctor from "../models/doctor.js"
import Appointment from "../models/appointment.js"
import jwt from 'jsonwebtoken' 
import User from '../models/user.js'

//API for adding doctor
const addDoctor = async(req, res) => {
    try {
        const {name, email, contactInfo, speciality, degree, experience, password, about, fees, address} = req.body;
        const imageFile = req.file

        // checking for all data to add doctor
        if(!name || !email || ! contactInfo || !password  || !about  || !fees || !address || !degree || !experience || !speciality){
            return res.json({success: false, message: "Misssing Details"})
        }
        //validating emial format
        if(!validator.isEmail(email )){
            return res.json({success: false, message: "Enter a valid email"})
        }

        //validating strong passwd
        if(password.length < 8){
            return res.json({success: false, message: "Enter a strong password"})
        }

        //hashing doctor password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        //upload image to cloudinary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, {resource_type: "image"})
        const imageUrl = imageUpload.secure_url


        const doctorData  = {
            name,
            email,
            contactInfo,    
            image: imageUrl,
            password: hashedPassword,
            speciality,
            degree,
            experience,
            about,
            fees,
            address
        }

        // console.log(doctorData)

        const newDoctor = new Doctor(doctorData)
        await newDoctor.save()

        res.json({success: true, message: "Doctor added"})

    } catch (error) {
        console.log(error);
        res.status(401).json({ success: false, message: error.message });
    }
}

// api for the admin login
const loginAdmin = async(req, res) => {
    try {
        const {email, password} = req.body

        if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){

            const token = jwt.sign(email+password, process.env.JWT_SECRET)
            res.json({success: true, token})

        } else{
            res.json({success: false, message: "Invalid credentials"})
        }

    } catch (error) {
        console.log(error);
        res.status(401).json({ success: false, message: error.message });
    }
}

//API to get all doctors list for admin panel
const allDoctors = async(req, res) => {
    try {
        
        const doctors = await Doctor.find({}).select('-password')
        res.json({success: true, doctors})

    } catch (error) {
        console.log(error);
        res.status(401).json({ success: false, message: error.message });
    }
}

// API to get all appointments list
const appointmentsList = async (req, res) => {
    try {
        
        const appointments = await Appointment.find({})
        res.json({success: true, appointments})

    } catch (error) {
        console.log(error);
        res.status(401).json({ success: false, message: error.message });
    }
}

//API t cancel appointment
const cancelApppointment = async (req, res) => {
    try {

        const {appointmentId} = req.body

        const appointmentData = await Appointment.findById(appointmentId)


        await Appointment.findByIdAndUpdate(appointmentId, {cancelled: true})

        // removing doctor slots
        const {doctorId, slotDate, slotTime} = appointmentData

        const doctorData = await Doctor.findById(doctorId)

        let slotsBooked = doctorData.slotsBooked

        slotsBooked[slotDate] = slotsBooked[slotDate].filter(e => e !== slotTime)

        await Doctor.findByIdAndUpdate(doctorId, {slotsBooked})

        res.json({success: true, message: "Appointment cancelled"})

    } catch (error) {
        console.log(error);
        res.status(401).json({ success: false, message: error.message });
    }
}

//API t get dashboard data for admin panel
const adminDashboard = async (req, res) => {
    try {
        

        const doctors = await Doctor.find({})
        const users = User.find({})
        const appointments = await Appointment.find({})

        const dashData = {
            doctors: doctors.length,
            appointments: appointments.length,
            patients: users.length,
            latestAppointments: appointments.reverse().slice(0, 5)
        }

        res.json({success: true, dashData})


    } catch (error) {
        console.log(error);
        res.status(401).json({ success: false, message: error.message });
    }
}

export {addDoctor, 
    loginAdmin, 
    allDoctors, 
    appointmentsList, 
    cancelApppointment, 
    adminDashboard
}