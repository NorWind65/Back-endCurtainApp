import express from "express";
import User from "../models/User.js";
import Device from "../models/Device.js";
import jwt from "jsonwebtoken";
import protectUserRoute from "../middleware/user.middleware.js";

const router = express.Router();


router.put("/updateInfo", protectUserRoute, async (req, res)=>{
    try{
        const { newEmail, newUserName, newPassword, oldPassword } = req.body;
        const ID =  req.user._id ; //"681b5f1db01e02ec04bd115b";
        const user = await User.findById(ID).select("-password");

        const isPasswordValid = await user.comparePassword(oldPassword);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid old Password" });
        }

        if(newPassword.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        if(newUserName.length < 3) {
            return res.status(400).json({ message: "Username must be at least 3 characters" });
        }
        if( newUserName != user.username){
            const existingUsername = await User.findOne( { newUserName } );  
            if (existingUsername ) {
                return res.status(400).json({ message: "Username already exists" });
            }
        }
        if( newEmail != user.email){
            const existingEmail = await User.findOne( { email } );
            if (existingEmail) {
                return res.status(400).json({ message: "Email already exists" });
            }
        }

        user.username = newUserName;
        user.email = newEmail;
        user.password = newPassword;
        await user.save();
        
        return res.status(200).json({
            user: {
                id: user._id,
                email: user.email,
                username: user.username,
            },
        })



    }catch (error) {
        console.log("Error in getting user", error);
        res.status(500).json({ message: "Internal server error" });
    }

})

router.get("/getDevices", protectUserRoute , async (req, res) => {
    try {
        const ID =  req.user._id; //"681b5f1db01e02ec04bd115b"; 
        const user = await User.findById(ID).populate("deviceId").select("-password");
        return res.status(200).json(user.deviceId);
    } catch (error) {
        console.log("Error ", error);
        res.status(500).json({ message: "Internal server error" });
    }
});



router.get("/getDevice" , protectUserRoute ,async (req, res) => {
    try {
        const ID =  req.user._id ; //"681b5f1db01e02ec04bd115b";
        const user = await User.findById(ID).select("-password");
        const {deviceId }= req.query;

        const device = await Device.findOne({deviceId});     
        if (! user.deviceId.includes(deviceId) ) {
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
        console.log("Error ", error);
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
        console.log("Error ", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.put("/updateTimeOC", protectUserRoute ,async (req, res) => {
    try {
        const { deviceId, timeOC } = req.body;
        if (!deviceId || !timeOC) {
            return res.status(400).json({ message: "Please fill all fields" });
        }
        // check if device exists
        const device = await Device.findOne({deviceId: deviceId});
        if (!device) {
            return res.status(400).json({ message: "Invalid Device" });
        }
        // check if user has access to the device
        const ID =  req.user._id; // "681b5f1db01e02ec04bd115b";
        const user = await User.findById(ID);
        if (!user.deviceId.includes(device._id)) {
            return res.status(400).json({ message: "You don't have access to this device" });
        }
        
        device.timeOC = timeOC;
        await device.save();

        return res.status(200).json({ message: 'Time OC updated successfully'});

    } catch (error) {
        console.log("Error ", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.put("/updateDeviceName", protectUserRoute ,async (req, res) => {
    try {
        const { deviceId, deviceName } = req.body;
        if (!deviceId || !deviceName) {
            return res.status(400).json({ message: "Please fill all fields" });
        }
        // check if device exists
       const device = await Device.findOne({deviceId: deviceId});
        if (!device) {
            return res.status(400).json({ message: "Invalid Device" });
        }
        // check if user has access to the device
        const ID =  req.user._id; // "681b5f1db01e02ec04bd115b";
        const user = await User.findById(ID);
        if (!user.deviceId.includes(device._id)) {
            return res.status(400).json({ message: "You don't have access to this device" });
        }
        
        device.deviceName = deviceName;
        await device.save();

        return res.status(200).json({ message: 'Device name updated successfully'});

    } catch (error) {
        console.log("Error ", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.put("/sendCmd", protectUserRoute ,async (req, res) => {
    try {
        const { deviceId, cmd } = req.body;
        if (!deviceId || !cmd) {
            return res.status(400).json({ message: "Please fill all fields" });
        }
        // check if device exists
        const device = await Device.findOne({deviceId: deviceId});
        if (!device) {
            return res.status(400).json({ message: "Invalid Device" });
        }
        // check if user has access to the device
        const ID =  req.user._id; // "681b5f1db01e02ec04bd115b";
        const user = await User.findById(ID);
        if (!user.deviceId.includes(device._id)) {
            return res.status(400).json({ message: "You don't have access to this device" });
        }
        
        device.cmd = cmd;
        await device.save();

        return res.status(200).json({ message: 'Send cmd successfully'});

    } catch (error) {
        console.log("Error ", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
export default router;