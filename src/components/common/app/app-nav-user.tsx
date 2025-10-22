import {
  IconCreditCard,
  IconDotsVertical,
  IconLogout,
  IconUserCircle,
} from "@tabler/icons-react"
import { Link } from "react-router-dom"

import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { logout } from "@/store/slices/auth.slice"

export function AppNavUser(props: { hideEmail?: boolean, buttonVariant?: "default" | "ghost" }) {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)
  const logoutHandler = async (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault()
    console.log("Logout clicked")
    try {
      const response = await dispatch(logout()).unwrap()
      console.log(response)
      window.location.href = '/login' // Redirect to login page after logout
      // Optionally redirect to login or home page after logout
      
    } catch (error) {
      console.error("Logout failed:", error)
      // Handle error if needed
      window.location.href = '/login' // Redirect to login page on error
    }
  }

  const userAvatarname = user?.fullName
    ? (() => {
        const names = user.fullName.trim().split(" ");
        if (names.length > 1) {
          return (
            names[0].charAt(0).toUpperCase() +
            names[names.length - 1].charAt(0).toUpperCase()
          );
        }
        return names[0].substring(0, 2).toUpperCase();
      })()
    : user?.email
      ? user.email.substring(0, 2).toUpperCase()
      : "ME"

  return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="lg"
              variant={props.buttonVariant || "ghost"}
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg grayscale">
                
                <AvatarFallback className="rounded-full">
                  {userAvatarname}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  <span className="md:inline hidden">{user?.fullName}</span>
                  <span className="md:hidden text-xs">
                    {user?.fullName?.split(" ")[0]}
                  </span>
                </span>
                {
                  !props.hideEmail && 
                  <span className="text-muted-foreground truncate text-xs">
                    {user?.email}
                  </span>
                }
              </div>
              <IconDotsVertical className="ml-auto size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side="bottom"
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarFallback className="rounded-full">
                    {userAvatarname}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {user?.fullName}
                  </span>
                  <span className="text-muted-foreground truncate text-xs">
                    {user?.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link to="/profile">
                  <IconUserCircle className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/billing">
                  <IconCreditCard className="mr-2 h-4 w-4" />
                  Billing
                </Link>
              </DropdownMenuItem>

            </DropdownMenuGroup>
            <DropdownMenuSeparator />
           <DropdownMenuItem 
              onClick={logoutHandler}
               className="cursor-pointer text-destructive focus:text-destructive"
              >
              <IconLogout className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
  )
}
