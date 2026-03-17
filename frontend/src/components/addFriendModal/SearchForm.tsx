import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { IFormValues } from "../chat/sidebarDirect/AddFriendModal";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { DialogFooter } from "../ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import { Button } from "../ui/button";
import { Search } from "lucide-react";

interface SearchFormProps {
  register: UseFormRegister<IFormValues>;
  errors: FieldErrors<IFormValues>;
  loading: boolean;
  phoneValue: string;
  isFound: boolean | null;
  searchedPhone: string;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
}

const SearchForm = ({
  register,
  errors,
  phoneValue,
  loading,
  isFound,
  searchedPhone,
  onSubmit,
  onCancel,
}: SearchFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="phone" className="text-sm font-semibold">
          Tìm bằng số điện thoại
        </Label>

        <Input
          id="phone"
          placeholder="Nhập số điện thoại..."
          {...register("phone", {
            required: "Số điện thoại không được bỏ trống",
          })}
        />

        {errors.phone && (
          <p className="text-sm text-red-500">{errors.phone.message}</p>
        )}

        {isFound === false && (
          <span className="text-sm text-red-500">
            Không tìm thấy{" "}
            <span className="font-semibold">{searchedPhone}</span>
          </span>
        )}
      </div>

      <DialogFooter>
        <DialogClose asChild>
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={onCancel}
          >
            Hủy
          </Button>
        </DialogClose>

        <Button
          type="submit"
          disabled={loading || !phoneValue?.trim()}
          className="flex-1"
        >
          {loading ? (
            <span>Đang tìm...</span>
          ) : (
            <>
              <Search className="size-4 mr-2" />
              Tìm
            </>
          )}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default SearchForm;
