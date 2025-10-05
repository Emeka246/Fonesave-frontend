import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/hooks/use-auth';
import TopUpWalletDialog from '@/components/dialogs/topup-wallet-dialog';

import { 
  Wallet, 
  Download, 
  Plus, 
  TrendingUp, 
  Zap,
  DollarSign,
  Shield,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { toast } from 'sonner';
import { useSearchParams, useNavigate } from 'react-router-dom';
import PaymentService from '@/services/payment.service';
import { ApiResponse } from '@/services';

export default function BillingPage() {
  const { isAgent } = useAuth();
  // State for API data
  const [userPlan, setUserPlan] = useState({
    type: 'normal', // default to normal
    name: 'Normal User',
    registrationsUsed: 0,
    freeRegistrationsEarned: 0,
    freeRegistrationsUsed: 0,
    accountBalance: 0, // in kobo
    nextBillingDate: '',
    status: 'active'
  });

  const [billingHistory, setBillingHistory] = useState<any[]>([]);
  
  // Pagination state
  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
    offset: 0
  });

  // Loading states
  const [isLoading, setIsLoading] = useState({
    overview: true,
    history: true,
    paymentMethods: true
  });

  // Search params and navigation for handling callbacks
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Verify payment reference
  const verifyPaymentReference = async (reference: string) => {
    try {
      const result = await PaymentService.verifyPayment(reference);
      // Check if the verification was successful
      if (result.data && result.data.success) {
        toast.success('Payment processed successfully!');
        // Reload billing data to show updated balance
        loadBillingOverview();
        loadBillingHistory();
      } else {
        toast.error('Payment verification failed. Please try again.');
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      toast.error('Failed to verify payment. Please contact support.');
    }
  };

  // Load billing overview
  const loadBillingOverview = async () => {
    setIsLoading(prev => ({ ...prev, overview: true }));
    try {
      const response = await PaymentService.getBillingOverview();
      if (response.data.success) {
        setUserPlan(response.data.data);
      }
    } catch (error) {
      console.error('Failed to load billing overview:', error);
      toast.error('Failed to load billing data');
    } finally {
      setIsLoading(prev => ({ ...prev, overview: false }));
    }
  };

  // Load billing history with pagination
  const loadBillingHistory = async (page = pagination.currentPage) => {
    setIsLoading(prev => ({ ...prev, history: true }));
    try {
      const offset = (page - 1) * pagination.itemsPerPage;
      const response:ApiResponse = await PaymentService.getBillingHistory(pagination.itemsPerPage, offset);
      if (response.data.success) {
        setBillingHistory(response.data.data);
        
        // Update pagination state if pagination info is available
        if (response.data.pagination) {
          const { total, offset: apiOffset, limit } = response.data.pagination;
          const totalPages = Math.ceil(total / limit);
          const currentPage = Math.floor(apiOffset / limit) + 1;
          
          setPagination(prev => ({
            ...prev,
            currentPage: page,
            totalItems: total,
            totalPages: totalPages,
            hasNextPage: currentPage < totalPages,
            hasPrevPage: currentPage > 1,
            offset: apiOffset
          }));
        }
      }
    } catch (error) {
      console.error('Failed to load billing history:', error);
      toast.error('Failed to load transaction history');
    } finally {
      setIsLoading(prev => ({ ...prev, history: false }));
    }
  };

  // Pagination navigation functions
  const goToPage = (page: number) => {
    if (page >= 1 && page <= pagination.totalPages && page !== pagination.currentPage) {
      loadBillingHistory(page);
    }
  };

  const goToNextPage = () => {
    if (pagination.hasNextPage) {
      goToPage(pagination.currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (pagination.hasPrevPage) {
      goToPage(pagination.currentPage - 1);
    }
  };

  // Check for payment verification from URL params
  useEffect(() => {
    const reference = searchParams.get('ref');
    if (reference) {
      // Verify payment if reference is present
      verifyPaymentReference(reference);
      
      // Remove the reference from the URL to prevent duplicate verifications
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete('ref');
      navigate({ search: newSearchParams.toString() }, { replace: true });
    }
  }, [searchParams, navigate]);

  // Load initial data
  useEffect(() => {
    loadBillingOverview();
    loadBillingHistory();
  }, []);

  // Helper to format currency
  function formatCurrency(kobo: number) {
    const amount = Math.abs(kobo);
    return `₦${(amount).toLocaleString('en-NG')}`;
  }


  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50';
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      case 'failed': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'registration': return <Shield className="h-4 w-4" />;
      case 'topup': return <Plus className="h-4 w-4" />;
      case 'bonus': return <CheckCircle className="h-4 w-4" />;
      default: return <DollarSign className="h-4 w-4" />;
    }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
            <span>Billing & Account</span>

          <Badge variant="outline">{!isAgent() ? 'Regular User' : 'Agent Plan'}</Badge>
          </h1>

          
          <p className="hidden md:block text-muted-foreground mt-2">
            Manage your billing, payment methods, and account balance
          </p>
        </div>
      </div>

      {/* Current Plan & Account Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
       

        {isAgent() && (
          <Card>
            <CardContent className="flex items-center">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Wallet className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Account Balance</p>
                  <p className="text-lg font-semibold">{formatCurrency(userPlan.accountBalance)}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="px-4 pt-0">
              <TopUpWalletDialog 
              onSuccess={() => {
                // Reload billing data after successful topup
                loadBillingOverview();
                loadBillingHistory();
              }}
            />
            </CardFooter>
          </Card>
        )}
    {isAgent() && (
        <Card>
          <CardContent className="flex items-center">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Registrations</p>
                <p className="text-lg font-semibold">{userPlan.registrationsUsed}</p>
              </div>
            </div>
          </CardContent>
        </Card>)}

        {isAgent() && (
          <Card>
            <CardContent className="flex items-center">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Zap className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Free Registrations</p>
                  <p className="text-lg font-semibold">{userPlan.freeRegistrationsUsed} / {userPlan.freeRegistrationsEarned}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

       <Card>
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
              <CardDescription>
                Your recent transactions and billing activity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading.history ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8">
                        <span className="flex items-center justify-center gap-2 text-muted-foreground">
                          <svg className="animate-spin h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                          </svg>
                          Loading billing history...
                        </span>
                      </TableCell>
                    </TableRow>
                  ) : (
                    billingHistory.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-muted-foreground">No billing history found.</TableCell>
                      </TableRow>
                    ) : (
                      billingHistory.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              {getTransactionIcon(transaction.type)}
                              {new Date(transaction.date).toLocaleDateString()}
                            </div>
                          </TableCell>
                          <TableCell>{transaction.description}</TableCell>
                          <TableCell>
                            <span className={transaction.amount < 0 ? 'text-red-600' : transaction.amount > 0 ? 'text-green-600' : 'text-muted-foreground'}>
                              {transaction.amount === 0 ? 'Free' : `${transaction.amount < 0 ? '-' : '+'}${formatCurrency(Math.abs(transaction.amount))}`}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={getStatusColor(transaction.status)}>
                              {transaction.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    )
                  )}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              {/* Pagination Controls */}
              {pagination.totalPages > 0 && (
                <div className="md:flex items-center justify-between w-full">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>
                      Showing {pagination.offset + 1} to{' '}
                      {Math.min(pagination.offset + pagination.itemsPerPage, pagination.totalItems)} of{' '}
                      {pagination.totalItems} transactions
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-3 md:mt-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={goToPrevPage}
                      disabled={!pagination.hasPrevPage || isLoading.history}
                    >
                      {isLoading.history ? (
                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                        </svg>
                      ) : (
                        <ChevronLeft className="h-4 w-4" />
                      )}
                      Previous
                    </Button>
                    
                    <div className="hidden md:flex items-center gap-1">
                      {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                        let pageNum;
                        if (pagination.totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (pagination.currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (pagination.currentPage >= pagination.totalPages - 2) {
                          pageNum = pagination.totalPages - 4 + i;
                        } else {
                          pageNum = pagination.currentPage - 2 + i;
                        }
                        
                        return (
                          <Button
                            key={pageNum}
                            variant={pagination.currentPage === pageNum ? "default" : "outline"}
                            size="sm"
                            onClick={() => goToPage(pageNum)}
                            disabled={isLoading.history}
                            className="w-8 h-8 p-0"
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={goToNextPage}
                      disabled={!pagination.hasNextPage || isLoading.history}
                    >
                      Next
                      {isLoading.history ? (
                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                        </svg>
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              )}
              
              <div className="flex justify-start">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => PaymentService.downloadBillingHistory()}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export History
                </Button>
              </div>
            </CardFooter>
          </Card>
     
    </>
  );
}