import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useErrorHandler } from "./error-boundary";

/**
 * Example component to demonstrate ErrorBoundary usage
 * This component can be used for testing error boundaries in development
 */
export function ErrorBoundaryExample() {
  const [shouldThrow, setShouldThrow] = useState(false);
  const handleError = useErrorHandler();

  // This will trigger the error boundary
  if (shouldThrow) {
    throw new Error("This is a test error from ErrorBoundaryExample component!");
  }

  const triggerAsyncError = () => {
    // Simulate an async error (these need to be caught differently)
    setTimeout(() => {
      try {
        throw new Error("This is a test async error!");
      } catch (error) {
        handleError(error as Error);
      }
    }, 100);
  };

  const triggerSyncError = () => {
    // This will trigger the error boundary immediately
    setShouldThrow(true);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-lg">ErrorBoundary Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Use these buttons to test the ErrorBoundary functionality:
        </p>
        
        <div className="space-y-2">
          <Button 
            onClick={triggerSyncError}
            variant="destructive"
            className="w-full"
          >
            Trigger Sync Error
          </Button>
          
          <Button 
            onClick={triggerAsyncError}
            variant="outline"
            className="w-full"
          >
            Trigger Async Error
          </Button>
        </div>
        
        <p className="text-xs text-muted-foreground">
          Note: Remove this component in production builds.
        </p>
      </CardContent>
    </Card>
  );
}
