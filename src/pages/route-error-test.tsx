import { useState } from "react";
import { RouteErrorBoundary } from "@/components/common/error-boundary/route-error-boundary";
import { ErrorBoundary } from "@/components/common/error-boundary/error-boundary";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// Test component that throws an error
function BuggyTestComponent({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) {
    throw new Error("Test error for RouteErrorBoundary testing!");
  }
  
  return (
    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
      <p className="text-green-700 dark:text-green-300">
        ✅ Component is working properly!
      </p>
    </div>
  );
}

export default function RouteErrorBoundaryTestPage() {
  const [testScenario, setTestScenario] = useState<string>("none");

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">RouteErrorBoundary Test Page</h1>
        <p className="text-muted-foreground">
          This page tests the RouteErrorBoundary component functionality.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Standard ErrorBoundary Test */}
        <Card>
          <CardHeader>
            <CardTitle>Standard ErrorBoundary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Button 
                onClick={() => setTestScenario("standard")}
                variant={testScenario === "standard" ? "destructive" : "default"}
                className="w-full"
              >
                {testScenario === "standard" ? "Error Active" : "Trigger Standard Error"}
              </Button>
              <Button 
                onClick={() => setTestScenario("none")}
                variant="outline"
                className="w-full"
              >
                Reset
              </Button>
            </div>
            
            <Separator />
            
            <ErrorBoundary>
              <BuggyTestComponent shouldThrow={testScenario === "standard"} />
            </ErrorBoundary>
          </CardContent>
        </Card>

        {/* RouteErrorBoundary Test */}
        <Card>
          <CardHeader>
            <CardTitle>RouteErrorBoundary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Button 
                onClick={() => setTestScenario("route")}
                variant={testScenario === "route" ? "destructive" : "default"}
                className="w-full"
              >
                {testScenario === "route" ? "Error Active" : "Trigger Route Error"}
              </Button>
              <Button 
                onClick={() => setTestScenario("none")}
                variant="outline"
                className="w-full"
              >
                Reset
              </Button>
            </div>
            
            <Separator />
            
            <RouteErrorBoundary
              fallbackTitle="Route Test Error"
              fallbackMessage="This is a test error from RouteErrorBoundary."
              showBackButton={true}
            >
              <BuggyTestComponent shouldThrow={testScenario === "route"} />
            </RouteErrorBoundary>
          </CardContent>
        </Card>
      </div>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Test Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-semibold">How to Test:</h4>
            <ol className="list-decimal list-inside space-y-1 text-sm">
              <li>Click "Trigger Standard Error" to test the basic ErrorBoundary</li>
              <li>Click "Trigger Route Error" to test the RouteErrorBoundary</li>
              <li>Compare the different error UIs and recovery options</li>
              <li>Test the "Try Again", "Reload Page", and "Go Back" buttons</li>
              <li>Use "Reset" to clear the test state</li>
            </ol>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-semibold">Expected Behavior:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Standard ErrorBoundary shows a full-page error with multiple recovery options</li>
              <li>RouteErrorBoundary shows a smaller, page-level error with navigation options</li>
              <li>Both should provide "Try Again" functionality that resets the error state</li>
              <li>RouteErrorBoundary should show a "Go Back" button for navigation</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
