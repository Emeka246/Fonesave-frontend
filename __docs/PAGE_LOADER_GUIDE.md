# Page Loader Implementation Guide

## Overview

The Page Loader system consists of several components working together to provide seamless loading states throughout your React application:

1. **PageLoader Component** - The visual loading component
2. **LoadingProvider** - Context provider for global loading state
3. **usePageLoader Hook** - Custom hook for loading operations
4. **useNavigationLoader Hook** - Hook for navigation loading states

## Components

### 1. PageLoader Component

The main loading component with different variants:

```tsx
<PageLoader 
  message="Loading..." 
  size="medium" 
  overlay={true} 
  variant="default" 
/>
```

**Props:**
- `message` - Loading message text
- `size` - 'small' | 'medium' | 'large'
- `overlay` - Boolean for full-screen overlay
- `variant` - 'default' | 'dots' | 'pulse'

### 2. LoadingProvider

Wrap your app with the LoadingProvider to enable global loading states:

```tsx
// In main.tsx
<LoadingProvider>
  <App />
</LoadingProvider>
```

### 3. Route Middleware Integration

The loader automatically shows during authentication checks in protected routes.

## Usage Examples

### 1. In Components with API Calls

```tsx
import { usePageLoader } from '@/hooks/use-page-loader';

const MyComponent = () => {
  const { executeWithLoader } = usePageLoader();

  const handleSubmit = async () => {
    try {
      await executeWithLoader(async () => {
        const result = await apiCall();
        // Handle success
      }, "Submitting form...");
    } catch (error) {
      // Handle error
    }
  };
};
```

### 2. Manual Loading Control

```tsx
import { usePageLoader } from '@/hooks/use-page-loader';

const MyComponent = () => {
  const { showLoader, hideLoader } = usePageLoader();

  const handleManualOperation = async () => {
    showLoader("Processing...");
    
    try {
      // Your async operation
      await someAsyncOperation();
    } finally {
      hideLoader();
    }
  };
};
```

### 3. Navigation with Loading

```tsx
import { useNavigationLoader } from '@/hooks/use-page-loader';
import { useNavigate } from 'react-router-dom';

const MyComponent = () => {
  const navigate = useNavigate();
  const { navigateWithLoader } = useNavigationLoader();

  const handleNavigate = () => {
    navigateWithLoader(() => {
      navigate('/dashboard');
    }, "Navigating to dashboard...");
  };
};
```

### 4. Different Loader Variants

```tsx
// Default spinner
<PageLoader variant="default" message="Loading..." />

// Bouncing dots
<PageLoader variant="dots" message="Processing..." />

// Pulsing circle
<PageLoader variant="pulse" message="Connecting..." />
```

## Automatic Loading States

The system automatically handles:

1. **Page Reloads** - Shows loader during browser refresh
2. **Authentication Checks** - Shows loader while verifying user state
3. **Initial Page Load** - Shows loader until page is fully loaded

## Best Practices

1. **Use descriptive messages** - "Signing in...", "Saving changes...", etc.
2. **Choose appropriate variants** - Use 'dots' for short operations, 'default' for longer ones
3. **Handle errors gracefully** - Always hide the loader in error cases
4. **Don't overuse** - Only show loaders for operations that take >500ms

## Features

- 🔄 Automatic page reload detection
- 🔐 Authentication loading states
- 🎨 Multiple loader variants
- 📱 Responsive design
- ⚡ TypeScript support
- 🎯 Easy API integration
- 🚀 Performance optimized
