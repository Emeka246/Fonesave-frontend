# ErrorBoundary Implementation Guide

This guide explains how to use the ErrorBoundary components in your React application.

## Components Created

### 1. ErrorBoundary (`error-boundary.tsx`)
The main ErrorBoundary class component that catches JavaScript errors anywhere in the child component tree.

### 2. RouteErrorBoundary (`route-error-boundary.tsx`)
A specialized ErrorBoundary for route-level errors with navigation capabilities.

### 3. ErrorBoundaryExample (`error-boundary-example.tsx`)
A test component to demonstrate and test ErrorBoundary functionality.

## Basic Usage

### App-Level ErrorBoundary
Already integrated in `main.tsx` to catch all application errors:

```tsx
import { ErrorBoundary } from '@/components/common/error-boundary';

<ErrorBoundary
  onError={(error, errorInfo) => {
    // Log to external service
    console.error('App error:', error, errorInfo);
  }}
>
  <App />
</ErrorBoundary>
```

### Route-Level ErrorBoundary
Wrap specific routes or components:

```tsx
import { RouteErrorBoundary } from '@/components/common/route-error-boundary';

function MyPage() {
  return (
    <RouteErrorBoundary
      fallbackTitle="Page Not Working"
      fallbackMessage="This page encountered an error."
    >
      <PageContent />
    </RouteErrorBoundary>
  );
}
```

### Component-Level ErrorBoundary
Wrap individual components:

```tsx
import { ErrorBoundary } from '@/components/common/error-boundary';

function ParentComponent() {
  return (
    <div>
      <ErrorBoundary
        fallback={<div>Custom error message</div>}
      >
        <RiskyComponent />
      </ErrorBoundary>
    </div>
  );
}
```

### Using the HOC (Higher-Order Component)
For functional components:

```tsx
import { withErrorBoundary } from '@/components/common/error-boundary';

const MyComponent = () => {
  return <div>My component content</div>;
};

export default withErrorBoundary(MyComponent, {
  onError: (error, errorInfo) => {
    console.log('Component error:', error);
  }
});
```

### Error Handling in Functional Components
Use the hook for async errors:

```tsx
import { useErrorHandler } from '@/components/common/error-boundary';

function MyComponent() {
  const handleError = useErrorHandler();

  const fetchData = async () => {
    try {
      await someAsyncOperation();
    } catch (error) {
      handleError(error as Error);
    }
  };

  return <button onClick={fetchData}>Fetch Data</button>;
}
```

## Error Logging Integration

### Sentry Integration
```tsx
import * as Sentry from '@sentry/react';

<ErrorBoundary
  onError={(error, errorInfo) => {
    Sentry.captureException(error, {
      contexts: {
        react: {
          componentStack: errorInfo.componentStack,
        },
      },
    });
  }}
>
  <App />
</ErrorBoundary>
```

### Custom Logging Service
```tsx
import { logError } from '@/services/logging.service';

<ErrorBoundary
  onError={(error, errorInfo) => {
    logError({
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    });
  }}
>
  <App />
</ErrorBoundary>
```

## Best Practices

1. **Granular Error Boundaries**: Place error boundaries at different levels of your component tree for better error isolation.

2. **Meaningful Fallbacks**: Provide context-appropriate error messages for different parts of your application.

3. **Error Reporting**: Always log errors to an external service in production for monitoring and debugging.

4. **User Experience**: Provide recovery options like "Try Again" or "Go Back" buttons.

5. **Development vs Production**: Show detailed error information in development but user-friendly messages in production.

## Testing ErrorBoundaries

Use the `ErrorBoundaryExample` component to test your error boundaries:

```tsx
import { ErrorBoundaryExample } from '@/components/common/error-boundary-example';

// Add this temporarily to any page for testing
<ErrorBoundaryExample />
```

Remember to remove the test component before deploying to production.

## Limitations

ErrorBoundaries do NOT catch errors in:
- Event handlers (use try-catch instead)
- Asynchronous code (use the `useErrorHandler` hook)
- Server-side rendering
- Errors thrown in the error boundary itself

## Example Implementation in Pages

For critical pages like authentication:

```tsx
// In your auth pages
import { RouteErrorBoundary } from '@/components/common/route-error-boundary';

export default function LoginPage() {
  return (
    <RouteErrorBoundary
      fallbackTitle="Login Error"
      fallbackMessage="There was a problem with the login page. Please try refreshing or go back to the home page."
    >
      <LoginForm />
    </RouteErrorBoundary>
  );
}
```

This ensures that if any part of your authentication flow breaks, users get a helpful message instead of a blank screen.
