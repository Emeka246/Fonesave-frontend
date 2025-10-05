import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

export default function ErrorTestPage() {
  const navigate = useNavigate();

  const triggerRouterError = () => {
    // This will trigger a router error
    throw new Error("Intentional router error for testing!");
  };

  const goto404 = () => {
    navigate('/this-page-does-not-exist');
  };

  const gotoInvalidRoute = () => {
    navigate('/invalid/nested/route/that/does/not/exist');
  };

  const causeNavigationError = () => {
    // Try to navigate to an invalid route that might cause an error
    window.history.pushState(null, '', '/malformed-url-?@#$%');
    window.location.reload();
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">404 & Router Error Testing</h1>
        <p className="text-muted-foreground">
          Test different error scenarios and see how ErrorBoundaries handle them.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* 404 Errors */}
        <Card>
          <CardHeader>
            <CardTitle>404 Page Not Found</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Test the 404 page with different scenarios:
            </p>
            
            <div className="space-y-2">
              <Button 
                onClick={goto404}
                variant="outline"
                className="w-full"
              >
                Go to Non-existent Page
              </Button>
              
              <Button 
                onClick={gotoInvalidRoute}
                variant="outline"
                className="w-full"
              >
                Go to Invalid Nested Route
              </Button>
            </div>
            
            <div className="text-xs text-muted-foreground">
              These will navigate to pages that don't exist and show the 404 page.
            </div>
          </CardContent>
        </Card>

        {/* Router Errors */}
        <Card>
          <CardHeader>
            <CardTitle>Router Errors</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Test router-level errors:
            </p>
            
            <div className="space-y-2">
              <Button 
                onClick={triggerRouterError}
                variant="destructive"
                className="w-full"
              >
                Trigger Router Error
              </Button>
              
              <Button 
                onClick={causeNavigationError}
                variant="destructive"
                className="w-full"
              >
                Cause Navigation Error
              </Button>
            </div>
            
            <div className="text-xs text-muted-foreground">
              These will cause actual errors in the routing system.
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Information */}
      <Card>
        <CardHeader>
          <CardTitle>Error Handling Hierarchy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div>
              <h4 className="font-semibold text-sm">1. 404 Errors (Page Not Found)</h4>
              <ul className="text-xs text-muted-foreground ml-4 mt-1 space-y-1">
                <li>• Handled by the Layout404 component</li>
                <li>• Shows when navigating to non-existent routes</li>
                <li>• Provides navigation options to return to valid pages</li>
                <li>• Wrapped with ErrorBoundary for additional safety</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-sm">2. Router Errors</h4>
              <ul className="text-xs text-muted-foreground ml-4 mt-1 space-y-1">
                <li>• Handled by RouterErrorBoundary components</li>
                <li>• Catches errors during route rendering</li>
                <li>• Shows error status codes when available</li>
                <li>• Provides recovery options and debugging info</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-sm">3. Component Errors</h4>
              <ul className="text-xs text-muted-foreground ml-4 mt-1 space-y-1">
                <li>• Handled by ErrorBoundary and RouteErrorBoundary</li>
                <li>• Catches JavaScript errors in components</li>
                <li>• Provides "Try Again" functionality</li>
                <li>• Shows detailed error info in development</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
