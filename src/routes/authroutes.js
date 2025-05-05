import express from "express";

const router = express.Router();

router.post("/login", async (req, res) => {
  res.send("Login");
});

router.post("/signup", async (req, res) => {
    res.send("signup");
});
  

export default router;