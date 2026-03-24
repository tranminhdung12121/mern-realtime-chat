import express from "express";
import {
  signUp,
  signIn,
  signOut,
  refreshToken,
  resendOtp,
  verifySignUpOtp,
  googleLogin,
  forgotPasswordOTP,
  verifyForgotPasswordOtp,
  forgotPassword,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signUp);

router.post("/verify-signup-otp", verifySignUpOtp);

router.post("/resend-otp", resendOtp);

router.post("/signin", signIn);

router.post("/google", googleLogin);

router.post("/signout", signOut);

router.post("/refresh", refreshToken);

router.post("/forgot-password/request-otp", forgotPasswordOTP);

router.post("/forgot-password/verify-otp", verifyForgotPasswordOtp);

router.patch("/forgot-password/reset", forgotPassword);

export default router;
