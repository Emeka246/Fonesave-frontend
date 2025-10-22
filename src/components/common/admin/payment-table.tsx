import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { IconDotsVertical, IconEye, IconRefresh, IconDownload, IconExternalLink } from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { PaymentTransaction } from "@/services/admin-payment.service"

interface PaymentTableProps {
  data: PaymentTransaction[]
  totalCount: number
  currentPage: number
  pageSize: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
  onSearch: (query: string) => void
  onStatusFilter: (status: string) => void
  onViewPayment: (payment: PaymentTransaction) => void
  onUpdatePaymentStatus: (paymentId: string, status: PaymentTransaction['status']) => void
  onDeletePayment: (paymentId: string) => void
  onDownloadReceipt: (paymentId: string) => void
  isLoading?: boolean
}

export function PaymentTable({
  data,
  totalCount,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
  onSearch,
  onStatusFilter,
  onViewPayment,
  onUpdatePaymentStatus,
  onDeletePayment,
  onDownloadReceipt,
  isLoading = false
}: PaymentTableProps) {
  const [searchQuery, setSearchQuery] = React.useState("")

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(searchQuery)
  }

  const getStatusBadge = (status: PaymentTransaction['status']) => {
    const variants = {
      SUCCESS: { variant: "default" as const, className: "bg-green-100 text-green-800 hover:bg-green-100" },
      PENDING: { variant: "secondary" as const, className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100" },
      FAILED: { variant: "destructive" as const, className: "bg-red-100 text-red-800 hover:bg-red-100" },
      CANCELLED: { variant: "outline" as const, className: "bg-gray-100 text-gray-800 hover:bg-gray-100" },
    }
    return variants[status] || variants.PENDING
  }

  const getTypeBadge = (type: PaymentTransaction['paymentType']) => {
    const variants = {
      DEVICE_REGISTRATION: { label: "Device Registration", className: "bg-blue-100 text-blue-800" },
      WALLET_FUNDING: { label: "Wallet Funding", className: "bg-purple-100 text-purple-800" },
      FREE_REGISTRATION: { label: "Free Registration", className: "bg-green-100 text-green-800" },
    }
    return variants[type] || variants.DEVICE_REGISTRATION
  }

  const formatAmount = (amount: number, currency: string = 'NGN') => {
    return `${currency === 'NGN' ? '₦' : '$'}${(amount / 100).toLocaleString()}`
  }

  const totalPages = Math.ceil(totalCount / pageSize)

  if (isLoading) {
    return (
      <Card>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div>
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-10 w-40 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div>
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-10 w-40 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
            
            <div className="border rounded-md">
              <div className="h-12 bg-gray-50 border-b"></div>
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="h-16 border-b bg-white animate-pulse">
                  <div className="flex items-center h-full px-4 gap-4">
                    <div className="h-4 w-32 bg-gray-200 rounded"></div>
                    <div className="h-4 w-24 bg-gray-200 rounded"></div>
                    <div className="h-4 w-20 bg-gray-200 rounded"></div>
                    <div className="h-4 w-16 bg-gray-200 rounded"></div>
                    <div className="h-4 w-12 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent>
        {/* Filters */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1">
            <Label htmlFor="search" className="mb-1">Search payments</Label>
            <form onSubmit={handleSearchSubmit} className="flex gap-2">
              <Input
                id="search"
                placeholder="Search by user email or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-80"
              />
              <Button type="submit" variant="outline">Search</Button>
            </form>
          </div>
          
          <div>
            <Label htmlFor="status-filter" className="mb-1">Status</Label>
            <Select onValueChange={onStatusFilter}>
              <SelectTrigger className="w-56">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="SUCCESS">Success</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="FAILED">Failed</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          
          
          <div>
            <Label htmlFor="page-size" className="mb-1">Items per page</Label>
            <Select value={pageSize.toString()} onValueChange={(value) => onPageSizeChange(Number(value))}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment Date</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-[70px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    No payments found.
                  </TableCell>
                </TableRow>
              ) : (
                data.map((payment) => (
                  <TableRow key={payment.id}>
                    
                    <TableCell>
                      <div>
                        <p className="font-medium">{payment.user?.fullName || 'Unknown User'}</p>
                        <p className="text-sm text-muted-foreground">{payment.user?.email}</p>
                      </div>
                    </TableCell>
                    
                    <TableCell className="font-medium">
                      {formatAmount(payment.amount, payment.currency)}
                    </TableCell>
                    
                    <TableCell>
                      <Badge variant="outline" className={getTypeBadge(payment.paymentType).className}>
                        {getTypeBadge(payment.paymentType).label}
                      </Badge>
                    </TableCell>
                    
                    <TableCell>
                      <Badge 
                        variant={getStatusBadge(payment.status).variant}
                        className={getStatusBadge(payment.status).className}
                      >
                        {payment.status}
                      </Badge>
                    </TableCell>
                    
                    <TableCell>
                      {payment.paidAt ? (
                        <div>
                          <p>{format(new Date(payment.paidAt), 'MMM dd, yyyy')}</p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(payment.paidAt), 'hh:mm a')}
                          </p>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    
                    <TableCell>
                      <div>
                        <p>{format(new Date(payment.createdAt), 'MMM dd, yyyy')}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(payment.createdAt), 'hh:mm a')}
                        </p>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <IconDotsVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onViewPayment(payment)}>
                            <IconEye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          
                          {payment.status === 'PENDING' && (
                            <>
                              <DropdownMenuItem onClick={() => onUpdatePaymentStatus(payment.id, 'SUCCESS')}>
                                <IconRefresh className="mr-2 h-4 w-4" />
                                Mark as Success
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => onUpdatePaymentStatus(payment.id, 'FAILED')}>
                                <IconRefresh className="mr-2 h-4 w-4" />
                                Mark as Failed
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                            </>
                          )}
                          
                          {payment.status === 'SUCCESS' && (
                            <DropdownMenuItem onClick={() => onDownloadReceipt(payment.id)}>
                              <IconDownload className="mr-2 h-4 w-4" />
                              Download Receipt
                            </DropdownMenuItem>
                          )}
                          
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => onDeletePayment(payment.id)}
                            className="text-red-600 focus:text-red-600"
                          >
                            <IconRefresh className="mr-2 h-4 w-4" />
                            Delete Payment
                          </DropdownMenuItem>
                          
                          {payment.paystackReference && (
                            <DropdownMenuItem 
                              onClick={() => window.open(`https://dashboard.paystack.com/#/transactions/${payment.paystackReference}`, '_blank')}
                            >
                              <IconExternalLink className="mr-2 h-4 w-4" />
                              View on Paystack
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between space-x-2 mt-4">
          <div className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, totalCount)} of {totalCount} payments
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
            >
              Previous
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNumber = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i
                if (pageNumber > totalPages) return null
                
                return (
                  <Button
                    key={pageNumber}
                    variant={currentPage === pageNumber ? "default" : "outline"}
                    size="sm"
                    onClick={() => onPageChange(pageNumber)}
                    className="w-8 h-8 p-0"
                  >
                    {pageNumber}
                  </Button>
                )
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
