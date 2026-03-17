import express from "express";
import { signUp, signIn, signOut, refreshToken, resendOtp, verifySignUpOtp, googleLogin } from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signUp);

router.post("/verify-signup-otp", verifySignUpOtp);

router.post("/resend-otp", resendOtp);

router.post("/signin", signIn);

router.post("/google", googleLogin);

router.post("/signout", signOut);

router.post("/refresh", refreshToken);

export default router;