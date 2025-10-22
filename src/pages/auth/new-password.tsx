import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { cn, handleKeyDown } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import * as authService from "@/services/auth.service";

export default function NewPasswordPage({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);
  const [isPasswordReset, setIsPasswordReset] = useState(false);

  // Password validation
  const passwordRequirements = {
    minLength: formData.password.length >= 8,
    hasUppercase: /[A-Z]/.test(formData.password),
    hasLowercase: /[a-z]/.test(formData.password),
    hasNumber: /\d/.test(formData.password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password),
  };

  const isPasswordValid = Object.values(passwordRequirements).every(Boolean);
  const doPasswordsMatch = formData.password === formData.confirmPassword;

  // Verify token on component mount
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setIsTokenValid(false);
        return;
      }

      try {
        await authService.verifyResetToken(token);
        setIsTokenValid(true);
      } catch (error: any) {
        console.error("Token verification failed:", error);
        setIsTokenValid(false);
        toast.error("Invalid or expired reset token");
      }
    };

    verifyToken();
  }, [token]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (!token) {
      toast.error("No reset token provided");
      return;
    }

    if (!isPasswordValid) {
      toast.error("Please ensure your password meets all requirements");
      return;
    }

    if (!doPasswordsMatch) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      await authService.setNewPassword(token, formData.password);
    
      setIsPasswordReset(true);
      toast.success("Password reset successfully!");
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 3000);

    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || "Failed to reset password. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state while verifying token
  if (isTokenValid === null) {
    return (
      <div className={cn("flex flex-col gap-10", className)} {...props}>
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-sm text-muted-foreground">
            Verifying reset token...
          </p>
        </div>
      </div>
    );
  }

  // Show error if token is invalid
  if (isTokenValid === false) {
    return (
      <div className={cn("flex flex-col gap-10", className)} {...props}>
        <div className="flex flex-col items-start gap-2">
          <h1 className="text-2xl font-bold">Invalid Reset Link</h1>
          <p className="text-sm text-muted-foreground">
            This password reset link is invalid or has expired.
          </p>
        </div>
        
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            The password reset link you used is either invalid or has expired. 
            Please request a new password reset link.
          </AlertDescription>
        </Alert>

        <div className="flex flex-col gap-4">
          <Button asChild className="w-full">
            <Link to="/reset-password">Request New Reset Link</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link to="/login">Back to Login</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Show success message after password reset
  if (isPasswordReset) {
    return (
      <div className={cn("flex flex-col gap-10", className)} {...props}>
        <div className="flex flex-col items-start gap-2">
          <h1 className="text-2xl font-bold">Password Reset Successfully</h1>
          <p className="text-sm text-muted-foreground">
            Your password has been updated. You can now log in with your new password.
          </p>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="mb-4 rounded-full bg-green-100 p-3 text-green-600 mx-auto w-fit">
                <CheckCircle className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold mb-2">All Set!</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Your password has been successfully reset. You'll be redirected to the login page shortly.
              </p>
              <Button asChild className="w-full">
                <Link to="/login">Continue to Login</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main form for setting new password
  return (
    <div className={cn("flex flex-col gap-10", className)} {...props}>
      <div className="flex flex-col items-start gap-2">
        <h1 className="text-2xl font-bold">Set New Password</h1>
        <p className="text-sm text-muted-foreground">
          Please choose a strong password for your account
        </p>
      </div>

      <div className="grid gap-6">
        <form className="grid gap-6" onSubmit={handleFormSubmit}>
          {/* New Password Field */}
          <div className="grid gap-2">
            <Label htmlFor="password">New Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your new password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                className="pr-10"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                onClick={() => setShowPassword((prev) => !prev)}
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          {/* Password Requirements */}
          {formData.password && (
            <div className="grid gap-2">
              <p className="text-sm font-medium">Password Requirements:</p>
              <div className="text-xs space-y-1">
                <div className={`flex items-center gap-2 ${passwordRequirements.minLength ? 'text-green-600' : 'text-muted-foreground'}`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${passwordRequirements.minLength ? 'bg-green-600' : 'bg-muted-foreground'}`} />
                  At least 8 characters
                </div>
                <div className={`flex items-center gap-2 ${passwordRequirements.hasUppercase ? 'text-green-600' : 'text-muted-foreground'}`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${passwordRequirements.hasUppercase ? 'bg-green-600' : 'bg-muted-foreground'}`} />
                  One uppercase letter
                </div>
                <div className={`flex items-center gap-2 ${passwordRequirements.hasLowercase ? 'text-green-600' : 'text-muted-foreground'}`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${passwordRequirements.hasLowercase ? 'bg-green-600' : 'bg-muted-foreground'}`} />
                  One lowercase letter
                </div>
                <div className={`flex items-center gap-2 ${passwordRequirements.hasNumber ? 'text-green-600' : 'text-muted-foreground'}`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${passwordRequirements.hasNumber ? 'bg-green-600' : 'bg-muted-foreground'}`} />
                  One number
                </div>
                <div className={`flex items-center gap-2 ${passwordRequirements.hasSpecialChar ? 'text-green-600' : 'text-muted-foreground'}`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${passwordRequirements.hasSpecialChar ? 'bg-green-600' : 'bg-muted-foreground'}`} />
                  One special character
                </div>
              </div>
            </div>
          )}

          {/* Confirm Password Field */}
          <div className="grid gap-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your new password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="pr-10"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                tabIndex={-1}
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            {formData.confirmPassword && !doPasswordsMatch && (
              <p className="text-xs text-red-600">Passwords do not match</p>
            )}
            {formData.confirmPassword && doPasswordsMatch && (
              <p className="text-xs text-green-600">Passwords match</p>
            )}
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading || !isPasswordValid || !doPasswordsMatch}
          >
            {isLoading ? "Resetting Password..." : "Reset Password"}
          </Button>
        </form>

        <div className="text-center text-sm">
          <Link 
            to="/login" 
            className="text-muted-foreground hover:text-foreground underline-offset-4 hover:underline"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
