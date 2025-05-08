import express from "express";
import User from "../models/User.js";
import Device from "../models/Device.js";
import jwt from "jsonwebtoken";
import protectUserRoute from "../middleware/user.middleware.js";

const router = express.Router();

router.get("/getDevice", protectUserRoute, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate("deviceId").select("-password");
        return res.status(200).json(user.deviceId);
    } catch (error) {
        console.log("Error in getting user", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.put("/addDevice",protectUserRoute ,async (req, res) => {
  try {
    const { deviceId, password } = req.body;
    if (!deviceId || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }
    // check if device not exists
    const device = await Device.find({ deviceId });     
    if(!device) {
      return res.status(400).json({ message: "Invalid Device" });
    }

    //check if device compare password
    const isPasswordValid = await device.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid Device" });
    }

    const user = await User.findById(req.user._id);


    user.deviceId.push(device._id);
    await user.save();
    return res.status(200).json(user);

} catch (error) {
    console.log("Error in getting devices", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
router.put("/removeDevice/:id",protectUserRoute ,async (req, res) => {
    try {
        const { deviceId } = req.params.id;
        // check if device not exists
        const device = await Device.findById(deviceId);     
        if(!device) {
            return res.status(400).json({ message: "Invalid Device" });
        }

        const user = await User.findById(req.user._id);
        user.deviceId = user.deviceId.filter((d) => d.toString() !== device._id.toString());
        await user.save();
        return res.status(200).json(user);

    } catch (error) {
        console.log("Error in getting devices", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export default router;