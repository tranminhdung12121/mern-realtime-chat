// pages/TermsOfServicePage.tsx
import { motion } from "framer-motion";
import { 
  Shield, 
  FileText, 
  Scale, 
  Lock, 
  Users, 
  AlertCircle,
  CheckCircle,
  ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { Badge } from "@/components/ui/badge";

const TermsOfServicePage = () => {
  const navigate = useNavigate();

  const sections = [
    {
      icon: <Users className="h-5 w-5" />,
      title: "1. Điều khoản sử dụng",
      content: "Bằng việc sử dụng Chatify, bạn đồng ý tuân thủ tất cả các điều khoản được quy định trong tài liệu này. Nếu không đồng ý, vui lòng ngừng sử dụng dịch vụ."
    },
    {
      icon: <Scale className="h-5 w-5" />,
      title: "2. Quyền và nghĩa vụ của người dùng",
      content: "Bạn có quyền sử dụng dịch vụ Chatify cho mục đích cá nhân, phi thương mại. Bạn chịu trách nhiệm về mọi nội dung mình đăng tải và tương tác trên nền tảng."
    },
    {
      icon: <Lock className="h-5 w-5" />,
      title: "3. Bảo mật tài khoản",
      content: "Bạn có trách nhiệm bảo vệ thông tin đăng nhập của mình. Mọi hoạt động từ tài khoản của bạn sẽ được coi là do bạn thực hiện."
    },
    {
      icon: <AlertCircle className="h-5 w-5" />,
      title: "4. Nội dung bị cấm",
      content: "Không được phép đăng tải nội dung vi phạm pháp luật, xúc phạm người khác, spam, hoặc bất kỳ hành vi gây hại nào đến cộng đồng."
    },
    {
      icon: <Shield className="h-5 w-5" />,
      title: "5. Quyền sở hữu trí tuệ",
      content: "Tất cả nội dung, logo, thương hiệu trên Chatify thuộc quyền sở hữu của chúng tôi. Không được sao chép hoặc sử dụng khi chưa có sự cho phép."
    },
    {
      icon: <FileText className="h-5 w-5" />,
      title: "6. Thay đổi điều khoản",
      content: "Chúng tôi có quyền điều chỉnh điều khoản bất kỳ lúc nào. Việc tiếp tục sử dụng dịch vụ sau khi thay đổi đồng nghĩa với việc bạn chấp nhận điều khoản mới."
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
              <FileText className="h-8 w-8" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Điều khoản dịch vụ</h1>
            <p className="text-lg opacity-90 max-w-2xl mx-auto">
              Vui lòng đọc kỹ các điều khoản trước khi sử dụng dịch vụ của Chatify
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
                    <h2 className="text-xl font-semibold text-gray-800 mb-2 
                      group-hover:text-orange-600 transition-colors">
                      {section.title}
                    </h2>
                    <p className="text-gray-600 leading-relaxed">
                      {section.content}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Summary */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 p-6 bg-gradient-to-r from-orange-100 to-amber-100 rounded-2xl"
        >
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-gray-700">
                Bằng việc tiếp tục sử dụng Chatify, bạn xác nhận đã đọc, hiểu và đồng ý với 
                tất cả các điều khoản được nêu trên. Nếu có bất kỳ câu hỏi nào, vui lòng liên hệ 
                với chúng tôi qua email: <span className="font-medium text-orange-600">support@chatify.com</span>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsOfServicePage;