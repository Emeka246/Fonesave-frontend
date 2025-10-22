import {useState} from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IconLock } from "@tabler/icons-react";
import { Eye, EyeOff } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { changePassword, PasswordChangeData as PasswordChangeDataType } from "@/services/user.service";
import { toast } from "sonner";
export function CardSecurity(){

    const { user } = useAppSelector((state) => state.auth);
    const [passwordIsLoading, setPasswordIsLoading] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [userProfile, setUserProfile] = useState({
        email: user?.email || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    // Password validation
    const passwordRequirements = {
        minLength: userProfile.newPassword.length >= 8,
        hasUppercase: /[A-Z]/.test(userProfile.newPassword),
        hasLowercase: /[a-z]/.test(userProfile.newPassword),
        hasNumber: /\d/.test(userProfile.newPassword),
    };

    const isPasswordValid = Object.values(passwordRequirements).every(Boolean);
    const doPasswordsMatch = userProfile.newPassword === userProfile.confirmPassword;
    const isFormValid = userProfile.currentPassword && isPasswordValid && doPasswordsMatch;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUserProfile((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = async () => {
    // Form validation
    if (!userProfile.currentPassword) {
      toast.error("Please enter your current password");
      return;
    }

    if (userProfile.newPassword !== userProfile.confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    
    if (!isPasswordValid) {
      toast.error("Password does not meet requirements");
      return;
    }
    
    try {
      setPasswordIsLoading(true);
      const passwordData : PasswordChangeDataType = {
        currentPassword: userProfile.currentPassword,
        newPassword: userProfile.newPassword
      };
      
      const response = await changePassword(passwordData);
      toast.success(response.data.message || "Password updated successfully");
      
      // Reset password fields
      setUserProfile(prev => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      }));
      
      // If we get a success response, the server has cleared auth cookies,
      // so we should redirect to login page
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
      
    } catch (error: any) {
      console.error('Failed to change password:', error);
      toast.error(error.response?.data?.message || "Failed to change password");
    } finally {
      setPasswordIsLoading(false);
    }
  };

  const handleCancel = () => {
    setUserProfile(prev => ({
      ...prev,
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    }));
  };
  
  if (user?.oAuthProvider) {
    return null
  }

return (
<Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Update your password and secure your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <div className="relative">
                  <IconLock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="currentPassword"
                    name="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-8 pr-10"
                    value={userProfile.currentPassword}
                    onChange={handleChange}
                    disabled={passwordIsLoading}
                  />
                  <button
                    type="button"
                    className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowCurrentPassword((prev) => !prev)}
                    tabIndex={-1}
                    aria-label={showCurrentPassword ? "Hide password" : "Show password"}
                  >
                    {showCurrentPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>
              
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative">
                    <IconLock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-8 pr-10"
                      value={userProfile.newPassword}
                      onChange={handleChange}
                      disabled={passwordIsLoading}
                    />
                    <button
                      type="button"
                      className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowNewPassword((prev) => !prev)}
                      tabIndex={-1}
                      aria-label={showNewPassword ? "Hide password" : "Show password"}
                    >
                      {showNewPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <div className="relative">
                    <IconLock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-8 pr-10"
                      value={userProfile.confirmPassword}
                      onChange={handleChange}
                      disabled={passwordIsLoading}
                    />
                    <button
                      type="button"
                      className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      tabIndex={-1}
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                  {userProfile.confirmPassword && !doPasswordsMatch && (
                    <p className="text-xs text-red-600">Passwords do not match</p>
                  )}
                  {userProfile.confirmPassword && doPasswordsMatch && userProfile.newPassword && (
                    <p className="text-xs text-green-600">Passwords match</p>
                  )}
                </div>
              </div>
              
              {/* Password Requirements */}
              {userProfile.newPassword && (
                <div className="space-y-2">
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
                  </div>
                </div>
              )}
              
              <div className="text-sm text-muted-foreground">
                Password must contain at least 8 characters, including at least one uppercase letter, one lowercase letter, and one number.
              </div>
              <div className="flex justify-end space-x-2 mt-2">
                  <Button 
                    variant={"outline"} 
                    disabled={passwordIsLoading}
                    size="sm"
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                  
                  <Button 
                    onClick={handlePasswordChange}
                    size="sm"
                    disabled={passwordIsLoading || !isFormValid}
                  >
                    {passwordIsLoading ? "Saving..." : "Save"}
                  </Button>
                  </div>
              
            </CardContent>
          </Card>
)}