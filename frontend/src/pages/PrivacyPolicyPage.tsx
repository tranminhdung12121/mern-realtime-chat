// pages/PrivacyPolicyPage.tsx
import { motion } from "framer-motion";
import {
  Shield,
  Lock,
  Eye,
  Database,
  Cookie,
  Mail,
  UserCheck,
  Trash2,
  ArrowLeft,
  Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { Badge } from "@/components/ui/badge";

const PrivacyPolicyPage = () => {
  const navigate = useNavigate();

  const sections = [
    {
      icon: <Database className="h-5 w-5" />,
      title: "1. Thông tin chúng tôi thu thập",
      details: [
        "Thông tin cá nhân: Họ tên, email, số điện thoại",
        "Thông tin tài khoản: Tên đăng nhập, mật khẩu (đã mã hóa)",
        "Thông tin sử dụng: Lịch sử chat, kết bạn, tương tác",
        "Thông tin kỹ thuật: Địa chỉ IP, thiết bị, trình duyệt"
      ]
    },
    {
      icon: <Lock className="h-5 w-5" />,
      title: "2. Cách chúng tôi sử dụng thông tin",
      details: [
        "Cung cấp và cải thiện dịch vụ Chatify",
        "Bảo mật tài khoản và phát hiện hoạt động bất thường",
        "Gửi thông báo và cập nhật tính năng mới",
        "Hỗ trợ khách hàng và xử lý sự cố"
      ]
    },
    {
      icon: <Eye className="h-5 w-5" />,
      title: "3. Chia sẻ thông tin",
      details: [
        "Không bán thông tin cá nhân cho bên thứ ba",
        "Chia sẻ với đối tác khi có sự đồng ý của bạn",
        "Có thể tiết lộ khi pháp luật yêu cầu",
        "Dữ liệu ẩn danh có thể được sử dụng cho phân tích"
      ]
    },
    {
      icon: <Shield className="h-5 w-5" />,
      title: "4. Bảo mật dữ liệu",
      details: [
        "Mã hóa SSL/TLS cho mọi kết nối",
        "Mật khẩu được mã hóa an toàn",
        "Xác thực hai lớp (2FA) cho tài khoản",
        "Kiểm tra bảo mật định kỳ"
      ]
    },
    {
      icon: <Cookie className="h-5 w-5" />,
      title: "5. Cookie và công nghệ theo dõi",
      details: [
        "Sử dụng cookie để duy trì đăng nhập",
        "Cookie phân tích hành vi người dùng",
        "Bạn có thể tắt cookie trong trình duyệt",
        "Một số tính năng có thể bị ảnh hưởng"
      ]
    },
    {
      icon: <UserCheck className="h-5 w-5" />,
      title: "6. Quyền của người dùng",
      details: [
        "Xem và chỉnh sửa thông tin cá nhân",
        "Xuất dữ liệu của bạn",
        "Xóa tài khoản vĩnh viễn",
        "Rút lại sự đồng ý chia sẻ thông tin"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      {/* Header */}
      <div className="relative bg-gradient-to-r from-orange-500 to-amber-500 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 py-16">
          <Button
            variant="ghost"
            className="text-white hover:bg-white/20 mb-8"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex p-3 bg-white/20 rounded-2xl mb-4">
              <Shield className="h-8 w-8" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Chính sách bảo mật</h1>
            <p className="text-lg opacity-90 max-w-2xl mx-auto">
              Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn
            </p>
            <Badge variant="outline" className="mt-4 bg-white/20 text-white border-white/30">
              Cập nhật lần cuối: 10/03/2026
            </Badge>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid gap-6">
          {sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <div className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl 
                border border-orange-100/50 hover:border-orange-200 
                transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-orange-100 to-amber-100 
                    text-orange-600 group-hover:scale-110 transition-transform duration-300">
                    {section.icon}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-gray-800 mb-3 
                      group-hover:text-orange-600 transition-colors">
                      {section.title}
                    </h2>
                    <ul className="space-y-2">
                      {section.details.map((detail, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-gray-600">
                          <span className="text-orange-400 mt-1">•</span>
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Contact and Rights */}
        <div className="grid md:grid-cols-2 gap-4 mt-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="p-6 bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl border border-orange-100"
          >
            <Mail className="h-6 w-6 text-orange-600 mb-3" />
            <h3 className="font-semibold text-gray-800 mb-2">Liên hệ bảo mật</h3>
            <p className="text-sm text-gray-600 mb-3">
              Nếu bạn có thắc mắc về chính sách bảo mật, vui lòng liên hệ:
            </p>
            <div className="space-y-1 text-sm">
              <p className="text-orange-600">📧 privacy@chatify.com</p>
              <p className="text-orange-600">📞 1900 1234</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            className="p-6 bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl border border-orange-100"
          >
            <Trash2 className="h-6 w-6 text-orange-600 mb-3" />
            <h3 className="font-semibold text-gray-800 mb-2">Xóa dữ liệu</h3>
            <p className="text-sm text-gray-600 mb-3">
              Bạn có quyền yêu cầu xóa dữ liệu cá nhân bất kỳ lúc nào
            </p>
            <Button variant="outline" className="border-orange-200 text-orange-600 hover:bg-orange-50">
              Yêu cầu xóa dữ liệu
            </Button>
          </motion.div>
        </div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-8 text-center text-sm text-gray-500"
        >
          <Globe className="h-4 w-4 inline mr-1" />
          Chính sách này áp dụng cho tất cả dịch vụ của Chatify
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;