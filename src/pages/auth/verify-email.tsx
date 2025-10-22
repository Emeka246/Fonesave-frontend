import { useSearchParams, useNavigate } from "react-router-dom"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useState, useEffect, useRef } from "react"
import { toast } from "sonner"
import { verifyEmail, resendVerificationEmail } from "@/services/auth.service"
import { checkAuthStatus } from "@/store/slices/auth.slice"
import { useAppDispatch } from "@/store/hooks"

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
  
export function InputOTPComponent({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <InputOTP maxLength={6} value={value} onChange={onChange}>
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </InputOTP>
  )
}


export default function VerifyEmailPage({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch()
  const email = searchParams.get('email') || "your email";
  const [verificationCode, setVerificationCode] = useState(""); // Used for OTP input
  const [isSubmitting, setIsSubmitting] = useState(false); // Tracks form submission state
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Function to start the countdown timer
  const startCountdown = (seconds: number) => {
    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    setResendDisabled(true);
    setCountdown(seconds);
   
    
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          setResendDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };
  
  // Start countdown when component mounts
  useEffect(() => {
    // Optional: Start with a countdown (remove if you don't want initial countdown)
    startCountdown(5);
    
    // Cleanup timer on component unmount
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (verificationCode.length !== 6) {
      toast.error("Please enter the complete 6-digit verification code");
      return;
    }

    setIsSubmitting(true)
    try {
      const response = await verifyEmail(verificationCode)
      console.log("Verification response:", response.data);
      if (response.data.success) {
        toast.success("Email verified successfully!");
      
        // Get user ID from response
        const responseData: any = response.data;
        const userId = responseData.userId;
        
        if (!userId) {
          throw new Error("User ID not found in verification response");
        }
        
        // Update auth state to get latest user data
        const userData = await dispatch(checkAuthStatus()).unwrap();
        console.log("Updated user data after verification:", userData);
        
        // Check if the user has completed their profile
        const needsOnboarding = !userData.fullName || !userData.phone || !userData.role;
        
        if (needsOnboarding) {
          console.log("User profile incomplete, redirecting to onboarding");
          // Set a session flag to indicate we're coming from email verification
          sessionStorage.setItem('fromEmailVerification', 'true');
          
          // Preserve returnUrl for after onboarding completion
          const returnUrl = sessionStorage.getItem('returnUrl');
          if (returnUrl) {
            sessionStorage.setItem('returnUrlAfterOnboarding', returnUrl);
          }
          
          toast.info("Please complete your profile to continue");
          navigate(`/onboarding?userId=${userId}`);
        } else {
          console.log("User profile complete, checking for return URL");
          // Check for return URL after email verification
          const returnUrlAfterVerification = sessionStorage.getItem('returnUrlAfterVerification');
          const returnUrl = sessionStorage.getItem('returnUrl');
          
          // Clean up return URL flags
          sessionStorage.removeItem('returnUrlAfterVerification');
          sessionStorage.removeItem('returnUrl');
          
          const finalReturnUrl = returnUrlAfterVerification || returnUrl;
          
          if (finalReturnUrl) {
            navigate(finalReturnUrl, { replace: true });
          } else {
            navigate('/dashboard');
          }
        }
      } else {
        toast.error(response.data.message || "Verification failed");
      }
    } catch (error: any) {
      console.error("Verification error:", error);
      toast.error(error.data?.message || "Verification failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (!email || email === "your email") {
      toast.error("Email address is required for resending verification code");
      return;
    }

    try {
      setResendDisabled(true);
      const response = await resendVerificationEmail(email);
      if (response.data.success) {
        toast.success("Verification code resent. Please check your email.");
        // Start countdown for resend button
        startCountdown(30);
      } else {
        toast.error(response.data.message || "Failed to resend verification code");
        setResendDisabled(false);
      }
    } catch (error: any) {
      console.error("Resend verification error:", error);
      toast.error(error.data?.message || "Failed to resend verification code");
      setResendDisabled(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className={cn("flex flex-col gap-10", className)} {...props}>
      <div className="flex flex-col items-start gap-1">
        <h1 className="text-2xl font-bold">Email Verification</h1>
        <p className="text-balance text-xs text-muted-foreground">
          Enter the verification code sent to <strong>{email}</strong>
        </p>
      </div>
          <div className="grid gap-6">
            <div className="grid gap-6">
              <div className="flex justify-center gap-2">
                <InputOTPComponent
                  value={verificationCode}
                  onChange={setVerificationCode}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                Submit Request
              </Button>
            </div>
            <div className="text-center text-sm">
              Didn’t receive the code?{" "}
                <button
                type="button"
                className="underline underline-offset-4"
                onClick={handleResend}
                disabled={resendDisabled}
                >
                Resend  {countdown > 0 ? `in (${countdown}s)` : ""}
                </button>
            </div>
          </div>
        </form>
  )
}
