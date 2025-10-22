import { ErrorBoundary } from "./error-boundary";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface RouteErrorBoundaryProps {
  children: React.ReactNode;
  fallbackTitle?: string;
  fallbackMessage?: string;
  showBackButton?: boolean;
}

export function RouteErrorBoundary({
  children,
  fallbackTitle = "Page Error",
  fallbackMessage = "Something went wrong on this page.",
  showBackButton = true,
}: RouteErrorBoundaryProps) {
  
  // Create the fallback component as a proper React component
  const FallbackComponent = () => {
    const navigate = useNavigate();

    return (
      <div className="flex min-h-[400px] items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/20">
              <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <CardTitle className="text-lg font-semibold">
              {fallbackTitle}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <p className="text-sm text-muted-foreground">
              {fallbackMessage}
            </p>
            <div className="flex flex-col gap-2">
              <Button onClick={() => window.location.reload()} className="w-full">
                Reload Page
              </Button>
              {showBackButton && (
                <Button 
                  onClick={() => navigate(-1)} 
                  variant="outline" 
                  className="w-full"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Go Back
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <ErrorBoundary 
      fallback={<FallbackComponent />}
      onError={(error, errorInfo) => {
        // Log route-level errors
        console.error('RouteErrorBoundary caught error:', error, errorInfo);
      }}
    >
      {children}
    </ErrorBoundary>
  );
}
