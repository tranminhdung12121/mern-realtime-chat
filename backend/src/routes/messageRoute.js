import express from "express";

import {
  deleteMessage,
  sendDirectMessage,
  sendGroupMessage,
} from "../controllers/messageController.js";

import {
  checkFriendship,
  checkGroupMembership,
} from "../middlewares/friendMiddleware.js";

import { upload } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.post(
  "/direct",
  upload.array("files", 5),
  checkFriendship,
  sendDirectMessage,
);

router.post(
  "/group",
  upload.array("files", 5),
  checkGroupMembership,
  sendGroupMessage,
);

router.delete("/:_id", deleteMessage)

export default router;
