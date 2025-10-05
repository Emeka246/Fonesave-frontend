import {Link} from "react-router-dom"
import { cn, handleKeyDown } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GoogleLogin } from "./partials/google-login"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Eye, EyeOff } from "lucide-react"
import { useAppDispatch } from "@/store/hooks"
import { login } from "@/store/slices/auth.slice"
import { usePageLoader } from "@/hooks/use-page-loader"
import { useNavigate, useSearchParams } from "react-router-dom"
import ROUTES from "@/routes/ROUTES_CONFIG"

export default function LoginPage({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const dispatch = useAppDispatch()
  const { executeWithLoader } = usePageLoader()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  // Pre-fill email from query parameters
  useEffect(() => {
    const emailFromQuery = searchParams.get('email')
    if (emailFromQuery) {
      setFormData(prevData => ({
        ...prevData,
        email: emailFromQuery
      }))
    }
  }, [searchParams])

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if(!formData.email || !formData.password) {
      toast.error("Please enter both email and password")
      return
    }

    try {
      await executeWithLoader(async () => {
        const userInfo = await dispatch(login(formData)).unwrap()
        console.log("Login successful:", userInfo)
        
        // Check if email is verified
        if (userInfo && userInfo.isEmailVerified === false) {
          toast.warning("Please verify your email before continuing")
          navigate(`${ROUTES.VERIFY_EMAIL}?email=${userInfo.email}`)
          return
        }
        
        toast.success("Login successful")
        
        // Check for return URL in sessionStorage
        const returnUrl = sessionStorage.getItem('returnUrl')
        if (returnUrl) {
          // Store return URL for after onboarding/verification if needed
          // Don't remove it yet - let route middleware handle the flow
          // The returnUrl will be consumed after onboarding completion
        }
        
        // Let route middleware handle the redirect flow
        // It will check for email verification and onboarding requirements
        // and redirect to the appropriate page
      }, "Signing in...")
    } catch (error: any) {
      console.error("Login error:", error)
      toast.error(error.message || "Login failed. Please check your credentials.")
    }
  }

  return (
  <div className={cn("flex flex-col gap-10", className)} {...props}>


      <div className="flex flex-col items-start gap-7">
        <h1 className="text-2xl font-bold">Login to your account</h1>
      </div>
            <div className="grid gap-6">
              <div className="flex flex-col gap-4">
               <GoogleLogin />
              </div>
              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-background text-muted-foreground relative z-10 px-2">
                  OR
                </span>
              </div>
              <div className="grid gap-6">
                <form className="grid gap-6"
                    onSubmit={handleFormSubmit}>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        autoComplete="email"
                      />
                    </div>
                    <div className="grid gap-2">
                      <div className="flex items-center">
                      <Label htmlFor="password">Password</Label>
                      <Link
                        to={ROUTES.RESET_PASSWORD}
                        className="ml-auto text-xs underline-offset-4 hover:underline"
                      >
                        Forgot your password?
                      </Link>
                      </div>
                      <div className="relative">
                      <Input 
                        id="password" 
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        autoComplete="current-password"
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
                        // Eye closed icon
                        <EyeOff className="size-5" />
                        )}
                      </button>
                      </div>
                    </div>
                    <Button type="submit" className="w-full">
                      Login
                    </Button>
                </form>
              </div>
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link 
                  to={`${ROUTES.REGISTER}${searchParams.get('email') ? `?email=${encodeURIComponent(searchParams.get('email')!)}` : ''}`} 
                  className="underline underline-offset-4"
                >
                  Sign up
                </Link>
              </div>
            </div>
  </div>
  )
}
