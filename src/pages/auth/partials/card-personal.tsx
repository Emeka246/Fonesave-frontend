import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import CountrySelect from '@/components/ui/country-select';
import {  IconMail, IconLock, IconLoader2 } from '@tabler/icons-react';
import { Eye, EyeOff } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { Badge } from '@/components/ui/badge';
import {toast} from 'sonner';
import { requestEmailChange, EmailChangeRequestData as EmailChangeRequestDataType, updateProfile, UserProfileData } from "@/services/user.service";
import { unlinkSocialAccount } from "@/services/auth.service";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { checkAuthStatus } from '@/store/slices/auth.slice';

export function CardPersonal() {
    const {user} = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [userProfile, setUserProfile] = useState({
        fullName: user?.fullName || '',
        phone: user?.phone || '',
        country: user?.country || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setUserProfile((prev) => ({
        ...prev,
        [name]: value
        }));
    }

    const handleSave = async () => {
        if (isLoading) return;

        // Validation
        const trimmedFullName = userProfile.fullName.trim();
        if (!trimmedFullName) {
            toast.error("Full name is required");
            return;
        }

        // Phone validation (optional but if provided, should be valid format)
        const trimmedPhone = userProfile.phone.trim();
        if (trimmedPhone && !/^[\+]?[1-9][\d]{0,15}$/.test(trimmedPhone.replace(/\s|-/g, ''))) {
            toast.error("Please enter a valid phone number");
            return;
        }

        setIsLoading(true);

        try {
            const profileData: UserProfileData = {
                fullName: trimmedFullName,
                phone: trimmedPhone || undefined,
                country: userProfile.country || undefined,
            };

            const response = await updateProfile(profileData);
            
            if (response.data.success) {
                toast.success("Profile updated successfully");
                
                // Refresh user data in the store
                await dispatch(checkAuthStatus()).unwrap();
            } else {
                throw new Error(response.data.message || "Failed to update profile");
            }
        } catch (error: any) {
            console.error('Failed to update profile:', error);
            const errorMessage = error?.response?.data?.message || error?.message || "Failed to update profile";
            toast.error(errorMessage);
            
            // Reset form to original values on error
            setUserProfile({
                fullName: user?.fullName || '',
                phone: user?.phone || '',
                country: user?.country || '',
            });
        } finally {
            setIsLoading(false);
        }
    }

    const handleCancel = () => {
        setUserProfile({
            fullName: user?.fullName || '',
            phone: user?.phone || '',
            country: user?.country || ''
        });
    }

    const hasChanges = userProfile.fullName.trim() !== (user?.fullName || "").trim() || 
                      userProfile.phone.trim() !== (user?.phone || "").trim() ||
                      userProfile.country !== (user?.country || "");
    
    const isFormValid = userProfile.fullName.trim().length > 0;

    // Add keyboard shortcut for saving
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                if (hasChanges && isFormValid && !isLoading) {
                    handleSave();
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [hasChanges, isFormValid, isLoading]);

    return (
        <Card>
           <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Personal Information
                {isLoading && <IconLoader2 className="h-4 w-4 animate-spin" />}
                {hasChanges && !isLoading && (
                  <span className="text-xs font-medium bg-amber-100 text-amber-800 px-2 rounded-full">
                    Unsaved changes
                  </span>
                )}
              </CardTitle>
              <CardDescription>
                Update your personal details and email address.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="fullName">
                          Full Name <span className="text-red-500">*</span>
                        </Label>
                        <div className="relative">
                            <Input
                                id="fullName"
                                name="fullName"
                                placeholder="Enter your full name"
                                value={userProfile.fullName}
                                onChange={handleChange}
                                disabled={isLoading}
                                className={!userProfile.fullName.trim() ? "border-red-200 focus:border-red-300" : ""}
                            />
                        </div>
                        {!userProfile.fullName.trim() && (
                          <p className="text-xs text-red-600">Full name is required</p>
                        )}
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <div className="relative">
                            <Input
                                id="phone"
                                name="phone"
                                placeholder="+1 (555) 123-4567"
                                value={userProfile.phone}
                                onChange={handleChange}
                                disabled={isLoading}
                            />
                        </div> 
                    </div>
                </div>
                <div className="grid gap-6 md:grid-cols-1">
                    <CountrySelect
                        value={userProfile.country}
                        onValueChange={(value) => setUserProfile(prev => ({ ...prev, country: value }))}
                        placeholder="Select your country"
                        disabled={isLoading}
                    />
                </div>
                <div className="grid gap-6 md:grid-cols-1">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <div className="p-3 border rounded-md block space-y-4 sm:flex justify-between items-center">
                            <div className="flex items-center text-sm">
                                <IconMail className="mr-2 h-4 w-4 text-muted-foreground" />
                                <span>{user?.email}</span>
                                {user?.isEmailVerified && user?.oAuthProvider == null && (
                                <Badge variant="outline" className="ml-2 bg-green-100 text-green-800 border-green-200">
                                    Verified
                                </Badge>
                                )}
                                {user?.oAuthProvider == 'google' && (
                                <Badge variant="outline" className="ml-2 bg-blue-100 text-blue-800 border-blue-200">
                                    Linked with Google Account
                                </Badge>
                                )}
                            </div>
                            <div className="flex flex-col items-end">
                              {user?.oAuthProvider == null && (
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button size="sm">
                                            Change Email Address
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <EmailChangeDialog />
                                    </DialogContent>
                                </Dialog>
                              )}
                              {user?.oAuthProvider === 'google' && (
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button size="sm" variant="outline">
                                            Unlink Google Account
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <UnlinkOauthProvider />
                                    </DialogContent>
                                </Dialog>
                              )}
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex justify-end">
                      <div className="flex justify-end space-x-2 mt-2">
                        <Button 
                          variant="outline"
                          size="sm"
                          onClick={handleCancel}
                          disabled={!hasChanges || isLoading}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleSave}
                          size="sm"
                          disabled={!hasChanges || !isFormValid || isLoading}
                          className="flex items-center gap-2"
                        >
                          {isLoading && <IconLoader2 className="h-4 w-4 animate-spin" />}
                          {isLoading ? "Saving..." : "Save"}
                        </Button>
                      </div>
            </CardFooter>
        </Card>
    )
}


