import jwt from 'jsonwebtoken'

const authAdmin = async (req, res, next) =>  {
    try {
        const adminToken = req.headers['admintoken'];

        if (!adminToken) {
            return res.status(401).json({ success: false, message: "Not authorized. Login again." });
        }

        const token_decode = jwt.verify(adminToken, process.env.JWT_SECRET);

        // console.log(token_decode)

        // Check if decoded email and password matches
        if (token_decode !== (process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD)) {
            return res.status(401).json({ success: false, message: "Not authorized. Login again." });
        }

        next();

    } catch (error) {
        console.log(error);
        res.status(401).json({ success: false, message: error.message });
    }
}

export default authAdmin;
