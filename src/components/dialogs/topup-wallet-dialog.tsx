import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Wallet } from 'lucide-react';
import { toast } from 'sonner';
import PaymentService from '@/services/payment.service';
import { ApiResponse } from '@/services';
import { useAppDispatch } from '@/store/hooks';
import { checkAuthStatus } from '@/store/slices/auth.slice';

interface TopUpWalletDialogProps {
  onSuccess?: () => void;
  trigger?: React.ReactNode;
}

export default function TopUpWalletDialog({ 
  onSuccess,
  trigger,
}: TopUpWalletDialogProps) {
  const [topupAmount, setTopupAmount] = useState('1000');
  const [isLoadingTopup, setIsLoadingTopup] = useState(false);
  const [open, setOpen] = useState(false);
  const dispatch = useAppDispatch();

  const handleTopup = async () => {
    if (!topupAmount || isNaN(Number(topupAmount))) {
      toast.error("Please enter a valid amount");
      return;
    }

    const amount = Number(topupAmount);
    if (amount < 1000) {
      toast.error("Minimum top-up amount is ₦1,000.00");
      return;
    }
    
    // Check if the amount is a multiple of 1000
    if (amount % 1000 !== 0) {
      toast.error("Amount must be a multiple of ₦1,000.00");
      return;
    }

    setIsLoadingTopup(true);
    try {
      // Convert amount to kobo
      console.log('topup is called');

      const response: ApiResponse = await PaymentService.topupAccount({
        amount: Math.round(amount),
      });
      
      if (response.data.success) {
        // Redirect to payment gateway
        toast.success("Redirecting to payment gateway...");
        window.location.href = response.data.data.authorizationUrl;
        setOpen(false);
        // Reload user data after successful topup initialization
        dispatch(checkAuthStatus());
        onSuccess?.();
      } else {
        toast.error("Failed to initialize payment");
      }
    } catch (error) {
      console.error("Topup error:", error);
      toast.error("Failed to process payment");
    } finally {
      setIsLoadingTopup(false);
      // Reset the amount after processing
      setTopupAmount('1000');
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      // Reset form when dialog closes
      setTopupAmount('1000');
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="w-full">
            <Wallet className="h-4 w-4 mr-2" />
            Top Up Wallet
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Top Up Wallet</DialogTitle>
          <DialogDescription>
            Enter the amount you want to add to your wallet.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid items-center gap-4">
            <div className="relative">
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount in Naira"
                value={topupAmount}
                onChange={(e) => setTopupAmount(e.target.value)}
                className="w-full pl-10"
                min={1000}
                step={1000}
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg font-medium pointer-events-none">₦</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {[5000, 10000, 20000, 50000, 100000].map((value) => (
              <Button
                key={value}
                variant="outline"
                size="sm"
                type="button"
                onClick={() => setTopupAmount(String(value))}
                className={topupAmount === String(value) ? "border-blue-500 bg-blue-50" : ""}
              >
                ₦{value.toLocaleString()}
              </Button>
            ))}
          </div>
          {topupAmount && !isNaN(Number(topupAmount)) && Number(topupAmount) > 0 && (
            <div className="text-sm text-muted-foreground">
              {Number(topupAmount) >= 1000 && Number(topupAmount) % 1000 === 0
                ? "Your wallet will be credited instantly after payment."
                : Number(topupAmount) < 1000 
                  ? "Minimum amount is ₦1,000.00" 
                  : "Amount must be in ₦1,000.00 increments"
              }
            </div>
          )}
        </div>
        <DialogFooter>
          <Button 
            onClick={handleTopup}
            disabled={isLoadingTopup}
          >
            {isLoadingTopup ? 'Processing...' : 'Proceed to Payment'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
