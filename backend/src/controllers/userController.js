import { uploadFileFromBuffer } from "../middlewares/uploadMiddleware.js";
import OtpVerification from "../models/OtpVerification.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import { sendOtpEmail } from "../utils/sendOtpEmail.js";

const OTP_EXPIRE = 5 * 60 * 1000;
const RESEND_COOLDOWN = 60 * 1000;

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
    return res
      .status(500)
      .json({ message: "Lỗi xảy ra khi cập nhật thông tin" });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { currentPassword, password, confirmPassword } = req.body;
    const userId = req.user._id;

    if (!currentPassword || !password || !confirmPassword) {
      return res.status(400).json({ message: "Thiếu thông tin." });
    }

    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ message: "Xác nhận mật khẩu mới chưa khớp." });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Tài khoản không tồn tại." });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.hashedPassword);
    if (!isMatch) {
      return res.status(401).json({ message: "Mật khẩu không đúng" });
    }

    const newHashedPassword = await bcrypt.hash(password, 10);
    await User.findByIdAndUpdate(userId, {
      hashedPassword: newHashedPassword,
    });
    return res
      .status(200)
      .json({ message: "Cập nhật mật khẩu mới thành công." });
  } catch (error) {
    console.error("Lỗi xảy ra khi cập nhật mật khẩu:", error);
    return res
      .status(500)
      .json({ message: "Lỗi xảy ra khi cập nhật mật khẩu" });
  }
};

export const updateEmail = async (req, res) => {
  try {
    const { email, currentPassword } = req.body;
    const userId = req.user._id;
    if (!currentPassword || !email) {
      return res
        .status(400)
        .json({ message: "Vui lòng điền đầy đủ thông tin." });
    }

    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({ message: "Tài khoản không tồn tại." });

    const isMatch = await bcrypt.compare(currentPassword, user.hashedPassword);
    if (!isMatch)
      return res.status(401).json({ message: "Mật khẩu không đúng" });

    const emailExist = await User.exists({ email });
    if (emailExist)
      return res.status(404).json({ message: "Email này đã tồn tại" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = await bcrypt.hash(otp, 10);
    await OtpVerification.create({
      email,
      otpHash,
      userData: {
        email,
      },
      expiresAt: new Date(Date.now() + OTP_EXPIRE),
      resendAvailableAt: new Date(Date.now() + RESEND_COOLDOWN),
    });
    await sendOtpEmail(email, otp);
    return res.json({
      message: "OTP đã gửi",
      expiresIn: 300,
      resendIn: 60,
    });
  } catch (error) {
    console.error("Lỗi hệ thống:", error);
    return res.status(500).json({ message: "Lỗi hệ thống." });
  }
};

export const updateEmailOtp = async (req, res) => {
  try {
    const { otp, email } = req.body;
    const userId = req.user._id;
    if (!otp) return res.status(400).json({ message: "Vui lòng nhập otp." });

    const record = await OtpVerification.findOne({ email });

    if (!record) {
      return res.status(400).json({ message: "OTP không tồn tại" });
    }

    if (record.expiresAt < new Date()) {
      return res.status(400).json({ message: "OTP đã hết hạn" });
    }

    if (record.attempts >= 5) {
      return res.status(429).json({
        message: "Bạn đã nhập sai quá nhiều lần vui lòng thử lại sau 5 phút.",
      });
    }

    const match = await bcrypt.compare(otp, record.otpHash);

    if (!match) {
      record.attempts += 1;
      await record.save();
      return res.status(400).json({ message: "OTP không đúng" });
    }
    await User.findByIdAndUpdate(userId, {
      email,
    });
    await OtpVerification.deleteOne({ email });
    return res.status(201).json({
      message: "Cập nhật email thành công.",
    });
  } catch (error) {
    console.error("Lỗi hệ thống:", error);
    return res.status(500).json({ message: "Lỗi hệ thống." });
  }
};
