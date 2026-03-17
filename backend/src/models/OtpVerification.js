import mongoose from "mongoose";

const otpVerificationSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    index: true
  },

  otpHash: {
    type: String,
    required: true
  },

  userData: {
    type: Object,
    required: true
  },

  attempts: {
    type: Number,
    default: 0
  },

  expiresAt: {
    type: Date,
    required: true
  },

  resendAvailableAt: {
    type: Date,
    required: true
  }
});


otpVerificationSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 }
);

const OtpVerification = mongoose.model(
  "OtpVerification",
  otpVerificationSchema
);

export default OtpVerification;
