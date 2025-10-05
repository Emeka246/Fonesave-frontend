import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Check } from "lucide-react"
import * as authService from "@/services/auth.service"
import { toast } from "sonner"

export default function ResetPasswordPage({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try{
    setLoading(true)
    // Validate email format
    const form = e.target as HTMLFormElement;
    const email = (form.elements.namedItem("email") as HTMLInputElement)?.value;
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      toast.error("Please enter a valid email address")
      return;
    }
    
    // Here you would add the actual password reset request logic
    const response: authService.ApiResponse = await authService.resetPasswordRequest(email)
    console.log("Reset Password Response:", response)
    if (response.message) {
      toast.error(response.message)
      return
    }
    setIsSubmitted(true)
    }
    catch (error: any) {
      console.error("Error during password reset request:", error)
      toast.error(error.data?.message || "An error occurred while processing your request")
    }
    finally {
      setLoading(false)
    }
  }
  return (
    <div className={cn("flex flex-col gap-10", className)} {...props}>
        <div className="flex flex-col items-start gap-1">
          <h1 className="text-2xl font-bold">Reset Password</h1>
            <p className="text-sm text-muted-foreground">
            Check your email for the reset link
            </p>
        </div>
          {!isSubmitted ? (
            <form onSubmit={handleSubmit}>
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    disabled={loading}
                  />
                </div>
                <Button type="submit" className="w-full relative" disabled={loading} loader={loading}>
                  Send Reset Link
                </Button>
              </div>
            </form>
          ) : (
            <Card>
              <CardContent>
                <div className="text-center">
                  <div className="mb-4 rounded-full bg-green-100 p-3 text-green-600 mx-auto w-fit">
                    <Check className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-medium">Check your email</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    We've sent a password reset link to your email address.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
          <div className="text-center text-sm text-zinc-400">
            Remember your password?{" "}
            <Link to="/login" className="underline underline-offset-4 text-black dark:text-white">
              Back to login
            </Link>
          </div>
    </div>
  )
}