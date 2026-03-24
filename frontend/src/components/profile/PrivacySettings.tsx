"use client";

import {
  Shield,
  Bell,
  ShieldBan,
  Key,
  Eye,
  Lock,
  AlertTriangle,
  Globe,
  Mail,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import ChangePasswordDialog from "../auth/ChangePasswordDialog";
import ChangeEmailDialog from "../auth/ChangeEmailDialog";

const PrivacySettings = () => {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [activityVisible, setActivityVisible] = useState(true);

  // ✅ STATE DIALOG
  const [openPassword, setOpenPassword] = useState(false);
  const [openEmail, setOpenEmail] = useState(false);

  const settingsGroups = [
    {
      title: "Bảo mật tài khoản",
      icon: <Lock className="h-5 w-5 text-primary" />,
      items: [
        {
          icon: <Key className="h-4 w-4" />,
          label: "Đổi mật khẩu",
          description: "Cập nhật mật khẩu định kỳ để bảo vệ tài khoản",
          action: () => setOpenPassword(true),
        },
        {
          icon: <Mail className="h-4 w-4" />,
          label: "Cập nhật email",
          description: "Thay đổi địa chỉ email của bạn",
          action: () => setOpenEmail(true),
        },
        {
          icon: <Shield className="h-4 w-4" />,
          label: "Xác thực hai yếu tố",
          description: "Tăng cường bảo mật với xác thực 2 lớp",
          badge: "2 cảnh báo",
          toggle: true,
          value: twoFactorEnabled,
          onToggle: setTwoFactorEnabled,
        },
      ],
    },
    {
      title: "Quyền riêng tư",
      icon: <Eye className="h-5 w-5 text-primary" />,
      items: [
        {
          icon: <Bell className="h-4 w-4" />,
          label: "Thông báo",
          description: "Tùy chỉnh thông báo bạn nhận được",
          badge: "9 thông báo",
          action: () => {},
        },
        {
          icon: <Globe className="h-4 w-4" />,
          label: "Hiển thị hoạt động",
          description: "Cho phép người khác xem trạng thái online của bạn",
          toggle: true,
          value: activityVisible,
          onToggle: setActivityVisible,
        },
        {
          icon: <ShieldBan className="h-4 w-4" />,
          label: "Chặn & Báo cáo",
          description: "Quản lý danh sách chặn và báo cáo vi phạm",
          badge: "2 người dùng",
          action: () => {},
        },
      ],
    },
  ];

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="relative overflow-hidden border-border bg-background shadow-xl">
          {/* Decorative blur */}
          <div className="absolute top-0 right-0 w-60 h-60 bg-primary/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none"></div>

          <CardHeader className="border-b border-border">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <div className="p-2 rounded-lg bg-primary text-primary-foreground">
                    <Shield className="h-5 w-5" />
                  </div>
                  Quyền riêng tư & Bảo mật
                </CardTitle>

                <CardDescription>
                  Quản lý cài đặt quyền riêng tư và bảo mật của bạn
                </CardDescription>
              </div>

              <Badge variant="secondary">
                <Shield className="h-3 w-3 mr-1" />
                Bảo mật cao
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-8">
            {settingsGroups.map((group, groupIndex) => (
              <motion.div
                key={group.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: groupIndex * 0.1 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-2">
                  {group.icon}
                  <h3 className="font-semibold text-foreground">
                    {group.title}
                  </h3>
                  <Separator className="flex-1" />
                </div>

                <div className="grid gap-3">
                  {group.items.map((item, itemIndex) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: itemIndex * 0.05 }}
                    >
                      <div
                        className="group flex items-center justify-between p-4 rounded-lg
                        border border-border bg-muted/40 hover:bg-muted
                        transition-all duration-200 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!item.toggle) item.action?.();
                        }}
                      >
                        <div className="flex items-start gap-3 flex-1">
                          <div className="p-2 rounded-md bg-primary/10 text-primary">
                            {item.icon}
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-foreground">
                                {item.label}
                              </p>

                              {item.badge && (
                                <Badge variant="secondary" className="text-xs">
                                  {item.badge}
                                </Badge>
                              )}
                            </div>

                            <p className="text-sm text-muted-foreground">
                              {item.description}
                            </p>
                          </div>
                        </div>

                        {item.toggle ? (
                          <Switch
                            checked={item.value}
                            onCheckedChange={item.onToggle}
                          />
                        ) : (
                          <div className="text-muted-foreground group-hover:text-foreground transition">
                            →
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}

            {/* Security tips */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="p-4 rounded-lg border border-border bg-muted"
            >
              <div className="flex items-start gap-3">
                <Shield className="h-4 w-4 text-primary" />

                <div className="text-sm text-muted-foreground space-y-1">
                  <p className="font-medium text-foreground">Mẹo bảo mật</p>
                  <p>• Sử dụng mật khẩu mạnh với ít nhất 8 ký tự</p>
                  <p>• Bật xác thực hai yếu tố</p>
                  <p>• Đăng xuất khỏi thiết bị lạ</p>
                </div>
              </div>
            </motion.div>
          </CardContent>

          <CardFooter className="border-t border-border p-6">
            <div className="w-full space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <h4 className="font-medium">Khu vực nguy hiểm</h4>
                </div>

                <Badge variant="destructive">Cẩn thận</Badge>
              </div>

              <p className="text-xs text-muted-foreground">
                Các hành động sau không thể hoàn tác.
              </p>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="border-destructive/40 hover:bg-destructive/10"
                >
                  <ShieldBan className="h-4 w-4 mr-2" />
                  Vô hiệu hóa
                </Button>

                <Button variant="destructive">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Xoá tài khoản
                </Button>
              </div>

              <p className="text-[10px] text-center text-muted-foreground">
                Tài khoản sẽ bị xoá vĩnh viễn sau 30 ngày
              </p>
            </div>
          </CardFooter>
        </Card>
      </motion.div>

      {/* ✅ DIALOG */}
      <ChangePasswordDialog
        open={openPassword}
        onOpenChange={setOpenPassword}
      />

      <ChangeEmailDialog open={openEmail} onOpenChange={setOpenEmail} />
    </>
  );
};

export default PrivacySettings;