export function EmailChangeDialog() {
    const [emailChangeIsLoading, setEmailChangeIsLoading] = useState(false);
    const [newEmail, setNewEmail] = useState("");
    const { user } = useAppSelector((state) => state.auth);
    const [emailChangePassword, setEmailChangePassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [userProfile] = useState({
        email: user?.email || "",
        fullName: user?.fullName || "",
        phone: user?.phone || "",
        isEmailVerified: user?.isEmailVerified || false,
    });

    const handleRequestEmailChange = async () => {
      // Email validation
      if (!newEmail || !/^\S+@\S+\.\S+$/.test(newEmail)) {
        toast.error("Please enter a valid email address");
        return;
      }
      
      if (newEmail === userProfile.email) {
        toast.error("New email must be different from current email");
        return;
      }
      
      // Password validation
      if (!emailChangePassword || emailChangePassword.length < 8) {
        toast.error("Please enter a valid password (at least 8 characters)");
        return;
      }
      
      try {
        setEmailChangeIsLoading(true);
        const emailData: EmailChangeRequestDataType = {
          newEmail,
          password: emailChangePassword
        };
        
        const response = await requestEmailChange(emailData);
        toast.success(response.data.message || "Verification email sent to your new address");
        
        // Reset email change fields
        setNewEmail("");
        setEmailChangePassword("");
        
      } catch (error: any) {
        console.error('Failed to request email change:', error);
        toast.error(error?.data?.message || "Failed to request email change");
      } finally {
        setEmailChangeIsLoading(false);
      }
    };
    
    return (
      <>
        <DialogHeader>
          <DialogTitle>Change Email Address</DialogTitle>
          <DialogDescription>
            Enter your new email address and current password to request a change.
            We'll send a verification link to your new email.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="newEmail">New Email Address</Label>
            <div className="relative">
              <IconMail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="newEmail"
                type="email"
                placeholder="new.email@example.com"
                className="pl-8"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                disabled={emailChangeIsLoading}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="emailChangePassword">Current Password</Label>
            <div className="relative">
              <IconLock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="emailChangePassword"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="pl-8 pr-10"
                value={emailChangePassword}
                onChange={(e) => setEmailChangePassword(e.target.value)}
                disabled={emailChangeIsLoading}
              />
              <button
                type="button"
                className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground hover:text-foreground"
                onClick={() => setShowPassword((prev) => !prev)}
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            onClick={handleRequestEmailChange}
            disabled={emailChangeIsLoading || !newEmail.trim() || !emailChangePassword.trim()}
            className="flex items-center gap-2"
          >
            {emailChangeIsLoading && <IconLoader2 className="h-4 w-4 animate-spin" />}
            {emailChangeIsLoading ? "Sending..." : "Send Verification Email"}
          </Button>
        </DialogFooter>
      </>
    );
}

// Unlink OAuth Provider Component
export function UnlinkOauthProvider() {
  const [isUnlinking, setIsUnlinking] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  // Password validation
  const passwordRequirements = {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
  };

  const isPasswordValid = Object.values(passwordRequirements).every(Boolean);
  const doPasswordsMatch = password === confirmPassword;
  const isFormValid = isPasswordValid && doPasswordsMatch && password.trim() && confirmPassword.trim();

  const handleUnlinkOAuth = async () => {
    if (isUnlinking) return;

    if (!password.trim() || !confirmPassword.trim()) {
      toast.error("Please enter and confirm your new password");
      return;
    }

    if (!isPasswordValid) {
      toast.error("Password does not meet requirements");
      return;
    }

    if (!doPasswordsMatch) {
      toast.error("Passwords don't match");
      return;
    }

    setIsUnlinking(true);

    try {
      // Call the service to unlink the OAuth account and set password
      await unlinkSocialAccount(password);
      toast.success(`${user?.oAuthProvider || 'OAuth'} account unlinked successfully. Password has been set for your account.`);

      // Refresh user data
      await dispatch(checkAuthStatus()).unwrap();
    } catch (error: any) {
      console.error('Failed to unlink OAuth account:', error);
      toast.error(error.response?.data?.message || "Failed to unlink OAuth account");
    } finally {
      setIsUnlinking(false);
      setPassword("");
      setConfirmPassword("");
    }
  };

  return (
      <>
        <DialogHeader>
          <DialogTitle>Unlink {user?.oAuthProvider || 'OAuth'} Account</DialogTitle>
          <DialogDescription>
            To unlink your {user?.oAuthProvider || 'OAuth'} account, please set a new password for your account.
            After unlinking, you'll need to use your email and this password to sign in.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="grid gap-4 md:grid-cols-1">
            <div className="space-y-2">
              <Label htmlFor="unlinkPassword">New Password</Label>
              <div className="relative">
                <IconLock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="unlinkPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-8 pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isUnlinking}
                />
                <button
                  type="button"
                  className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword((prev) => !prev)}
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmUnlinkPassword">Confirm New Password</Label>
              <div className="relative">
                <IconLock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmUnlinkPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-8 pr-10"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isUnlinking}
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
              {confirmPassword && !doPasswordsMatch && (
                <p className="text-xs text-red-600">Passwords do not match</p>
              )}
              {confirmPassword && doPasswordsMatch && password && (
                <p className="text-xs text-green-600">Passwords match</p>
              )}
            </div>
          </div>
          
          {/* Password Requirements */}
          {password && (
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
        </div>
        
        <DialogFooter>
          <Button 
            onClick={handleUnlinkOAuth}
            disabled={isUnlinking || !isFormValid}
            variant="destructive"
            className="flex items-center gap-2"
          >
            {isUnlinking && <IconLoader2 className="h-4 w-4 animate-spin" />}
            {isUnlinking ? "Unlinking..." : `Unlink ${user?.oAuthProvider || 'OAuth'} Account`}
          </Button>
        </DialogFooter>
      </>
  );
}