import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import CountrySelect from "@/components/ui/country-select";
import { completeOnboarding, OnboardingData } from "@/services/auth.service";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { checkAuthStatus } from "@/store/slices/auth.slice";
// import { Info, AlertCircle } from "lucide-react";

export default function OnboardingPage({
  className,
}: React.ComponentProps<"div">) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const userId = searchParams.get("userId");

  const [isSubmitting, setIsSubmitting] = useState(false);
  // Get current user info if available
  const currentUser = useAppSelector((state) => state.auth.user);

  const [formData, setFormData] = useState<Omit<OnboardingData, "userId">>({
    fullName: currentUser?.fullName || "",
    phone: currentUser?.phone || "",
    role: (currentUser?.role as "USER" | "AGENT") || "USER",
    country: currentUser?.country || "",
  });

  // Check if we have the required query parameters
  useEffect(() => {
    console.log("Onboarding params received:", { userId, currentUser });

    // Check if we arrived here from email verification
    const fromVerification = sessionStorage.getItem("fromEmailVerification");

    // Check if email is verified - don't redirect if we just came from verification
    if (
      currentUser &&
      currentUser.isEmailVerified === false &&
      !fromVerification
    ) {
      console.log("Email not verified, redirecting to verification page");
      toast.error("Please verify your email before completing onboarding");
      navigate(`/verify-email?email=${currentUser.email}`);
      return;
    }

    // Clear the verification flag if it exists
    if (fromVerification) {
      sessionStorage.removeItem("fromEmailVerification");
    }

    // If we already have userId, use it
    if (userId) {
      return; // We have what we need, do nothing
    }

    // If we have a current user but no userId
    if (currentUser && currentUser.id) {
      console.log("Using current user for onboarding:", currentUser);

      // Only redirect if we're not already coming from a redirect
      // to prevent infinite loops
      const hasRedirected = sessionStorage.getItem("onboardingRedirected");
      if (!hasRedirected) {
        sessionStorage.setItem("onboardingRedirected", "true");
        navigate(`/onboarding?userId=${currentUser.id}`, { replace: true });
        return;
      }
    } else if (!userId) {
      // Neither userId nor current user available
      toast.error("Missing required parameters for onboarding");
      navigate("/login");
    }
  }, [userId, navigate, currentUser]);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleRoleChange = (role: "USER" | "AGENT") => {
    setFormData((prev) => ({ ...prev, role }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Use either the URL params or fall back to the current user ID
    const effectiveUserId = userId || currentUser?.id;

    if (!effectiveUserId) {
      toast.error("Unable to determine user identity for onboarding");
      return;
    }

    if (!formData.fullName || !formData.phone) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const onboardingData: OnboardingData = {
        userId: effectiveUserId as string,
        ...formData,
      };

      console.log("Submitting onboarding data:", onboardingData);
      const response = await completeOnboarding(onboardingData);

      if (response.data.success) {
        toast.success("Onboarding completed successfully!");

        // Clear redirection flag from session storage
        sessionStorage.removeItem("onboardingRedirected");

        // Update auth state and redirect to dashboard
        await dispatch(checkAuthStatus()).unwrap();

        // Welcome message based on role
        if (formData.role === "AGENT") {
          toast.info(
            "Welcome to the Agent Dashboard! You can now start registering devices for users."
          );
        } else {
          toast.info(
            "Welcome to FoneOwner! You can now register your devices."
          );
        }

        // Check for return URL after onboarding completion
        // Priority: returnUrlAfterOnboarding > returnUrlAfterVerification > returnUrl > dashboard
        const returnUrlAfterOnboarding = sessionStorage.getItem(
          "returnUrlAfterOnboarding"
        );
        const returnUrlAfterVerification = sessionStorage.getItem(
          "returnUrlAfterVerification"
        );
        const returnUrl = sessionStorage.getItem("returnUrl");

        // Clean up all return URL flags
        sessionStorage.removeItem("returnUrlAfterOnboarding");
        sessionStorage.removeItem("returnUrlAfterVerification");
        sessionStorage.removeItem("returnUrl");
        sessionStorage.removeItem("onboardingRedirected");

        const finalReturnUrl =
          returnUrlAfterOnboarding || returnUrlAfterVerification || returnUrl;

        if (finalReturnUrl) {
          navigate(finalReturnUrl, { replace: true });
        } else {
          navigate("/dashboard");
        }
      } else {
        toast.error(response.data.message || "Onboarding failed");
      }
    } catch (error: any) {
      console.error("Onboarding error:", error);
      toast.error(error.data?.message || "Onboarding failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("flex flex-col gap-7", className)}
    >
      <div className="flex flex-col items-start gap-2">
        <h1 className="text-3xl font-bold">Let’s Get You Started!</h1>
        <p className="text-muted-foreground text-sm">
          Please complete your profile to unlock all features and personalize
          your experience.
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            placeholder="John Doe"
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="+234 123 4567 890"
            required
          />
        </div>

        <CountrySelect
          value={formData.country}
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, country: value }))
          }
          placeholder="Select your country"
          required
        />

        <div className="grid gap-2">
          <Label>Account Type</Label>
          <RadioGroup
            value={formData.role}
            onValueChange={(value) =>
              handleRoleChange(value as "USER" | "AGENT")
            }
            className="grid grid-cols-2 gap-4 mt-2"
          >
            <label
              htmlFor="user-role"
              className={cn(
                "border rounded-lg p-3 cursor-pointer transition-all block",
                formData.role === "USER"
                  ? "border-primary bg-primary/5"
                  : "hover:bg-muted/30"
              )}
            >
              <div className="flex gap-3 items-start">
                <RadioGroupItem value="USER" id="user-role" className="mt-1" />
                <div className="grid gap-1.5">
                  <span className="font-medium text-sm">Regular User</span>
                  <p className="text-xs text-muted-foreground">
                    Register your own devices and manage them on the platform
                  </p>
                </div>
              </div>
            </label>

            <label
              htmlFor="agent-role"
              className={cn(
                "border rounded-lg p-3 cursor-pointer transition-all block",
                formData.role === "AGENT"
                  ? "border-primary bg-primary/5"
                  : "hover:bg-muted/30"
              )}
            >
              <div className="flex gap-3 items-start">
                <RadioGroupItem
                  value="AGENT"
                  id="agent-role"
                  className="mt-1"
                />
                <div className="grid gap-1.5">
                  <span className="text-sm font-medium">Agent</span>
                  <p className="text-xs text-muted-foreground">
                    Register devices on behalf of other users and earn
                    commission
                  </p>
                </div>
              </div>
            </label>
          </RadioGroup>
        </div>

        <Button
          type="submit"
          className="w-full mt-2"
          disabled={isSubmitting}
          loader={isSubmitting}
        >
          Complete Setup
        </Button>
      </div>
    </form>
  );
}
