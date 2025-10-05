import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Link, useSearchParams, useNavigate } from "react-router-dom"

import { cn, handleKeyDown} from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RegisterUserData } from "@/services/auth.service"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { register } from "@/store/slices/auth.slice"
import { GoogleLogin } from "./partials/google-login"
import { Eye, EyeOff } from "lucide-react"

export default function RegisterPage({
  className,
  ...props
}: React.ComponentProps<"form">) {

  // const [isLoading, setIsLoading] = useState(false)
  // const [error, setError] = useState<string | null>(null)

  const [formData, setFormData]  = useState<RegisterUserData>({
    email: "",
    password: ""
  })
  const [showPassword, setShowPassword] = useState(false)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

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

  const  handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }


  const dispatch = useAppDispatch()
  const { isLoading } = useAppSelector(state => state.auth)

  const requestHandler = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()

      // Check if all required fields are filled
      if (!formData.email || !formData.password) {
        toast.error("Please fill in all required fields")
        return
      }
  
      try {
        await dispatch(register(formData)).unwrap()
        toast.success("Registration successful! Please check your email for a verification link.")
        
        // Check for return URL in sessionStorage
        const returnUrl = sessionStorage.getItem('returnUrl')
        if (returnUrl) {
          // Store the return URL for after email verification
          sessionStorage.setItem('returnUrlAfterVerification', returnUrl)
        }
        
        // Redirect to email verification page
        navigate(`/verify-email?email=${formData.email}`)
     
      } catch (error: any) {
        console.log(error)
        toast.error(error?.message || "Registration failed")
      }
  }

  return (
        <form onSubmit={requestHandler} className={cn("flex flex-col gap-7", className)} {...props}>
          <div className="flex flex-col items-start gap-2">
        <h1 className="text-3xl font-bold">Get Started</h1>
        <p className="text-sm text-muted-foreground">
          Create your account to start using our services
        </p>
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
                  onFocus={(e) => e.target.select()}
                  autoComplete="email"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="********"
                  onKeyDown={handleKeyDown}
                  onFocus={(e) => e.target.select()}
                  autoComplete="new-password"
                  required
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
              <Button type="submit" className="relative w-full" disabled={isLoading} loader={isLoading}>
                Create account
              </Button>
            </div>
            <div className="text-center text-sm text-zinc-400">
              Already have an account?{" "}
              <Link 
                to={`/login${searchParams.get('email') ? `?email=${encodeURIComponent(searchParams.get('email')!)}` : ''}`} 
                className="underline text-black dark:text-white underline-offset-4"
              >
                Login
              </Link>
            </div>
          </div>
        </form>
  )
}