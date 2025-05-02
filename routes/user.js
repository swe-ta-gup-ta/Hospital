import express from 'express'

import { 
    bookAppointment, 
    cancelApppointment, 
    getProfile, 
    listAppointmnet, 
    loginUser, 
    registerUser, 
    updateProfile 
} from '../controllers/user.js'

import authUser from '../middlewares/authUser.js'
import { upload } from '../middlewares/multer.js'


const userRouter = express.Router()

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)

userRouter.get('/get-profile', authUser, getProfile)
userRouter.post('/update-profile', upload.single('image'), authUser, updateProfile)
userRouter.post('/book-appointment', authUser, bookAppointment)  
userRouter.get('/appointments', authUser, listAppointmnet) 
userRouter.post('/cancel-appointment', authUser, cancelApppointment)  

export default userRouter