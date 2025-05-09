import jwt from "jsonwebtoken";
import User from "../models/User.js";



const protectUserRoute = async (req, res, next) => {
    try {
        //get token from header
        const token = req.headers["authorization"].replace("Bearer ", "");
        if (!token) {
            return res.status(401).json({ message: "Unauthorized, access denied" });
        }
        //verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select("-password");
        if (!user) {
            return res.status(401).json({ message: "Token is not valid" ,token});
        }

        req.user = user;
        next();

    } catch (error) {
        console.log("Error in user middleware", error);
        res.status(401).json({ message: "Token is not valid" });
    }
}

export default protectUserRoute;