import {useEffect} from "react"
import { useLocation } from "react-router-dom"
import { Link } from "react-router-dom"
import {
  IconDashboard,
  IconTable,
  IconCreditCard,
  IconUsers,
} from "@tabler/icons-react"
import { AdminNavMain } from "./admin-nav-main"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  useSidebar
} from "@/components/ui/sidebar"
import { AppLogo } from "../app/app-logo"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/admin/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Device Management",
      url: "/admin/devices",
      icon: IconTable,
    },
    {
      title: "Payment Management",
      url: "/admin/payments",
      icon: IconCreditCard,
    },
    {
      title: "User Management",
      url: "/admin/users",
      icon: IconUsers,
    },
  ],
}

export function AdminSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
   const { setOpenMobile } = useSidebar()
  const location = useLocation()

  // Close sidebar when route changes (mobile only)
  useEffect(() => {
    setOpenMobile(false)
  }, [location.pathname, setOpenMobile])
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem> 
              <Link to="/admin/dashboard">
                <AppLogo className="w-auto h-8" />
              </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
          <AdminNavMain items={data.navMain} />
      </SidebarContent>
    </Sidebar>
  )
}
