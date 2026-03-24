import bcrypt from "bcrypt";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import Session from "../models/Session.js";
import OtpVerification from "../models/OtpVerification.js";
import { sendOtpEmail } from "../utils/sendOtpEmail.js";
import { OAuth2Client } from "google-auth-library";
import { ConversationAi } from "../utils/aiHelper.js";

const ACCESS_TOKEN_TTL = "30m";
const REFRESH_TOKEN_TTL = 14 * 24 * 60 * 60 * 1000; // 14 ngày
const OTP_EXPIRE = 5 * 60 * 1000;
const RESEND_COOLDOWN = 60 * 1000;
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const signUp = async (req, res) => {
  try {
    const { password, email, phone, firstName, lastName } = req.body;

    if (!password || !email || !phone || !firstName || !lastName) {
      return res.status(400).json({ message: "Thiếu thông tin" });
    }

    const duplicate = await User.findOne({
      $or: [{ email }, { phone }],
    });

    if (duplicate) {
      return res.status(409).json({ message: "Tài khoản đã tồn tại" });
    }

    const existingOtp = await OtpVerification.findOne({ email });

    if (existingOtp) {
      if (existingOtp.resendAvailableAt > new Date()) {
        const secondsLeft = Math.ceil(
          (existingOtp.resendAvailableAt - Date.now()) / 1000,
        );

        return res.status(429).json({
          message: "Vui lòng chờ trước khi gửi lại OTP",
          resendIn: secondsLeft,
        });
      }

      await OtpVerification.deleteOne({ email });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const otpHash = await bcrypt.hash(otp, 10);

    const now = Date.now();

    await OtpVerification.create({
      email,
      otpHash,
      userData: {
        hashedPassword,
        email,
        phone,
        displayName: `${lastName} ${firstName}`,
      },
      expiresAt: new Date(now + OTP_EXPIRE),
      resendAvailableAt: new Date(now + RESEND_COOLDOWN),
    });

    await sendOtpEmail(email, otp);

    return res.json({
      message: "OTP đã gửi",
      expiresIn: 300,
      resendIn: 60,
    });
  } catch (error) {
    console.error("signUp error", error);

    return res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};

export const verifySignUpOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

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

    const user = await User.create(record.userData);

    await OtpVerification.deleteOne({ email });
    //tạo cuộc trò chuyện mặc định với chat box
    await ConversationAi(user._id);

    return res.status(201).json({
      message: "Đăng ký thành công",
      userId: user._id,
    });
  } catch (error) {
    console.error("verifyOtp error", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const record = await OtpVerification.findOne({ email });

    if (!record) {
      return res.status(404).json({
        message: "OTP không tồn tại",
      });
    }

    if (record.resendAvailableAt > new Date()) {
      const secondsLeft = Math.ceil(
        (record.resendAvailableAt - Date.now()) / 1000,
      );

      return res.status(429).json({
        message: "Chưa thể gửi lại OTP",
        resendIn: secondsLeft,
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    record.otpHash = await bcrypt.hash(otp, 10);

    record.expiresAt = new Date(Date.now() + OTP_EXPIRE);

    record.resendAvailableAt = new Date(Date.now() + RESEND_COOLDOWN);

    record.attempts = 0;

    await record.save();

    await sendOtpEmail(email, otp);

    return res.json({
      message: "OTP mới đã gửi",
      resendIn: 60,
    });
  } catch (error) {
    console.error("resend otp error", error);

    return res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};

export const signIn = async (req, res) => {
  try {
    // lấy inputs
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Thiếu email hoặc password." });
    }

    // lấy hashedPassword trong db để so với password input
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(401)
        .json({ message: "email hoặc password không chính xác" });
    }

    // kiểm tra password
    const passwordCorrect = await bcrypt.compare(password, user.hashedPassword);

    if (!passwordCorrect) {
      return res
        .status(401)
        .json({ message: "email hoặc password không chính xác" }); // ghi giống trên để hacker ko đoán đc email hay password sai
    }

    // nếu khớp, tạo accessToken với JWT
    const accessToken = jwt.sign(
      { userId: user._id },
      // @ts-ignore
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_TOKEN_TTL },
    );

    // tạo refresh token
    const refreshToken = crypto.randomBytes(64).toString("hex");

    // tạo session mới để lưu refresh token
    await Session.create({
      userId: user._id,
      refreshToken,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL),
    });

    // trả refresh token về trong cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true, // ko thể truy cập bởi js
      secure: true, // chỉ gửi https
      sameSite: "none", //cho phép backend, frontend deploy riêng
      maxAge: REFRESH_TOKEN_TTL,
    });

    // trả access token về trong res
    return res
      .status(200)
      .json({ message: `User ${user.displayName} đã logged in!`, accessToken });
  } catch (error) {
    console.error("lỗi khi gọi signIn", error);
    return res.status(500).json({ message: "lỗi hệ thống" });
  }
};

export const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body; // idToken từ FE

    // verify token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const { sub: googleId, email, name, picture } = payload;

    // check user tồn tại chưa
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        email,
        displayName: name,
        avatarUrl: picture,
        googleId,
      });
    } else {
      if (!user.googleId) {
        user.googleId = googleId;
        await user.save();
      }
    }

    // 👉 từ đây giống signIn của bạn
    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30m" },
    );

    const refreshToken = crypto.randomBytes(64).toString("hex");

    await Session.create({
      userId: user._id,
      refreshToken,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL),
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: REFRESH_TOKEN_TTL,
    });
    //tạo cuộc trò chuyện mặc định với chat box
    await ConversationAi(user._id);
    return res.json({ accessToken });
  } catch (error) {
    console.error("googleLogin error", error);
    return res.status(500).json({ message: "Google login failed" });
  }
};

