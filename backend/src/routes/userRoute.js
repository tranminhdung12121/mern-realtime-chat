import express from "express";
import {
  authMe,
  searchUserByPhone,
  updateEmail,
  updateEmailOtp,
  updateInforMe,
  updatePassword,
  uploadAvatar,
} from "../controllers/userController.js";
import { upload } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.get("/me", authMe);
router.get("/search", searchUserByPhone);
router.post("/uploadAvatar", upload.single("file"), uploadAvatar);
router.patch("/updateInforMe", updateInforMe)
router.patch("/updatePassword", updatePassword)
router.patch("/updateEmail", updateEmail)
router.patch("/updateEmailOtp", updateEmailOtp)

export default router;
