"use client";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import ROUTES from "@/routes/ROUTES_CONFIG";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { AppLogo } from "../../common/app/app-logo";
import { AlignJustify } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAuth } from "@/hooks/use-auth";

const navigationItems: { title: string; href: string; description: string }[] =
  [
    {
      title: "Home",
      href: "/",
      description: "Overview of our services",
    },
    {
      title: "Why Trust Us",
      href: "/why-trust-us",
      description: "Learn why millions trust FoneOwner for device verification",
    },
    {
      title: "About",
      href: "/about",
      description: "Learn more about our mission and technology",
    },
    {
      title: "Become an Agent",
      href: "/become-agent",
      description: "Join our network and start earning commissions",
    },
    {
      title: "Contact",
      href: "/contact",
      description: "Get help and access our documentation",
    },
  ];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const isMobile = useIsMobile();
  return (
    <header className="py-1 md:py-3 container">
      <div className="flex w-full items-center justify-between h-16">
        <div className="flex items-center space-x-24">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <AppLogo />
            </Link>
          </div>
          {/* Desktop Navigation */}
          {!isMobile && (
            <div className="hidden lg:block w-0 md:w-auto">
              <NavigationMenu>
                <NavigationMenuList>
                  {navigationItems.map((item) => (
                    <NavigationMenuItem key={item.title} value={item.href}>
                      <NavigationMenuLink
                        asChild
                        active={window.location.pathname === item.href}
                      >
                        <Link to={item.href} className="px-3 py-2">
                          {item.title}
                        </Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          )}
        </div>
        {/* Desktop Auth Buttons */}
        <div className="hidden lg:flex items-center space-x-4">
          <div className="flex items-center space-x-2 mr-7 pr-4">
            <ThemeToggle variant="ghost" />
          </div>

          {isAuthenticated ? (
            <Link to="/dashboard" onClick={() => setOpen(false)}>
              <Button className="font-medium rounded-full">My Account</Button>
            </Link>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" className="font-medium">
                  Login
                </Button>
              </Link>
              <Link to={ROUTES.NEW_REGISTRATION}>
                <Button className="rounded-full px-6 font-medium">
                  Register Your Phone
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Dropdown */}
        <div className="lg:hidden flex items-center">
          <div className="flex items-center mr-2">
            <ThemeToggle variant="ghost" />
          </div>
          <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost" aria-label="Toggle menu">
                <AlignJustify className="size-10" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-screen max-w-none left-0 right-0 px-4"
            >
              {/* Navigation Items */}
              {navigationItems.map((item) => (
                <DropdownMenuItem key={item.title} asChild>
                  <Link
                    to={item.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900 cursor-pointer"
                  >
                    <div className="flex-1">
                      <div className="text-sm font-medium">{item.title}</div>
                    </div>
                  </Link>
                </DropdownMenuItem>
              ))}
              {/* Auth Buttons */}
              {!isAuthenticated ? (
                <>
                  <DropdownMenuItem asChild>
                    <Link to={ROUTES.LOGIN} onClick={() => setOpen(false)}>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-gray-600 hover:text-gray-900"
                      >
                        Login
                      </Button>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      to={ROUTES.NEW_REGISTRATION}
                      onClick={() => setOpen(false)}
                    >
                      <Button className="w-full justify-start bg-teal-600 hover:bg-teal-700 text-white">
                        Register Your Phone
                      </Button>
                    </Link>
                  </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem asChild>
                  <Link to={ROUTES.DASHBOARD} onClick={() => setOpen(false)}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-gray-600 hover:text-gray-900"
                    >
                      Dashboard
                    </Button>
                  </Link>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
