import { uploadFileFromBuffer } from "../middlewares/uploadMiddleware.js";
import User from "../models/User.js";

export const authMe = async (req, res) => {
  try {
    const user = req.user;
    return res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "lỗi hệ thống" });
  }
};

export const searchUserByPhone = async (req, res) => {
  try {
    const { phone } = req.query;

    if (!phone || phone.trim() === "") {
      return res
        .status(400)
        .json({ message: "Cần cung cấp số điện thoại trong query." });
    }

    const user = await User.findOne({ phone }).select(
      "_id displayName avatarUrl email",
    );

    if (!user) {
      return res.status(404).json({
        message: "Không tìm thấy người dùng",
      });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.error("Lỗi xảy ra khi searchUserByPhone", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const uploadAvatar = async (req, res) => {
  try {
    console.log("file:", req.file);
    const file = req.file;
    const userId = req.user._id;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const result = await uploadFileFromBuffer(file.buffer);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        avatarUrl: result.secure_url,
        avatarId: result.public_id,
      },
      {
        new: true,
      },
    ).select("avatarUrl");

    if (!updatedUser.avatarUrl) {
      return res.status(400).json({ message: "Avatar trả về null" });
    }

    return res.status(200).json({ avatarUrl: updatedUser.avatarUrl });
  } catch (error) {
    console.error("Lỗi xảy ra khi upload avatar", error);
    return res.status(500).json({ message: "Upload failed" });
  }
};

export const updateInforMe = async (req, res) => {
  try {
    const { displayName, phone, bio } = req.body;
    const userId = req.user._id;

    if (!displayName || !phone) {
      return res.status(400).json({
        message: "Vui lòng điền đầy đủ họ tên và số điện thoại",
      });
    }
    const existingPhone = await User.findOne({ phone });

    if (existingPhone && existingPhone._id.toString() !== userId.toString()) {
      return res.status(400).json({
        message: "Số điện thoại đã được sử dụng",
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          displayName,
          phone,
          bio: bio || "",
        },
      },
      {
        new: true,
        runValidators: true,
      },
    ).select("-hashedPassword");

    if (!user) {
      return res.status(404).json({
        message: "Không tìm thấy user",
      });
    }

    return res.status(200).json({
      message: "Cập nhật thông tin thành công",
      user,
    });
  } catch (error) {
    console.error("Lỗi xảy ra khi cập nhật thông tin:", error);

    return res.status(500).json({
      message: "Lỗi xảy ra khi cập nhật thông tin",
    });
  }
};
