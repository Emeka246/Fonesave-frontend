import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store'
import { router } from './routes'
import './index.css'
import { Toaster } from '@/components/ui/sonner'
import { ThemeProvider } from '@/contexts/theme.provider'
import { LoadingProvider } from '@/contexts/loading.provider'
import { AuthInitializer } from '@/components/common/auth/auth-initializer'
import { ErrorBoundary } from '@/components/common/error-boundary/error-boundary'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
    <ErrorBoundary
        onError={(error, errorInfo) => {
            // Log to external service in production
            console.error('App-level error:', error, errorInfo);
            // You can integrate with services like Sentry, LogRocket, etc.
        }}
    >
        <Provider store={store}>
                <LoadingProvider>
                    <AuthInitializer>
                        <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
                            <RouterProvider router={router} />
                            <Toaster position='top-right' />
                        </ThemeProvider>
                    </AuthInitializer>
                </LoadingProvider>
        </Provider>
    </ErrorBoundary>
    </StrictMode>
)
