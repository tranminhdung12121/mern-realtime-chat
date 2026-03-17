import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import { UserPlus } from "lucide-react";
import type { SearchUser } from "@/types/user";
import { useFriendStore } from "@/stores/useFriendStore";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import SearchForm from "@/components/addFriendModal/SearchForm";
import SendFriendRequestForm from "@/components/addFriendModal/SendFriendRequestForm";
import { Button } from "../../ui/button";

export interface IFormValues {
  phone: string;
  message: string;
}

const AddFriendModal = () => {
  const [isFound, setIsFound] = useState<boolean | null>(null);
  const [searchUser, setSearchUser] = useState<SearchUser | null>(null);
  const [searchedPhone, setSearchedPhone] = useState("");

  const { loading, searchUserByPhone, addFriend } = useFriendStore();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<IFormValues>({
    defaultValues: {
      phone: "",
      message: "",
    },
  });

  const phoneValue = watch("phone");

  const handleSearch = handleSubmit(async (data) => {
    const phone = data.phone.trim();
    if (!phone) return;

    setIsFound(null);
    setSearchedPhone(phone);

    try {
      const foundUser = await searchUserByPhone(phone);

      if (foundUser) {
        setIsFound(true);
        setSearchUser(foundUser);
      } else {
        setIsFound(false);
      }
    } catch (error) {
      console.error(error);
      setIsFound(false);
    }
  });

  const handleSend = handleSubmit(async (data) => {
    if (!searchUser) return;

    try {
      const message = await addFriend(searchUser._id, data.message.trim());

      toast.success(message);

      handleCancel();
    } catch (error) {
      console.error(error);
    }
  });

  const handleCancel = () => {
    reset();
    setIsFound(null);
    setSearchUser(null);
    setSearchedPhone("");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="rounded-full">
          <UserPlus className="size-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle>Kết bạn</DialogTitle>
        </DialogHeader>

        {!isFound && (
          <SearchForm
            register={register}
            errors={errors}
            phoneValue={phoneValue}
            loading={loading}
            isFound={isFound}
            searchedPhone={searchedPhone}
            onSubmit={handleSearch}
            onCancel={handleCancel}
          />
        )}

        {isFound && searchUser && (
          <SendFriendRequestForm
            register={register}
            loading={loading}
            user={searchUser}
            onSubmit={handleSend}
            onBack={() => setIsFound(null)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddFriendModal;
