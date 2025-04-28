import mongoose from 'mongoose';

const connectDB = async() => {
    await mongoose.connect('mongodb://127.0.0.1:27017/hospitalDB')
    .then(() => {
        console.log('MongoDB connected');
    })
    .catch(err => console.error('MongoDB connection error:', err));
}

export default connectDB