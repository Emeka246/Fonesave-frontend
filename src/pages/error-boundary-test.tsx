import { useState } from "react";
import { ErrorBoundary } from "@/components/common/error-boundary/error-boundary";
import { RouteErrorBoundary } from "@/components/common/error-boundary/route-error-boundary";
import { ErrorBoundaryExample } from "@/components/common/error-boundary/error-boundary-example";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// Test component that throws an error
function BuggyComponent({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) {
    throw new Error("Intentional error for testing ErrorBoundary!");
  }
  
  return (
    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
      <p className="text-green-700 dark:text-green-300">
        ✅ This component is working properly!
      </p>
    </div>
  );
}

// Counter component to demonstrate state reset
function BuggyCounter() {
  const [count, setCount] = useState(0);
  const [shouldThrow, setShouldThrow] = useState(false);

  if (shouldThrow) {
    throw new Error(`Counter error at count: ${count}`);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Counter Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <p className="text-2xl font-bold">{count}</p>
          <p className="text-sm text-muted-foreground">Current count</p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={() => setCount(c => c + 1)}
            className="flex-1"
          >
            Increment
          </Button>
          <Button 
            onClick={() => setCount(0)}
            variant="outline"
            className="flex-1"
          >
            Reset
          </Button>
        </div>
        
        <Button 
          onClick={() => setShouldThrow(true)}
          variant="destructive"
          className="w-full"
        >
          Throw Error (Test Try Again)
        </Button>
        
        <p className="text-xs text-muted-foreground">
          Click "Throw Error" to test the ErrorBoundary's "Try Again" functionality.
          The counter will reset when you click "Try Again".
        </p>
      </CardContent>
    </Card>
  );
}

export default function ErrorBoundaryTestPage() {
  const [testScenario, setTestScenario] = useState<string>("none");

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">ErrorBoundary Test Page</h1>
        <p className="text-muted-foreground">
          This page demonstrates different ErrorBoundary scenarios and the "Try Again" functionality.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Basic ErrorBoundary Test */}
        <Card>
          <CardHeader>
            <CardTitle>Basic ErrorBoundary Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Button 
                onClick={() => setTestScenario("basic")}
                variant={testScenario === "basic" ? "destructive" : "default"}
                className="w-full"
              >
                {testScenario === "basic" ? "Error Active" : "Trigger Basic Error"}
              </Button>
              <Button 
                onClick={() => setTestScenario("none")}
                variant="outline"
                className="w-full"
              >
                Reset Test
              </Button>
            </div>
            
            <Separator />
            
            <ErrorBoundary>
              <BuggyComponent shouldThrow={testScenario === "basic"} />
            </ErrorBoundary>
          </CardContent>
        </Card>

        {/* Route ErrorBoundary Test */}
        <Card>
          <CardHeader>
            <CardTitle>Route ErrorBoundary Test</CardTitle>
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
                Reset Test
              </Button>
            </div>
            
            <Separator />
            
            <RouteErrorBoundary
              fallbackTitle="Route Test Error"
              fallbackMessage="This is a route-level error for testing."
            >
              <BuggyComponent shouldThrow={testScenario === "route"} />
            </RouteErrorBoundary>
          </CardContent>
        </Card>
      </div>

      {/* Counter Test with State Reset */}
      <div className="max-w-md mx-auto">
        <ErrorBoundary>
          <BuggyCounter />
        </ErrorBoundary>
      </div>

      {/* Interactive Example */}
      <div className="max-w-md mx-auto">
        <ErrorBoundaryExample />
      </div>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>How to Test "Try Again"</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-semibold">Test Steps:</h4>
            <ol className="list-decimal list-inside space-y-1 text-sm">
              <li>Click any "Trigger Error" button above</li>
              <li>Observe the error boundary UI with the "Try Again" button</li>
              <li>Click "Try Again" to reset the error state</li>
              <li>The component should return to its normal state</li>
            </ol>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-semibold">What "Try Again" Does:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Resets the ErrorBoundary's error state</li>
              <li>Re-renders the child components</li>
              <li>Clears any error information</li>
              <li>Returns the component tree to its normal state</li>
            </ul>
          </div>
          
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              <strong>Note:</strong> The "Try Again" button will only work if the underlying issue 
              that caused the error has been resolved. In these test scenarios, you need to reset 
              the test state first.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
