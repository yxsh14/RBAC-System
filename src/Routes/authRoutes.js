import express from "express";
import { register, login, logout} from "../Controllers/authController.js"
import { verifyJWT } from "../Middlewares/authMiddleware.js";
const router=express.Router();
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").post(verifyJWT,logout);

export default router;