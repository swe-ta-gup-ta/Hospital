import Doctor from "../models/doctor.js";


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

export { changeAvailability, doctorList }