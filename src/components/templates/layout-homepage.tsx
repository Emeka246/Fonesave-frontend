import { Outlet } from 'react-router-dom';
import {SiteFooter} from '@/components/common/site/site-footer';
import {SiteHeader} from '@/components/common/site/site-header';
import ScrollToTop from '@/components/common/scroll-to-top';

export default function LayoutHomepage() {
  return (
    <div className="min-h-screen">
      <ScrollToTop />
      <SiteHeader />
      <Outlet />
      <SiteFooter />
    </div>
  );
}
