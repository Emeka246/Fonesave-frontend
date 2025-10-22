import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import CountrySelect from '@/components/ui/country-select';
import { Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/use-auth';
import * as AuthService from '@/services/auth.service';
import ROUTES from '@/routes/ROUTES_CONFIG';

export default function CompleteRegistrationByLink() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [formData, setFormData] = useState({
    password: '',
    fullName: '',
    phone: '',
    country: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(ROUTES.DASHBOARD);
    }
  }, [isAuthenticated, navigate]);

  // Validate token and get device info
  useEffect(() => {
    const validateToken = async () => {
      if (!token || !email) {
        setValidationError('Invalid registration link. Missing token or email.');
        setIsValidating(false);
        return;
      }

      try {
        const response = await AuthService.checkUserToken(token);
        if (!response.data.success) {
          setValidationError('Invalid or expired registration token.');
          setIsValidating(false);
          return;
        }
        setIsValidating(false);
      } catch (error) {
        console.error('Token validation error:', error);
        setValidationError('Invalid or expired registration link.');
        setIsValidating(false);
      }
    };

    validateToken();
  }, [token, email]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      toast.error('Invalid registration link');
      return;
    }

    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    setIsLoading(true);

    try {
      const response = await AuthService.completeAgentRegistration({
        token,
        password: formData.password,
        fullName: formData.fullName,
        phone: formData.phone,
        country: formData.country
      });

      if (response.data.success) {
        toast.success('Account created successfully!');
        
        // Redirect to dashboard
        navigate(ROUTES.DASHBOARD);
      } else {
        toast.error(response.data.message || 'Failed to create account');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(error?.data?.message || 'Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Validating registration link...</span>
        </div>
      </div>
    );
  }

  if (validationError) {
    return (
      <div className="flex flex-col gap-10">
        <div className="flex flex-col items-start gap-2">
          <h1 className="text-2xl font-bold">Invalid Registration Link</h1>
          <Alert>
          <AlertCircle className="h-4 w-4" />
            <AlertDescription>{validationError}</AlertDescription>
          </Alert>
          <Button 
            onClick={() => navigate(ROUTES.LOGIN)} 
            className="w-full mt-4"
          >
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10">

      <div className="flex flex-col items-start gap-2">
        <h1 className="text-2xl font-bold">Complete Your Registration</h1>
        <p className="text-sm text-muted-foreground">
          Your device has been registered by an agent. Complete your account setup to access your device.
        </p>
      </div>
      <div className="grid gap-2">
          {email && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                <strong>Email:</strong> {email}
              </p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="grid gap-6">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Enter your phone number"
                required
              />
            </div>

            <CountrySelect
              value={formData.country}
              onValueChange={(value) => setFormData(prev => ({ ...prev, country: value }))}
              placeholder="Select your country"
              required
            />

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Create a password (min 8 characters)"
                  required
                  minLength={8}
                  className="pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  onClick={() => setShowPassword((prev) => !prev)}
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <Eye className="size-5" /> : (
                    <EyeOff className="size-5" />
                  )}
                </button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                'Complete Registration'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Button 
                variant="link" 
                onClick={() => navigate(ROUTES.LOGIN)}
                className="p-0 h-auto"
              >
                Sign in
              </Button>
            </p>
          </div>
        </div>
    </div>
  );
}
