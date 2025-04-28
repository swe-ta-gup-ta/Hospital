import jwt from 'jsonwebtoken'

const authUser = async (req, res, next) =>  {
    try {
        const userToken = req.headers['usertoken'];

        if (!userToken) {
            return res.status(401).json({ success: false, message: "Not authorized. Login again." });
        }

        const token_decode = jwt.verify(userToken, process.env.JWT_SECRET);
        req.body.userId = token_decode.id
        next();

    } catch (error) {
        console.log(error);
        res.status(401).json({ success: false, message: error.message });
    }
}

export default authUser;
