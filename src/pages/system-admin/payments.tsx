import * as React from "react"
import { PaymentTable } from "@/components/common/admin/payment-table"
import { PaymentStatsCards } from "@/components/common/admin/payment-stats"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { IconRefresh, IconDownload, IconExternalLink, IconCreditCard } from "@tabler/icons-react"
import { toast } from "sonner"
import { format } from "date-fns"
import { AdminPaymentService, PaymentTransaction, PaymentStats, PaymentFilters } from "@/services/admin-payment.service"

// Payment filters interface (redefined for local state)
interface LocalPaymentFilters {
  page?: number;
  limit?: number;
  status?: string;
  type?: string;
  query?: string;
  startDate?: string;
  endDate?: string;
}

export default function AdminPaymentsPage() {
  // State management
  const [payments, setPayments] = React.useState<PaymentTransaction[]>([])
  const [stats, setStats] = React.useState<PaymentStats>({
    totalTransactions: 0,
    successfulTransactions: 0,
    pendingTransactions: 0,
    failedTransactions: 0,
    cancelledTransactions: 0,
    totalRevenue: 0,
    todayRevenue: 0,
    monthlyRevenue: 0,
    averageTransactionValue: 0,
  })
  const [totalCount, setTotalCount] = React.useState(0)
  const [currentPage, setCurrentPage] = React.useState(1)
  const [isLoading, setIsLoading] = React.useState(false)
  const [isStatsLoading, setIsStatsLoading] = React.useState(false)
  const [selectedPayment, setSelectedPayment] = React.useState<PaymentTransaction | null>(null)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = React.useState(false)
  
  const [filters, setFilters] = React.useState<LocalPaymentFilters>({
    page: 1,
    limit: 25,
    status: 'all',
    type: 'all',
    query: '',
  })

  // Load payments data
  const loadPayments = React.useCallback(async () => {
    try {
      setIsLoading(true)
      
      const apiFilters: PaymentFilters = {
        page: filters.page,
        limit: filters.limit,
        status: filters.status !== 'all' ? filters.status : undefined,
        type: filters.type !== 'all' ? filters.type : undefined,
        query: filters.query || undefined,
        startDate: filters.startDate,
        endDate: filters.endDate
      }
      
      const response= await AdminPaymentService.getAllPayments(apiFilters)
      let _response = response.data as any
      
      if (_response.success && _response.data) {
        setPayments(_response.data)
        setTotalCount(_response.pagination.total)
      } else {
        throw new Error(_response.message || 'Failed to load payments')
      }
    } catch (error: any) {
      console.error("Error loading payments:", error)
      toast.error(error.message || "Failed to load payments")
    } finally {
      setIsLoading(false)
    }
  }, [filters])

  // Load statistics
  const loadStats = React.useCallback(async () => {
    try {
      setIsStatsLoading(true)
      
      const response = await AdminPaymentService.getPaymentStatistics()
      let _response = response.data as any
      if (response.data.success && response.data.data) {
        setStats(_response.data)
      } else {
        throw new Error(_response.message || 'Failed to load payment statistics')
      }
    } catch (error: any) {
      console.error("Error loading payment statistics:", error)
      toast.error(error.message || "Failed to load payment statistics")
    } finally {
      setIsStatsLoading(false)
    }
  }, [])

  // Load data on mount and filter changes
  React.useEffect(() => {
    loadPayments()
  }, [loadPayments])

  React.useEffect(() => {
    loadStats()
  }, [loadStats])

  // Event handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    setFilters(prev => ({ ...prev, page }))
  }

  const handlePageSizeChange = (size: number) => {
    setCurrentPage(1)
    setFilters(prev => ({ ...prev, limit: size, page: 1 }))
  }

  const handleStatusFilter = (status: string) => {
    setCurrentPage(1)
    setFilters(prev => ({ ...prev, status, page: 1 }))
  }

  const handleSearch = (query: string) => {
    setCurrentPage(1)
    setFilters(prev => ({ ...prev, query, page: 1 }))
  }

  const handleUpdatePaymentStatus = async (paymentId: string, newStatus: PaymentTransaction['status']) => {
    try {
      const response = await AdminPaymentService.updatePaymentStatus(paymentId, newStatus)
      
      if (response.data.success) {
        toast.success(`Payment status updated to ${newStatus}`)
        loadPayments()
        loadStats()
      } else {
        throw new Error(response.data.message || 'Failed to update payment status')
      }
    } catch (error: any) {
      console.error("Error updating payment status:", error)
      toast.error(error.message || "Failed to update payment status")
    }
  }

  const handleDownloadReceipt = async (paymentId: string) => {
    try {
      console.log("Downloading receipt for payment:", paymentId)
      // Simulate download delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      toast.success("Receipt download started")
      // In real implementation, this would trigger a file download
    } catch (error) {
      console.error("Error downloading receipt:", error)
      toast.error("Failed to download receipt")
    }
  }

  const handleDeletePayment = async (paymentId: string) => {
    if (!confirm("Are you sure you want to delete this payment? This action cannot be undone.")) {
      return
    }

    try {
      const response = await AdminPaymentService.deletePayment(paymentId)
      
      if (response.data.success) {
        toast.success("Payment deleted successfully")
        loadPayments()
        loadStats()
      } else {
        throw new Error(response.data.message || 'Failed to delete payment')
      }
    } catch (error: any) {
      console.error("Error deleting payment:", error)
      toast.error(error.message || "Failed to delete payment")
    }
  }

  const handleViewPayment = (payment: PaymentTransaction) => {
    setSelectedPayment(payment)
    setIsPaymentModalOpen(true)
  }

  const formatAmount = (amount: number, currency: string = 'NGN') => {
    return `${currency === 'NGN' ? '₦' : '$'}${(amount / 100).toLocaleString()}`
  }

  const getStatusBadge = (status: PaymentTransaction['status']) => {
    const variants = {
      SUCCESS: { variant: "default" as const, className: "bg-green-100 text-green-800" },
      PENDING: { variant: "secondary" as const, className: "bg-yellow-100 text-yellow-800" },
      FAILED: { variant: "destructive" as const, className: "bg-red-100 text-red-800" },
      CANCELLED: { variant: "outline" as const, className: "bg-gray-100 text-gray-800" },
    }
    return variants[status] || variants.PENDING
  }

  return (
    <div className="flex flex-1 flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight mb-1">Payment Management</h1>
          <p className="text-muted-foreground text-xs">
            Monitor and manage all payment transactions in the system
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => { loadPayments(); loadStats(); }}>
            <IconRefresh className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button variant="outline">
            <IconDownload className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <PaymentStatsCards stats={stats} isLoading={isStatsLoading} />
      
      {/* Revenue Chart */}
      <div className="mt-4">
      <PaymentTable
            data={payments}
            totalCount={totalCount}
            currentPage={currentPage}
            pageSize={filters.limit || 25}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            onSearch={handleSearch}
            onStatusFilter={handleStatusFilter}
            onViewPayment={handleViewPayment}
            onUpdatePaymentStatus={handleUpdatePaymentStatus}
            onDeletePayment={handleDeletePayment}
            onDownloadReceipt={handleDownloadReceipt}
            isLoading={isLoading}
          />
    
      </div>

      {/* Payment Details Modal */}
      <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <IconCreditCard className="h-5 w-5" />
              Payment Details
            </DialogTitle>
            <DialogDescription>
              Complete information about this payment transaction
            </DialogDescription>
          </DialogHeader>
          
          {selectedPayment && (
            <div className="grid gap-4 py-4">
              {/* Basic Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Transaction Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Amount:</span>
                      <span className="font-medium">{formatAmount(selectedPayment.amount, selectedPayment.currency)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <Badge 
                        variant={getStatusBadge(selectedPayment.status).variant}
                        className={getStatusBadge(selectedPayment.status).className}
                      >
                        {selectedPayment.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Type:</span>
                      <span>{selectedPayment.paymentType.replace('_', ' ')}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">User Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Name:</span>
                      <span>{selectedPayment.user?.fullName || 'Unknown'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Email:</span>
                      <span>{selectedPayment.user?.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Role:</span>
                      <span>{selectedPayment.user?.role}</span>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Paystack Information */}
              {selectedPayment.paystackReference && (
                <div>
                  <h4 className="font-medium mb-2">Paystack Information</h4>
                  <div className="space-y-2 text-sm">
                    {selectedPayment.paystackAccessCode && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Access Code:</span>
                        <span className="font-mono">{selectedPayment.paystackAccessCode}</span>
                      </div>
                    )}
                    {selectedPayment.paystackTransactionId && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Transaction ID:</span>
                        <span className="font-mono">{selectedPayment.paystackTransactionId}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <Separator />

              {/* Timestamps */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Timeline</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Created:</span>
                      <span>{format(new Date(selectedPayment.createdAt), 'PPp')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Updated:</span>
                      <span>{format(new Date(selectedPayment.updatedAt), 'PPp')}</span>
                    </div>
                    {selectedPayment.paidAt && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Paid:</span>
                        <span>{format(new Date(selectedPayment.paidAt), 'PPp')}</span>
                      </div>
                    )}
                  </div>
                </div>

                {selectedPayment.description && (
                  <div>
                    <h4 className="font-medium mb-2">Description</h4>
                    <p className="text-sm text-muted-foreground">{selectedPayment.description}</p>
                  </div>
                )}
              </div>

              {/* Device Registration Info */}
              {selectedPayment.deviceRegistration && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-medium mb-2">Device Registration</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Registration ID:</span>
                        <span className="font-mono">{selectedPayment.deviceRegistration.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Type:</span>
                        <span>{selectedPayment.deviceRegistration.registrationType}</span>
                      </div>
                      {selectedPayment.deviceRegistration.expiryDate && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Expires:</span>
                          <span>{format(new Date(selectedPayment.deviceRegistration.expiryDate), 'PPp')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* Metadata */}
              {selectedPayment.metadata && Object.keys(selectedPayment.metadata).length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-medium mb-2">Additional Information</h4>
                    <pre className="text-xs bg-gray-50 p-3 rounded-md overflow-auto">
                      {JSON.stringify(selectedPayment.metadata, null, 2)}
                    </pre>
                  </div>
                </>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-2 mt-4">
                {selectedPayment.paystackReference && (
                  <Button 
                    variant="outline" 
                    onClick={() => window.open(`https://dashboard.paystack.com/#/transactions/${selectedPayment.paystackReference}`, '_blank')}
                  >
                    <IconExternalLink className="mr-2 h-4 w-4" />
                    View on Paystack
                  </Button>
                )}
                {selectedPayment.status === 'SUCCESS' && (
                  <Button variant="outline" onClick={() => handleDownloadReceipt(selectedPayment.id)}>
                    <IconDownload className="mr-2 h-4 w-4" />
                    Download Receipt
                  </Button>
                )}
                {selectedPayment.status === 'PENDING' && (
                  <div className="flex gap-2">
                    <Button onClick={() => handleUpdatePaymentStatus(selectedPayment.id, 'SUCCESS')}>
                      <IconRefresh className="mr-2 h-4 w-4" />
                      Mark as Success
                    </Button>
                    <Button variant="outline" onClick={() => handleUpdatePaymentStatus(selectedPayment.id, 'FAILED')}>
                      <IconRefresh className="mr-2 h-4 w-4" />
                      Mark as Failed
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
