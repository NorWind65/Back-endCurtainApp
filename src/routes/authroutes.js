import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
const router = express.Router();

const generateAuthToken = (user) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
  return token;
}

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    // check if user exists
    const user  = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // generate token
    const token = generateAuthToken(user);
    return res.status(200).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        deviceId: user.deviceId,
      },
    });
  } catch (error) {
    console.log("Error in login", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/signup", async (req, res) => {
    try {
      const { email, username, password } = req.body;

      if (!email || !username || !password) {
        return res.status(400).json({ message: "Please fill all fields" });
      }

      if( password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters" });
      }

      if(username.length < 3) {
        return res.status(400).json({ message: "Username must be at least 3 characters" });
      }
      // check if user already exists
      const existingEmail = await User.findOne( { email } );
      if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }
      // create new user
      const newUser = new User({
        email,
        username,
        password,
        deviceId: [],
      });
      await newUser.save();

      const token = generateAuthToken(newUser);
     
      res.status(201).json({ 
        token,
        newUser: {
          id: newUser._id,
          email: newUser.email,
          username: newUser.username,
          deviceId: newUser.deviceId,
        },
      });

    } catch (error) {
      console.log("Error in signup", error);
      res.status(500).json({ message: "Internal server error" });
    }
});
  

export default router;