import express from "express";
import { login, register, getUser } from "../controllers/userController.js";
import { authMiddleware } from "../middlewares/auth.js";


const router = express.Router();

router.post("/register", register);
router.post("/login", login);
// router.get("/logout", isAuthenticated, logout);
router.get("/getuser", authMiddleware, getUser);

export default router;