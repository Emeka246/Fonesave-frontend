import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Simple scroll-to-top component that scrolls to the top
 * whenever the React Router path changes.
 */
export const ScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    // Scroll to top whenever the location changes
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, [location.pathname]);

  // This component doesn't render anything
  return null;
};

export default ScrollToTop;
