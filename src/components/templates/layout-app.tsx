import { Outlet, useLocation } from 'react-router-dom';

import { AppHeader } from "../common/app/app-header"
import { IconArrowLeft } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import ROUTES from '@/routes/ROUTES_CONFIG';
import { useAuth } from '@/hooks/use-auth';
import { Eye } from 'lucide-react';
import ScrollToTop from '@/components/common/scroll-to-top';



export default function LayoutApp() {
  const navigate = useNavigate();
  const { isAgent } = useAuth();
  const location = useLocation();
  return (
        <>
        <ScrollToTop />
        <AppHeader />
          <div className="container mt-4 md:mt-10 px-4 md:px-8 lg:px-12 xl:px-16">
            {
              location.pathname !== ROUTES.DASHBOARD &&  (
                <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate(ROUTES.DASHBOARD)}
                className="mb-7"
              >
                <IconArrowLeft className="h-4 w-4" />
                Back
              </Button>
              )}

              { location.pathname == ROUTES.NEW_REGISTRATION && isAgent() &&  (
                <Button 
                variant="blue" 
                size="sm" 
                onClick={() => navigate(ROUTES.BILLING)}
                className="mb-7 ml-2"
              >
                <Eye className="h-4 w-4" />
                 View Available Balance
              </Button>
              )}
            <div className="flex flex-col gap-4 md:gap-6">
              <Outlet />
            </div>
          </div>
        </>
  )
}
