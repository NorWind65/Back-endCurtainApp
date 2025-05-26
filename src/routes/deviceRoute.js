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
    const device = await Device.findOne({ deviceId });
    if (device) {
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

router.put("/resetDevice/" ,async (req, res) => {
  try {
      const device_Id  = req.body.device_Id;
      // check if device not exists
      const device = await Device.findById(device_Id);     
      if(!device) {
          return res.status(400).json({ message: "Invalid Device" });
      }
      device.deviceName = "Curtain"+device.deviceId;
      device.timeOC = 0;
      await device.save();
      return res.status(200).json(device);

  } catch (error) {
      console.log("Error in getting devices", error);
      res.status(500).json({ message: "Internal server error" });
  }
});

// Device 
router.get("/getDevice", async (req, res) => {
  try {
    const {deviceId }= req.query;
    const devices = await Device.find({deviceId}).select("-password"); 
    if (!devices) {
      return res.status(400).json({ message: "No Devices" });
    }
    return res.status(200).json(devices);
  } catch (error) {
    console.log("Error in getting devices", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


router.put("/updateLight", async (req, res) => {
  try {
    const { light } = req.body;
    const { deviceId } = req.query;
    if (!deviceId || light === undefined) {
      return res.status(400).json({ message: "Please fill all fields" });
    }
    // check if device exists
    const device = await Device.findOne({ deviceId });
    if (!device) {
      return res.status(400).json({ message: "Device not found" });
    }
    device.light = light;
    await device.save();
    return res.status(200).json(device);
  } catch (error) {
    console.log("Error in updating light", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/updatePercent", async (req, res) => {
  try {
    const { percent } = req.body;
    const { deviceId } = req.query;
    if (!deviceId || percent === undefined) {
      return res.status(400).json({ message: "Please fill all fields" });
    }
    // check if device exists
    const device = await Device.findOne({ deviceId });
    if (!device) {
      return res.status(400).json({ message: "Device not found" });
    }
    device.percent = percent;
    await device.save();
    return res.status(200).json(device);
  } catch (error) {
    console.log("Error in updating percent", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/updateAutoMode", async (req, res) =>{
       try {
          const { autoMode } = req.body;
          const { deviceId } = req.query;
          if (!deviceId || autoMode === undefined) {
            return res.status(400).json({ message: "Please fill all fields" });
          }
          // check if device exists
          const device = await Device.findOne({ deviceId });
          if (!device) {
            return res.status(400).json({ message: "Device not found" });
          }
          device.autoMode = autoMode;
          await device.save();
          return res.status(200).json(device);
        } catch (error) {
          console.log("Error in updating autoMode", error);
          res.status(500).json({ message: "Internal server error" });
        }
});

router.put("/updateOpenTime", async (req, res) =>{
       try {
          const { openTime, isOpenTime } = req.body;
          const { deviceId } = req.query;
          if (!deviceId || isOpenTime === undefined) {
            return res.status(400).json({ message: "Please fill all fields" });
          }
          if(isOpenTime && !openTime) {
            return res.status(400).json({ message: "Please fill open time"  });
          }
          // check if device exists
          const device = await Device.findOne({ deviceId });
          if (!device) {
            return res.status(400).json({ message: "Device not found" });
          }
          device.isOpenTime = isOpenTime;
          if(isOpenTime) {
            device.OpenTime = openTime;
          }
          await device.save();
          return res.status(200).json(device);
        } catch (error) {
          console.log("Error in updating openTime", error);
          res.status(500).json({ message: "Internal server error" });
        }
});

router.put("/updateCloseTime", async (req, res) =>{
       try {
          const { closeTime, isCloseTime } = req.body;
          const { deviceId } = req.query;
          if (!deviceId || isCloseTime === undefined) {
            return res.status(400).json({ message: "Please fill all fields" });
          }
          if(isCloseTime && !closeTime) {
            return res.status(400).json({ message: "Please fill close time" });
          }
          // check if device exists
          const device = await Device.findOne({ deviceId });
          if (!device) {
            return res.status(400).json({ message: "Device not found" });
          }
          device.isCloseTime = isCloseTime;
          if(isCloseTime) {
            device.CloseTime = closeTime;
          }
          await device.save();
          return res.status(200).json(device);
        } catch (error) {
          console.log("Error in updating closeTime", error);
          res.status(500).json({ message: "Internal server error" });
        }
});

export default router;