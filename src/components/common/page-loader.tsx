import React from 'react';

interface PageLoaderProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
  overlay?: boolean;
  variant?: 'default' | 'dots' | 'pulse';
}

const PageLoader: React.FC<PageLoaderProps> = ({ 
  message = "Loading...", 
  size = 'medium',
  overlay = true,
  variant = 'default'
}) => {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  };

  const renderSpinner = () => {
    switch (variant) {
      case 'dots':
        return (
          <div className="flex space-x-1">
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        );
      case 'pulse':
        return (
          <div className={`
            ${sizeClasses[size]}
            bg-blue-600 rounded-full animate-pulse
          `}></div>
        );
      default:
        return (
          <div className={`
            ${sizeClasses[size]}
            border-4 border-gray-200 border-t-blue-600 
            rounded-full animate-spin
          `}></div>
        );
    }
  };

  return (
    <div className={`
      ${overlay ? 'fixed inset-0 bg-white/80 dark:bg-black/80 backdrop-blur-sm z-50' : 'w-full h-full'}
      flex flex-col items-center justify-center min-h-screen
    `}>
      <div className="flex flex-col items-center space-y-4">
        {/* Spinner */}
        {renderSpinner()}
        
        {/* Loading message */}
        <p className="text-gray-600 text-sm font-medium animate-pulse">
          {message}
        </p>
      </div>
    </div>
  );
};

export default PageLoader;