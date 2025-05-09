import express from "express";
import User from "../models/User.js";
import Device from "../models/Device.js";
import jwt from "jsonwebtoken";
import protectUserRoute from "../middleware/user.middleware.js";

const router = express.Router();

router.get("/getDevices", protectUserRoute , async (req, res) => {
    try {
        const ID =  req.user._id; //"681b5f1db01e02ec04bd115b"; 
        const user = await User.findById(ID).populate("deviceId").select("-password");
        return res.status(200).json(user.deviceId);
    } catch (error) {
        console.log("Error in getting user", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get("/getDevice", protectUserRoute , async (req, res) => {
    try {
        const ID =  req.user._id; //"681b5f1db01e02ec04bd115b"; 
        const user = await User.findById(ID).select("-password");
        const DeviceId = req.params.deviceId;
        const device = await Device.findOne({ deviceId });     
        if (!user.deviceId.includes(device._id)) {
          return res.status(400).json({ message: "Not Found Device" });
        }

        return res.status(200).json(device);
    } catch (error) {
        console.log("Error ", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.put("/addDevice" , protectUserRoute ,async (req, res) => {
  try {
    const { deviceId, password } = req.body;
    if (!deviceId || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }
    // check if device not exists
    const device = await Device.findOne({ deviceId });     
    if(!device) {
      return res.status(400).json({ message: "Invalid Device" });
    }

    //check if device compare password
    const isPasswordValid = await device.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid Device" });
    }
    const ID =  req.user._id; // "681b5f1db01e02ec04bd115b";
    const user = await User.findById(ID);

    if (user.deviceId.includes(device._id)) {
      return res.status(400).json({ message: "Device already added to your account" });
    }

    user.deviceId.push(device._id);
    await user.save();
    return res.status(200).json(user);

} catch (error) {
    console.log("Error in getting devices", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
router.put("/removeDevice/", protectUserRoute ,async (req, res) => {
    try {
        const  deviceId  = req.body.device_Id;
        // check if device not exists
        const device = await Device.findById(deviceId);     
        if(!device) {
            return res.status(400).json({ message: "Invalid Device" });
        }
        const ID =  req.user._id;//  "681b5f1db01e02ec04bd115b"; 
        const user = await User.findById(ID);
        user.deviceId = user.deviceId.filter((d) => d.toString() !== device._id.toString());
        await user.save();
        return res.status(200).json(user);

    } catch (error) {
        console.log("Error in getting devices", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export default router;