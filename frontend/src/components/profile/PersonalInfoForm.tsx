import { Heart } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import type { User } from "@/types/user";
import { useUserStore } from "@/stores/useUserStore";

import { z } from "zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const updateSchema = z.object({
  displayName: z.string().min(2, "Tên hiển thị tối thiểu 2 ký tự"),
  phone: z.string().min(9, "Số điện thoại không hợp lệ"),
  bio: z.string().max(300, "Giới thiệu tối đa 300 ký tự").optional(),
});

type UpdateFormValues = z.infer<typeof updateSchema>;

type Props = {
  userInfo: User | null;
};

const PersonalInfoForm = ({ userInfo }: Props) => {
  const { updateInforMe } = useUserStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UpdateFormValues>({
    resolver: zodResolver(updateSchema),
  });

  useEffect(() => {
    if (userInfo) {
      reset({
        displayName: userInfo.displayName || "",
        phone: userInfo.phone || "",
        bio: userInfo.bio || "",
      });
    }
  }, [userInfo, reset]);

  const onSubmit = async (data: UpdateFormValues) => {
    await updateInforMe(
      data.displayName,
      data.phone,
      data.bio ?? ""
    );
  };

  if (!userInfo) return null;

  return (
    <Card className="glass-strong border-border/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="size-5 text-primary" />
          Thông tin cá nhân
        </CardTitle>

        <CardDescription>
          Cập nhật chi tiết cá nhân và thông tin hồ sơ của bạn
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          className="space-y-5"
          onSubmit={handleSubmit(onSubmit)}
        >

          {/* display name + phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div className="space-y-2">
              <Label htmlFor="displayName">
                Tên hiển thị
              </Label>

              <Input
                id="displayName"
                type="text"
                className="glass-light border-border/30"
                {...register("displayName")}
              />

              {errors.displayName && (
                <p className="text-sm text-red-500">
                  {errors.displayName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">
                Số điện thoại
              </Label>

              <Input
                id="phone"
                type="text"
                className="glass-light border-border/30"
                {...register("phone")}
              />

              {errors.phone && (
                <p className="text-sm text-red-500">
                  {errors.phone.message}
                </p>
              )}
            </div>

          </div>

          {/* email */}
          <div className="space-y-2">
            <Label>Email</Label>

            <Input
              value={userInfo.email}
              disabled
              className="glass-light border-border/30 opacity-70"
            />
          </div>

          {/* bio */}
          <div className="space-y-2">
            <Label htmlFor="bio">
              Giới thiệu
            </Label>

            <Textarea
              id="bio"
              rows={3}
              {...register("bio")}
              className="glass-light border-border/30 resize-none"
            />

            {errors.bio && (
              <p className="text-sm text-red-500">
                {errors.bio.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full md:w-auto bg-gradient-primary hover:opacity-90 transition-opacity"
          >
            {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>

        </form>
      </CardContent>
    </Card>
  );
};

export default PersonalInfoForm;
