import { useState } from "react";
import { Button } from "@/components/ui/button";

/**
 * Simple ErrorBoundary test component
 * Add this to any page temporarily to test error boundaries
 * Usage: <SimpleErrorTest />
 */
export function SimpleErrorTest() {
  const [shouldThrow, setShouldThrow] = useState(false);

  if (shouldThrow) {
    throw new Error("Test error for ErrorBoundary!");
  }

  return (
    <div className="p-4 border rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
      <p className="text-sm mb-2">ErrorBoundary Test:</p>
      <div className="flex gap-2 flex-wrap">
        <Button 
          onClick={() => setShouldThrow(true)}
          variant="destructive"
          size="sm"
        >
          Throw Test Error
        </Button>
        <Button 
          onClick={() => window.location.href = '/route-error-test'}
          variant="outline"
          size="sm"
        >
          Route Tests
        </Button>
        <Button 
          onClick={() => window.location.href = '/error-404-test'}
          variant="outline"
          size="sm"
        >
          404 Tests
        </Button>
      </div>
    </div>
  );
}
