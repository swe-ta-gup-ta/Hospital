import jwt from 'jsonwebtoken'

const authDoctor = async (req, res, next) =>  {
    try {
        const doctorToken = req.headers['doctortoken'];

        if (!doctorToken) {
            return res.status(401).json({ success: false, message: "Not authorized. Login again." });
        }

        const token_decode = jwt.verify(doctorToken, process.env.JWT_SECRET);
        // req.body.doctorId = token_decode.id
        req.doctorId = token_decode.id;
        next();

    } catch (error) {
        console.log(error);
        res.status(401).json({ success: false, message: error.message });
    }
}

export default authDoctor;
