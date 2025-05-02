import validator from 'validator'
import bcrypt from 'bcrypt'
import User from '../models/user.js'
import jwt from 'jsonwebtoken'
import {v2 as cloudinary} from 'cloudinary'
import Doctor from '../models/doctor.js'
import Appointment from '../models/appointment.js';

//API to  register user
const registerUser = async (req, res) => {
    try {

        const {name, email, password} = req.body
        if(!name || !email || !password){
            return res.json({success: false, message: "Missing details"})
        }

        //validating emial format
        if(!validator.isEmail(email )){
            return res.json({success: false, message: "Enter a valid email"})
        }

        //validating strong passwd
        if(password.length < 8){
            return res.json({success: false, message: "Enter a strong password"})
        }

        //hashing user password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const userData = {
            name, 
            email,
            password: hashedPassword
        }

        const newUser = new User(userData)
        const user = await newUser.save()

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET)
        res.json({success: true, token})

    } catch (error) {
        console.log(error);
        res.status(401).json({ success: false, message: error.message });
    }
}

//Api for user login
const loginUser = async (req, res) => {
    try {
        
        const {email, password} = req.body
        const user = await User.findOne({email})

        if (!user) {
            return res.json({success: false, message:"User does not exists"})
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if(isMatch){
            const token = jwt.sign({id: user._id}, process.env.JWT_SECRET)
            res.json({success: true, token})
        } else{
            res.json({success: false, message: "Invalid credentials"})
        }


    } catch (error) {
        console.log(error);
        res.status(401).json({ success: false, message: error.message });
    }
}

//API to get user profile data  
const getProfile = async (req, res) => {
    try {
        const userId = req.userId;

        const userData = await User.findById(userId).select('-password');

        if (!userData) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({ success: true, userData });

    } catch (error) {
        console.log(error);
        res.status(401).json({ success: false, message: error.message });
    }
}

//API to update profile
const updateProfile = async (req, res) => {
    try {
        

        const {userId, name, contactInfo, address, dob, gender} = req.body
        const imageFile = req.file

        if(!name || !contactInfo || !dob || !gender || !address){ 
            return res.json({success: false, message: "Data missing"})
        }

        await User.findByIdAndUpdate(userId, {name, contactInfo, address, dob, gender, address})

        if(imageFile){
            try {
                const imageUpload = await cloudinary.uploader.upload(imageFile.path, {resource_type: 'image'})
                const imageUrl = imageUpload.secure_url

                await User.findByIdAndUpdate(userId, {image: imageUrl})
            } catch (error) {
                console.error("Image upload failed:", uploadError);
                return res.status(500).json({
                    success: false,
                    message: "Image upload to Cloudinary failed.",
                });
            }
        }

        res.json({success: true, message: "Profile updated"})

    } catch (error) {
        console.log(error);
        res.status(401).json({ success: false, message: error.message });
    }
}

//API for book appointment
const bookAppointment = async (req, res) => {
    try {

        const {userId, doctorId, slotDate, slotTime} = req.body
        
        const doctorData = await Doctor.findById(doctorId).select('-password')

        if(!doctorData.available){
            return res.json({success: false, message: "Doctor not available"})
        }

        let slotsBooked = doctorData.slotsBooked

        //checkign fo rslots availability
        if(slotsBooked[slotDate]){
            if(slotsBooked[slotDate].include(slotTime)){
                return res.json({success: false, message: "Slot not available"}) 
            }
            else{
                slotsBooked[slotDate].push(slotTime)
            }
        } else {
            slotsBooked[slotDate] = []
            slotsBooked[slotDate].push(slotTime)
        }

        const userData = await User.findById(userId).select('-password')

        delete doctorData.slotsBooked

        const appointmentData = {
            userId,
            doctorId,
            userData,
            doctorData,
            amount: doctorData.fees,
            slotDate,
            slotTime,
            date: Date.now()

        }

        const newAppointment = new Appointment(appointmentData)
        await newAppointment.save()

        //save new slots data in doctorData
        await Doctor.findByIdAndUpdate(doctorId, {slotsBooked})
        res.json({success: true, message: "Appointment booked"})

    } catch (error) {
        console.log(error);
        res.status(401).json({ success: false, message: error.message });
    }
}

//API to get user appointment to show in my-appointment page (do endpoints)
const listAppointmnet = async (req, res) => {
    try {
        const {userId} = req.body
        const appointments =  await Appointment.find({userId})
        res.json({success: true, appointments})
    } catch (error) {
        console.log(error);
        res.status(401).json({ success: false, message: error.message });
    }
}


//API to cancel appointmnet
const cancelApppointment = async (req, res) => {
    try {

        const {userId, appointmentId} = req.body

        const appointmentData = await Appointment.findById(appointmentId)

        // verify appointmnet user
        if(appointmentData.userId !== userId){
            return res.json({success: false, message: "Anauthorized action"})
        }

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


export {registerUser, 
    loginUser, 
    getProfile, 
    updateProfile, 
    bookAppointment, 
    listAppointmnet,
    cancelApppointment,
}