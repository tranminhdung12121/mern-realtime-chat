import express from "express";
import {
  authMe,
  searchUserByPhone,
  updateInforMe,
  uploadAvatar,
} from "../controllers/userController.js";
import { upload } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.get("/me", authMe);
router.get("/search", searchUserByPhone);
router.post("/uploadAvatar", upload.single("file"), uploadAvatar);
router.patch("/updateInforMe", updateInforMe)

export default router;
