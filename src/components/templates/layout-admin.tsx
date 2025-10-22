import { Outlet } from 'react-router-dom';

import { AdminSidebar } from "../common/admin/admin-sidebar"
import { AdminHeader } from "../common/admin/admin-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import ScrollToTop from '@/components/common/scroll-to-top';


export default function LayoutAdmin() {
  return (
    <SidebarProvider
     style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }>
      <ScrollToTop />
      <AdminSidebar variant="inset" />
      <SidebarInset>
        <AdminHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 md:gap-6 py-4 lg:py-6 px-4 md:px-14">
              <Outlet />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
