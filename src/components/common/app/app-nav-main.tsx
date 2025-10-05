import { IconCirclePlusFilled, IconShieldX, IconSearch, type Icon } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Link, useLocation } from "react-router-dom"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: Icon
  }[]
}) {
  const location = useLocation()
  
  const isActive = (url: string) => {
    if (url === "/dashboard" && location.pathname === "/dashboard") return true
    if (url !== "/dashboard" && location.pathname === url) return true
    return false
  }

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <Button
              size="sm"
              className="w-full flex-1"
              variant="outline"
              asChild
            >
              <Link to="/dashboard/new-registration">
                <IconCirclePlusFilled />
                <span>Register New Device</span>
              </Link>
            </Button>
           
          </SidebarMenuItem>
          <SidebarMenuItem className="flex items-center gap-2">
            <Button
              size="sm"
              className="w-full flex-1 border-blue-200 text-blue-700 hover:bg-blue-50"
              variant="outline"
              asChild
            >
              <Link to="/dashboard/check-imei">
                <IconSearch />
                <span>Check IMEI</span>
              </Link>
            </Button>
           
          </SidebarMenuItem>
          <SidebarMenuItem className="flex items-center gap-2">
            <Button
              size="sm"
              className="w-full flex-1 border-red-200 text-red-700 hover:bg-red-50"
              variant="outline"
              asChild
            >
              <Link to="/dashboard/report-theft">
                <IconShieldX />
                <span>Report Theft</span>
              </Link>
            </Button>
           
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton 
                tooltip={item.title} 
                asChild 
                isActive={isActive(item.url)}
              >
                <Link to={item.url}>
                {item.icon && <item.icon />}
                <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
