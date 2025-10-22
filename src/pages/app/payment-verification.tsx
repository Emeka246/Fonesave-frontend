import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CircleCheck, CircleX, Loader2 } from 'lucide-react';

import PaymentService from '@/services/payment.service';
import { ApiResponse } from '@/services';
import ROUTES_CONFIG from '@/routes/ROUTES_CONFIG'

// Helper function to get URL parameters
const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

export default function PaymentVerificationPage() {
  const navigate = useNavigate();
  const query = useQuery();
  const reference = query.get('reference');
  const [isVerifying, setIsVerifying] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [deviceName, setDeviceName] = useState('');

  useEffect(() => {
    // Get saved payment data from sessionStorage
    const paymentData = JSON.parse(sessionStorage.getItem('devicePayment') || '{}');
    
    if (paymentData.deviceName) {
      setDeviceName(paymentData.deviceName);
    }

      const verifyPayment = async () => {
      if (!reference) {
        toast.error('Payment reference not found');
        setIsVerifying(false);
        return;
      }

      try {
        // Verify the payment with the backend
        const response: ApiResponse = await PaymentService.verifyPayment(reference);
        console.log(response.data);
        // Check the response structure
        if (response.data?.success) {
          setIsSuccess(true);
          toast.success('Payment successful! Your device has been registered.');
          
          // Clear payment data from session storage
          sessionStorage.removeItem('devicePayment');
          
          // Navigate back after delay
          // Do not auto-navigate. User will use the button to navigate.
        } else {
          setIsSuccess(false);
          toast.error('Payment verification failed. Please contact support.');
        }
      } catch (error) {
        console.error('Payment verification error:', error);
        toast.error('Failed to verify payment. Please contact support.');
        setIsSuccess(false);
      } finally {
        setIsVerifying(false);
      }
    };    verifyPayment();
  }, [reference, navigate]);

  if (isVerifying) {
    return (
      <div className="container max-w-md flex flex-col items-center justify-center min-h-[60vh] py-10">
        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Verifying Payment</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p>Please wait while we verify your payment...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-md flex flex-col items-center justify-center min-h-[60vh] py-10">
      <Card className="w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">
            {isSuccess ? 'Payment Successful' : 'Payment Failed'}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center p-6">
          {isSuccess ? (
            <>
              <CircleCheck className="h-16 w-16 text-green-500 mb-4" />
              <p className="text-center mb-2">
                Your payment was successful and your device has been registered.
              </p>
              {deviceName && (
                <p className="text-center text-sm text-muted-foreground">
                  Device: {deviceName}
                </p>
              )}
              <p className="text-center text-sm text-muted-foreground mt-2">
                Reference: {reference}
              </p>
            </>
          ) : (
            <>
              <CircleX className="h-16 w-16 text-red-500 mb-4" />
              <p className="text-center mb-2">
                There was a problem with your payment. Please try again or contact support.
              </p>
              {reference && (
                <p className="text-center text-sm text-muted-foreground">
                  Reference: {reference}
                </p>
              )}
            </>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button 
            onClick={() => navigate(ROUTES_CONFIG.DASHBOARD)}
          >
            {isSuccess ? 'Go to My Devices' : 'Try Again'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
