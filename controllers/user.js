import validator from 'validator'
import bcrypt from 'bcrypt'
import User from '../models/user.js'
import jwt from 'jsonwebtoken'
import {v2 as cloudinary} from 'cloudinary'

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

//API to get user profile data  ///do it tomorrow//
const getProfile = async (req, res) => {
    try {
        const token = req.headers.usertoken;

        if (!token) {
            return res.status(401).json({ success: false, message: 'No token provided' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // replace 'your_jwt_secret' with your actual secret key

        const userId = decoded.id; // Assuming your token contains the user's ID as `id`

        const userData = await User.findById(userId).select('-password');

        res.json({ success: true, userData });

        // const {userId} = req.body
        // const userData = await User.findById(userId).select('-password')

        // res.json({success: true, userData})

    } catch (error) {
        console.log(error);
        res.status(401).json({ success: false, message: error.message });
    }
}

//API to update profile (do this tomorrow)
const updateProfile = async (req, res) => {
    try {
        

        const {userId, name, contactInfo, address, dob, gender} = req.body
        const imageFile = req.file

        if(!name || !contactInfo || !dob || !gender){ 
            return res.json({success: false, message: "Data missing"})
        }

        await User.findByIdAndUpdate(userId, {name, contactInfo, address, dob, gender})

        if(imageFile){
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, {resource_type: 'image'})
            const imageUrl = imageUpload.secure_url

            await User.findByIdAndUpdate(userId, {image: imageUpload})
        }

        res.json({success: true, message: "Profile updated"})

    } catch (error) {
        console.log(error);
        res.status(401).json({ success: false, message: error.message });
    }
}

export {registerUser, loginUser, getProfile, updateProfile}