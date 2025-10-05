import { Card, CardContent } from "@/components/ui/card"


export default function AuthLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Card className="w-80 border-0 shadow-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <CardContent className="p-8 flex flex-col items-center space-y-6">
          {/* Main Loading Animation */}
          <div className="relative">
            {/* Outer rotating ring */}
            <div className="w-16 h-16 border-4 border-blue-200 dark:border-blue-800 rounded-full animate-spin">
              <div className="absolute top-0 left-0 w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
            </div>
            {/* Inner pulsing circle */}
            <div className="absolute inset-2 w-12 h-12 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full animate-pulse"></div>
            {/* Center dot */}
            <div className="absolute inset-6 w-4 h-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-bounce"></div>
          </div>
          
          {/* Loading Text with Typewriter Effect */}
          <div className="text-center space-y-2">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 animate-pulse">
              Authenticating
            </h3>
          </div>
        
          
          {/* Floating Elements */}
          <div className="absolute -top-2 -left-2 w-6 h-6 bg-black/30 rounded-full animate-ping"></div>
          <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-black/30 rounded-full animate-ping [animation-delay:1s]"></div>
        </CardContent>
      </Card>
    </div>
  )
}