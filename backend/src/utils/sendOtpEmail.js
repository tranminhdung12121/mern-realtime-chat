import nodemailer from "nodemailer";

export const sendOtpEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Email Verification",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: 'Inter', system-ui, -apple-system, sans-serif; background: #f5f5f5; margin: 0; padding: 24px;">
          <div style="max-width: 480px; margin: 0 auto; background: white; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 40px -10px rgba(0,0,0,0.1);">
            
            <!-- Header với gradient -->
            <div style="background: linear-gradient(135deg, #F97316 0%, #FB923C 100%); padding: 32px 24px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">Chatify</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 16px;">Xác thực tài khoản của bạn</p>
            </div>

            <!-- Nội dung chính -->
            <div style="padding: 32px 24px;">
              <h2 style="color: #1a1a1a; font-size: 20px; font-weight: 600; margin: 0 0 8px 0;">Xin chào!</h2>
              <p style="color: #666; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
                Bạn đang tạo tài khoản Chatify. Hãy sử dụng mã OTP dưới đây để hoàn tất đăng ký:
              </p>

              <!-- OTP Code -->
              <div style="background: #f8fafc; border-radius: 16px; padding: 24px; text-align: center; border: 2px dashed #F97316; margin: 24px 0;">
                <div style="font-size: 14px; color: #666; margin-bottom: 8px;">Mã xác thực của bạn</div>
                <div style="font-size: 28px; font-weight: 700; letter-spacing: 6px; color: #F97316; font-family: monospace;">${otp}</div>
              </div>

              <!-- Thông tin thêm -->
              <div style="background: #fff7ed; border-radius: 12px; padding: 16px; margin: 24px 0;">
                <p style="color: #9a3412; font-size: 14px; margin: 0; display: flex; align-items: center; gap: 8px;">
                  <span style="font-size: 20px;">⏰</span>
                  Mã OTP có hiệu lực trong 5 phút. Vui lòng không chia sẻ mã này với bất kỳ ai.
                </p>
              </div>

              <!-- Footer -->
              <div style="border-top: 1px solid #eee; padding-top: 24px; margin-top: 24px;">
                <p style="color: #999; font-size: 14px; text-align: center; margin: 0;">
                  Nếu bạn không yêu cầu xác thực này, vui lòng bỏ qua email này.
                </p>
              </div>
            </div>

            <!-- Footer cuối -->
            <div style="background: #fafafa; padding: 20px 24px; text-align: center; border-top: 1px solid #eee;">
              <p style="color: #999; font-size: 13px; margin: 0;">
                © 2026 Chatify. Tất cả quyền được bảo lưu.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("OTP sent to:", email);
  } catch (err) {
    console.error("Send email error:", err);
  }
};
