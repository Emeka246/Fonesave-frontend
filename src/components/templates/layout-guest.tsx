import { LogOut, Quote } from "lucide-react";
import { AppLogo } from "../common/app/app-logo";
import { Outlet, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/slices/auth.slice";
import { AuthenticatedOnly } from "../common/auth/auth-guard";
import { useNavigate } from "react-router-dom";
import ROUTES from "@/routes/ROUTES_CONFIG";
import ScrollToTop from "@/components/common/scroll-to-top";

export function AnimatedMessages() {
  const messages = [
    "assets in simple way.",
    "track expenses effortlessly.",
    "financial goals effectively.",
    "organized and in control.",
  ];
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const typingSpeed = isDeleting ? 50 : 100;
    const fullText = messages[currentMessageIndex];

    if (!isDeleting && displayedText === fullText) {
      setTimeout(() => setIsDeleting(true), 1000); // Pause before deleting
    } else if (isDeleting && displayedText === "") {
      setIsDeleting(false);
      setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
    } else {
      const nextText = isDeleting
        ? fullText.substring(0, displayedText.length - 1)
        : fullText.substring(0, displayedText.length + 1);
      setTimeout(() => setDisplayedText(nextText), typingSpeed);
    }
  }, [displayedText, isDeleting, currentMessageIndex]);

  return (
    <span>
      We helps you manage {displayedText}
      <span className="ml-1 text-2xl text-black">|</span>
    </span>
  );
}

export default function LayoutApp() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const logoutHandler = async () => {
    try {
      await dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <ScrollToTop />
      <div className="flex flex-col gap-4 p-4 md:p-7">
        <div className="flex gap-2 justify-between items-center">
          <Link
            to={ROUTES.HOME}
            className="flex items-center gap-2 self-center font-medium"
          >
            <AppLogo className="h-8 w-auto" />
          </Link>
          <AuthenticatedOnly requireEmailVerification={false}>
            <Button
              onClick={logoutHandler}
              size="sm"
              className="lg:inline-flex"
            >
              Log out
              <LogOut />
            </Button>
          </AuthenticatedOnly>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm">
            <Outlet />
          </div>
        </div>
        <p className="text-xs text-muted-foreground text-center mt-4 max-w-md mx-auto">
          By continuing, you agree to FoneOwner's{" "}
          <Link
            to={ROUTES.TERMS_CONDITIONS}
            className="underline text-black dark:text-white"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            to={ROUTES.PRIVACY_POLICY}
            className="underline text-black dark:text-white"
          >
            Privacy Policy
          </Link>
          , and to receive periodic emails with updates.
        </p>
      </div>
      <div className="bg-muted dark:bg-zinc-900 border-l-[1px] dark:border-zinc-700 relative hidden lg:block">
        <div className="flex items-center justify-center min-h-[calc(100%-0.75rem)] max-w-0 md:max-w-md lg:max-w-lg xl:max-w-xl mx-auto p-6">
          <div className="flex flex-col gap-2 z-10">
            <Quote className="w-16 h-16 text-zinc-300 dark:text-zinc-800 mb-4" />
            <p className="text-3xl text-zinc-800 dark:text-white font-medium">
              Our team is doing some awesome stuff #FoneOwner #facts #security
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
