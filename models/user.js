import mongoose, {Schema} from "mongoose";

const userSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true,
        unique: true
    },
    password: { 
        type: String, 
        required: true 
    },
    dob: {
        type: String,
        default: "NOt Selected"
    },
    age: {
        type: Number
    },
    gender: {
        type: String,
        default: "Not Selected"
    },
    contactInfo: { 
        type: String,
        default: '0000000000'
    },
    address: { 
        type: String, 
        default: ""
    },
    image: { 
        type: String, 
        default: "https://images.pexels.com/photos/7583382/pexels-photo-7583382.jpeg?auto=compress&cs=tinysrgb&w=600"

    },

});

export const User = mongoose.model('User', userSchema)
export default User