import { Bell, ChevronsUpDown, UserIcon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import type { User } from "@/types/user";
import Logout from "../auth/Logout";
import { useState } from "react";
import FriendRequestDialog from "../friendRequest/FriendRequestDialog";
import ProfileDialog from "../profile/ProfileDialog";

export function NavUser({ user }: { user: User }) {
  const { isMobile } = useSidebar();
  const [friendRequestOpen, setfriendRequestOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="transition-all duration-200 
                data-[state=open]:bg-primary/10 
                data-[state=open]:text-primary 
                hover:bg-primary/5"
              >
                {/* Avatar */}
                <div className="relative">
                  <Avatar className="h-9 w-9 rounded-xl">
                    <AvatarImage src={user.avatarUrl} alt={user.displayName} />
                    <AvatarFallback className="rounded-xl bg-primary text-white">
                      {user.displayName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>

                  {/* Online indicator */}
                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border border-background"></span>
                </div>

                {/* User info */}
                <div className="grid flex-1 text-left text-sm leading-tight ml-2">
                  <span className="truncate font-semibold">
                    {user.displayName}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    @{user.username}
                  </span>
                </div>

                <ChevronsUpDown className="ml-auto size-4 opacity-60" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 
              rounded-xl shadow-xl border bg-popover/95 backdrop-blur"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={6}
            >
              {/* User preview */}
              <DropdownMenuLabel className="p-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 rounded-xl">
                    <AvatarImage src={user.avatarUrl} />
                    <AvatarFallback className="rounded-xl bg-primary text-white">
                      {user.displayName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex flex-col">
                    <span className="font-semibold">{user.displayName}</span>
                    <span className="text-xs text-muted-foreground">
                      @{user.username}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={() => setProfileOpen(true)}
                  className="cursor-pointer gap-2 hover:bg-[#f55718]/10"
                >
                  <UserIcon className="size-4 text-primary" />
                  Tài Khoản
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => setfriendRequestOpen(true)}
                  className="cursor-pointer gap-2 hover:bg-[#f55718]/10"
                >
                  <Bell className="size-4 text-primary" />
                  Thông Báo
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                className="cursor-pointer text-red-500 focus:text-red-500"
              >
                <Logout />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      <FriendRequestDialog
        open={friendRequestOpen}
        setOpen={setfriendRequestOpen}
      />

      <ProfileDialog open={profileOpen} setOpen={setProfileOpen} />
    </>
  );
}
