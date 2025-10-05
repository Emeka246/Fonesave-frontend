import { Button } from "@/components/ui/button";
import { IconGoogle } from "@/components/ui/custom-icons";
import { useConfig } from "@/hooks/use-config";
import { useLocation } from "react-router-dom";
export function GoogleLogin(){
    const config = useConfig();
    const location = useLocation();
    
    const googleLoginHandler = () => {
        // Store the current location so we can redirect back after OAuth
        const state = location.state as { from?: { pathname: string } } | null;
        const returnTo = state?.from?.pathname || location.pathname;
        
        // Store return path in session storage (survives page redirects)
        sessionStorage.setItem("oauthReturnPath", returnTo);
        
        console.log("Google login clicked", config.googleAuthUrl);
        window.location.href = config.googleAuthUrl || 'https://accounts.google.com/o/oauth2/auth';
    };
    return (
         <Button 
         onClick={googleLoginHandler}
         variant="outline" 
         className="w-full">
            <IconGoogle className="mr-2 size-5" />
            Continue with Google
        </Button>
    )
}