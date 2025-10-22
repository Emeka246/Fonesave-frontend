import * as React from "react"
import { Separator } from "@/components/ui/separator"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { useLocation } from "react-router-dom"
import { AppNavUser } from "@/components/common/app/app-nav-user"
import { Link } from "react-router-dom"
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from "@/components/ui/breadcrumb"
import { SidebarTrigger } from "@/components/ui/sidebar"


const getPageTitle = (pathname: string): string => {
  switch (pathname) {
    case "/dashboard":
      return "Dashboard"
    case "/dashboard/new-registration":
      return "Register New Device"
    case "/table":
      return "IMEI List"
    case "/tables/sessions":
      return "Sessions"
    case "/tables/customers":
      return "Customers"
    case "/tables/analytics":
      return "Analytics"
    case "/profile":
      return "Profile"
    case "/billing":
      return "Billing"
    default:
      return "Dashboard"
  }
}

const getBreadcrumbs = (pathname: string) => {
  if (pathname === "/dashboard") {
    return [{ title: "Dashboard", href: "/dashboard", isActive: true }]
  }
  
  if (pathname === "/dashboard/new-registration") {
    return [
      { title: "Dashboard", href: "/dashboard", isActive: false },
      { title: "Register New Device", href: "/dashboard/new-registration", isActive: true }
    ]
  }
  
  if (pathname === "/table") {
    return [
      { title: "Dashboard", href: "/dashboard", isActive: false },
      { title: "IMEI List", href: "/table", isActive: true }
    ]
  }
  
  if (pathname === "/profile") {
    return [
      { title: "Dashboard", href: "/dashboard", isActive: false },
      { title: "Profile", href: "/profile", isActive: true }
    ]
  }
  
  if (pathname === "/billing") {
    return [
      { title: "Dashboard", href: "/dashboard", isActive: false },
      { title: "Billing", href: "/billing", isActive: true }
    ]
  }
  
  // Removed preferences section
  
  if (pathname.startsWith("/tables/")) {
    const pageTitle = getPageTitle(pathname)
    return [
      { title: "Dashboard", href: "/dashboard", isActive: false },
      { title: "Tables", href: "#", isActive: false },
      { title: pageTitle, href: pathname, isActive: true }
    ]
  }
  
  return [{ title: "Dashboard", href: "/dashboard", isActive: true }]
}

export function AdminHeader() {
  const location = useLocation()
  const breadcrumbs = getBreadcrumbs(location.pathname)
  
  return (
    <header className="flex h-[--header-height] shrink-0 items-center gap-2 border-b">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6 py-2">
      <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((crumb, index) => (
  <React.Fragment key={crumb.href}>
    {index > 0 && <BreadcrumbSeparator />}
    <BreadcrumbItem>
      {crumb.isActive ? (
        <BreadcrumbPage className="text-sm md:text-base font-medium">{crumb.title}</BreadcrumbPage>
      ) : (
        <BreadcrumbLink asChild className="text-sm md:text-base font-medium">
          <Link to={crumb.href}>{crumb.title}</Link>
        </BreadcrumbLink>
      )}
    </BreadcrumbItem>
  </React.Fragment>
))}
          </BreadcrumbList>
        </Breadcrumb>
        <div className="ml-auto flex items-center gap-1 md:gap-4">
          <ThemeToggle variant="ghost" />
          <Separator
          orientation="vertical"
          className="data-[orientation=vertical]:h-4"
        />
          <AppNavUser hideEmail={true} />
        </div>
      </div>
    </header>
  )
}