export const signOut = async (req, res) => {
  try {
    // lấy refresh token từ cookie
    const token = req.cookies?.refreshToken;

    if (token) {
      // xoá refresh token trong Session
      await Session.deleteOne({ refreshToken: token });

      // xoá cookie
      res.clearCookie("refreshToken");
    }
    return res.sendStatus(204);
  } catch (error) {
    console.error("lỗi khi gọi signOut", error);
    return res.status(500).json({ message: "lỗi hệ thống" });
  }
};

// tạo access token mới từ refresh token
export const refreshToken = async (req, res) => {
  try {
    // lấy refresh token từ cookie
    const token = req.cookies?.refreshToken;
    if (!token) {
      return res.status(401).json({ message: "Token không tồn tại." });
    }

    // so với refresh token trong db
    const session = await Session.findOne({ refreshToken: token });

    if (!session) {
      return res
        .status(403)
        .json({ message: "Token không hợp lệ hoặc đã hết hạn" });
    }

    // kiểm tra hết hạn chưa
    if (session.expiresAt < new Date()) {
      return res.status(403).json({ message: "Token đã hết hạn." });
    }

    // tạo access token mới
    const accessToken = jwt.sign(
      {
        userId: session.userId,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_TOKEN_TTL },
    );

    // return
    return res.status(200).json({ accessToken });
  } catch (error) {
    console.error("Lỗi khi gọi refreshToken", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const forgotPasswordOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) return res.status(400).json({ message: "Thiếu email!" });

    const user = await User.findOne({ email });

    if (!user)
      return res.status(404).json({ message: "Email này không tồn tại!" });

    const existingOtp = await OtpVerification.findOne({ email });
    if (existingOtp) {
      if (existingOtp.resendAvailableAt > new Date()) {
        const secondsLeft = Math.ceil(
          (existingOtp.resendAvailableAt - Date.now()) / 1000,
        );

        return res.status(429).json({
          message: "Vui lòng chờ trước khi gửi lại OTP",
          resendIn: secondsLeft,
        });
      }
      await OtpVerification.deleteOne({ email });
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const otpHash = await bcrypt.hash(otp, 10);

    const now = Date.now();

    await OtpVerification.create({
      email,
      otpHash,
      userData: {
        email,
      },
      expiresAt: new Date(now + OTP_EXPIRE),
      resendAvailableAt: new Date(now + RESEND_COOLDOWN),
    });

    await sendOtpEmail(email, otp);
    return res.status(200).json({ message: "Gửi OTP thành công" });
  } catch (error) {
    console.error("forgotPasswordOTP error", error);
    return res
      .status(500)
      .json({ message: "Lỗi hệ thống khi gửi otp quên mật khẩu." });
  }
};
export const verifyForgotPasswordOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp)
      return res.status(400).json({ message: "Thiếu thông tin." });

    const record = await OtpVerification.findOne({ email });
    if (!record) {
      return res.status(400).json({ message: "OTP không tồn tại" });
    }

    if (record.expiresAt < new Date()) {
      return res.status(400).json({ message: "OTP đã hết hạn" });
    }

    if (record.attempts >= 5) {
      return res.status(429).json({
        message: "Bạn đã nhập sai quá nhiều lần vui long thử lại sau 5 phút.",
      });
    }
    const match = await bcrypt.compare(otp, record.otpHash);

    if (!match) {
      record.attempts += 1;
      await record.save();

      return res.status(400).json({ message: "OTP không đúng" });
    }
    const resetToken = jwt.sign(
      { email, type: "reset_password" },
      process.env.JWT_SECRET,
      { expiresIn: "3m" },
    );

    await OtpVerification.deleteOne({ email });

    return res
      .status(200)
      .json({ message: "Xác thực OTP thành công.", resetToken });
  } catch (error) {
    console.error("verifyForgotPasswordOtp error", error);
    return res
      .status(500)
      .json({ message: "Lỗi hệ thống khi xác thực otp quên mật khẩu." });
  }
};
export const forgotPassword = async (req, res) => {
  try {
    const { password } = req.body;
    // lấy token từ header
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

    if (!token) {
      return res.status(401).json({ message: "Thiếu token" });
    }
    let decoded;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res
        .status(401)
        .json({ message: "Token không hợp lệ hoặc hết hạn" });
    }

    if (decoded.type !== "reset_password") {
      return res.status(401).json({ message: "Token không hợp lệ" });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({ message: "Password không hợp lệ" });
    }
    const user = await User.findOne({ email: decoded.email }).select(
      "-hashedPassword",
    );
    if (!user) {
      return res.status(404).json({ message: "Tài khoản không tồn tại." });
    }
    const hashed = await bcrypt.hash(password, 10);
    await User.updateOne({ email: decoded.email }, { hashedPassword: hashed });
    return res.status(200).json({ message: "Đổi mật khẩu thành công" });
  } catch (error) {
    console.error("forgotPassword error", error);
    return res
      .status(500)
      .json({ message: "Lỗi hệ thống khi lấy mật khẩu mới." });
  }
};
