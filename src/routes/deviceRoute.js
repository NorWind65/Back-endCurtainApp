import express from "express";
import User from "../models/User.js";
import Device from "../models/Device.js";
import jwt from "jsonwebtoken";
const router = express.Router();

router.post("/signDevice", async (req, res) => {
  try {
    const { deviceId, password } = req.body;
    if (!deviceId || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }
    // check if device exists
    const device = await Device.find({ deviceId });
    if (!device) {
      return res.status(400).json({ message: "Device Existed" });
    }
    const newDevice = new Device({
        deviceId,
        deviceName:"Curtain"+deviceId,
        password,
      });
    await newDevice.save();
    return res.status(200).json(newDevice);

  } catch (error) {
    console.log("Error in getting devices", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;