import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Home, ArrowLeft } from 'lucide-react';
import { ErrorBoundary } from '../common/error-boundary/error-boundary';

const Layout404: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate('/', { replace: true });
    };

    const handleGoBack = () => {
        navigate(-1);
    };



    return (
        <ErrorBoundary>
            <div className="flex flex-col items-center justify-center min-h-screen p-4">
                <div className="w-full max-w-md text-center space-y-6">
                    <div className="space-y-4">
                        <div className="mx-auto mb-4 flex items-center justify-center">
                            <span className="text-8xl font-bold text-orange-600 dark:text-orange-400">
                                404
                            </span>
                        </div>
                        <h1 className="text-2xl font-bold">
                            Page Not Found
                        </h1>
                    </div>
                    
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <p className="text-lg font-semibold">
                                Oops! This page doesn't exist.
                            </p>
                            <p className="text-sm text-muted-foreground">
                                The page at <code className="bg-muted px-1 py-0.5 rounded text-xs">{location.pathname}</code> could not be found or has been moved.
                            </p>
                        </div>

                      

                        <div className="flex flex-col gap-2">
                            <Button onClick={handleGoHome}>
                                <Home className="mr-2 h-4 w-4" />
                                Go to Home
                            </Button>
                            
                            <Button 
                                onClick={handleGoBack} 
                                variant="outline" 
                            >
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Go Back
                            </Button>
                            
                            
                        </div>

                        {/* Development info */}
                        {process.env.NODE_ENV === 'development' && (
                            
                            <div className="mt-6 p-3 bg-muted rounded-md text-left">
                             
                                <h5 className="text-xs font-medium mb-2">Debug Info (Development Only):</h5>
                                <div className="text-xs text-muted-foreground space-y-1">
                                    <div><strong>Path:</strong> {location.pathname}</div>
                                    <div><strong>Search:</strong> {location.search || 'None'}</div>
                                    <div><strong>Hash:</strong> {location.hash || 'None'}</div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </ErrorBoundary>
    );
};

export default Layout404;
