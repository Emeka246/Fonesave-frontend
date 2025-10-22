import * as React from "react"
import { UserTable } from "@/components/common/admin/user-table"
import { UserStatsCards } from "@/components/common/admin/user-stats"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { IconRefresh, IconDownload } from "@tabler/icons-react"
import { toast } from "sonner"
import { format } from "date-fns"
import { AdminUserService, User, UserStats } from "@/services/admin-user.service"

// User filters interface (redefined for local state)
interface LocalUserFilters {
  page?: number;
  limit?: number;
  role?: string;
  status?: string;
  query?: string;
  isEmailVerified?: boolean;
  hasDevices?: boolean;
  startDate?: string;
  endDate?: string;
}

export default function AdminUsersPage() {
  // State management
  const [users, setUsers] = React.useState<User[]>([])
  const [stats, setStats] = React.useState<UserStats>({
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    deletedUsers: 0,
    usersByRole: {
      USER: 0,
      ADMIN: 0,
      AGENT: 0
    },
    verifiedUsers: 0,
    unverifiedUsers: 0,
    registeredToday: 0,
    registeredThisMonth: 0,
    usersWithDevices: 0,
    averageBalance: 0
  })
  const [filters, setFilters] = React.useState<LocalUserFilters>({
    page: 1,
    limit: 25,
    role: 'all',
    status: 'all',
    query: '',
    isEmailVerified: undefined,
    hasDevices: undefined
  })
  const [totalCount, setTotalCount] = React.useState(0)
  const [isLoading, setIsLoading] = React.useState(false)
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null)
  const [isUserModalOpen, setIsUserModalOpen] = React.useState(false)

  // Load users data
  const loadUsers = React.useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await AdminUserService.getAllUsers(filters)
      let _response = response.data as any
      setUsers(_response.data || [])
      setTotalCount(_response.pagination?.total || 0)
    } catch (error) {
      console.error('Error loading users:', error)
      toast.error('Failed to load users')
    } finally {
      setIsLoading(false)
    }
  }, [filters])

  // Load statistics
  const loadStats = React.useCallback(async () => {
    try {
      const response = await AdminUserService.getUserStatistics()
      let _response = response.data as any
      setStats(_response.data || {
        totalUsers: 0,
        activeUsers: 0,
        inactiveUsers: 0,
        deletedUsers: 0,
        usersByRole: { USER: 0, ADMIN: 0, AGENT: 0 },
        verifiedUsers: 0,
        unverifiedUsers: 0,
        registeredToday: 0,
        registeredThisMonth: 0,
        usersWithDevices: 0,
        averageBalance: 0
      })
    } catch (error) {
      console.error('Error loading user statistics:', error)
      toast.error('Failed to load user statistics')
    }
  }, [])

  // Load data on component mount and when filters change
  React.useEffect(() => {
    loadUsers()
  }, [loadUsers])

  React.useEffect(() => {
    loadStats()
  }, [loadStats])

  // Handle filter changes
  const handleFilterChange = (newFilters: Partial<LocalUserFilters>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: 1 // Reset to first page when filters change
    }))
  }

  // Handle pagination
  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }))
  }

  // Handle user selection
  const handleViewUser = (user: User) => {
    setSelectedUser(user)
    setIsUserModalOpen(true)
  }

  // Handle user role update
  const handleUpdateUserRole = async (userId: string, role: User['role']) => {
    try {
      await AdminUserService.updateUserRole(userId, role)
      toast.success('User role updated successfully')
      loadUsers() // Refresh the list
    } catch (error) {
      console.error('Error updating user role:', error)
      toast.error('Failed to update user role')
    }
  }

  // Handle email verification toggle
  const handleToggleEmailVerification = async (userId: string) => {
    try {
      await AdminUserService.toggleEmailVerification(userId)
      toast.success('Email verification status updated')
      loadUsers() // Refresh the list
    } catch (error) {
      console.error('Error toggling email verification:', error)
      toast.error('Failed to update email verification status')
    }
  }

  // Handle user deletion
  const handleDeleteUser = async (userId: string) => {
    try {
      await AdminUserService.deleteUser(userId)
      toast.success('User deleted successfully')
      loadUsers() // Refresh the list
    } catch (error) {
      console.error('Error deleting user:', error)
      toast.error('Failed to delete user')
    }
  }

  // Handle user restoration
  const handleRestoreUser = async (userId: string) => {
    try {
      await AdminUserService.restoreUser(userId)
      toast.success('User restored successfully')
      loadUsers() // Refresh the list
    } catch (error) {
      console.error('Error restoring user:', error)
      toast.error('Failed to restore user')
    }
  }

  // Handle refresh
  const handleRefresh = () => {
    loadUsers()
    loadStats()
  }

  // Handle export
  const handleExport = () => {
    toast.info('Export functionality coming soon')
  }

  // Format currency
  const formatAmount = (amount: number, currency: string = 'NGN') => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount)
  }

  // Format date
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy')
  }

  // Format date with time
  const formatDateTime = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy HH:mm')
  }

  // Get user initials
  const getUserInitials = (user: User) => {
    if (user.fullName) {
      return user.fullName
        .split(' ')
        .map(name => name.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2)
    }
    return user.email.charAt(0).toUpperCase()
  }

  // Get role badge variant
  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'destructive'
      case 'AGENT':
        return 'default'
      case 'USER':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  // Get status badge variant
  const getStatusBadgeVariant = (user: User) => {
    if (user.deletedAt) return 'destructive'
    if (user.lastLogin) return 'default'
    return 'secondary'
  }

  // Get status text
  const getStatusText = (user: User) => {
    if (user.deletedAt) return 'Deleted'
    if (user.lastLogin) return 'Active'
    return 'Inactive'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            Manage and monitor all registered users
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <IconRefresh className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
          >
            <IconDownload className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <UserStatsCards stats={stats} />
      
      {/* User Table */}
          <UserTable
            data={users}
        isLoading={isLoading}
        filters={filters}
        onFilterChange={handleFilterChange}
        onPageChange={handlePageChange}
            totalCount={totalCount}
            onViewUser={handleViewUser}
        onUpdateUserRole={handleUpdateUserRole}
        onToggleEmailVerification={handleToggleEmailVerification}
            onDeleteUser={handleDeleteUser}
            onRestoreUser={handleRestoreUser}
          />

      {/* User Details Modal */}
      <Dialog open={isUserModalOpen} onOpenChange={setIsUserModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              Complete information about the selected user
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <div className="space-y-6">
              {/* User Header */}
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="text-lg">
                    {getUserInitials(selectedUser)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-semibold">
                      {selectedUser.fullName || 'No Name'}
                    </h3>
                    <Badge variant={getRoleBadgeVariant(selectedUser.role)}>
                      {selectedUser.role}
                    </Badge>
                    <Badge variant={getStatusBadgeVariant(selectedUser)}>
                      {getStatusText(selectedUser)}
                    </Badge>
                    {selectedUser.isEmailVerified && (
                      <Badge variant="outline" className="text-green-600">
                        Verified
                      </Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground">{selectedUser.email}</p>
                  {selectedUser.phone && (
                    <p className="text-sm text-muted-foreground">{selectedUser.phone}</p>
                  )}
                </div>
              </div>

              <Separator />

              {/* Basic Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Account Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Email:</span>
                      <span className="font-medium">{selectedUser.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Role:</span>
                      <Badge variant={getRoleBadgeVariant(selectedUser.role)}>
                        {selectedUser.role}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <Badge variant={getStatusBadgeVariant(selectedUser)}>
                        {getStatusText(selectedUser)}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Email Verified:</span>
                      <span className={selectedUser.isEmailVerified ? 'text-green-600' : 'text-red-600'}>
                        {selectedUser.isEmailVerified ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Balance:</span>
                      <span className="font-medium">
                        {formatAmount(selectedUser.balance, selectedUser.defaultCurrency)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Currency:</span>
                      <span className="font-medium">{selectedUser.defaultCurrency}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Activity Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last Login:</span>
                      <span className="font-medium">
                        {selectedUser.lastLogin ? formatDateTime(selectedUser.lastLogin) : 'Never'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Registered:</span>
                      <span className="font-medium">
                        {formatDate(selectedUser.createdAt)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Devices:</span>
                      <span className="font-medium">
                        {selectedUser._count?.devices || 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Payments:</span>
                      <span className="font-medium">
                        {selectedUser._count?.paymentTransactions || 0}
                      </span>
                    </div>
                    {selectedUser.deletedAt && (
                  <div className="flex justify-between">
                        <span className="text-muted-foreground">Deleted:</span>
                        <span className="font-medium text-red-600">
                          {formatDateTime(selectedUser.deletedAt)}
                        </span>
                  </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Devices Section */}
              {selectedUser.devices && selectedUser.devices.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-medium mb-3">Recent Devices</h4>
                    <div className="space-y-2">
                      {selectedUser.devices.slice(0, 3).map((device) => (
                        <div key={device.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{device.deviceName}</p>
                            <p className="text-sm text-muted-foreground">
                              {formatDate(device.createdAt)}
                            </p>
                          </div>
                          <Badge variant="outline">{device.deviceStatus}</Badge>
                        </div>
                      ))}
                      {selectedUser.devices.length > 3 && (
                        <p className="text-sm text-muted-foreground text-center">
                          +{selectedUser.devices.length - 3} more devices
                        </p>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* Payment Transactions Section */}
              {selectedUser.paymentTransactions && selectedUser.paymentTransactions.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-medium mb-3">Recent Payments</h4>
                    <div className="space-y-2">
                      {selectedUser.paymentTransactions.slice(0, 3).map((transaction) => (
                        <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">
                              {formatAmount(transaction.amount, selectedUser.defaultCurrency)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {transaction.paymentType.replace('_', ' ')}
                            </p>
                          </div>
                          <div className="text-right">
                            <Badge variant={transaction.status === 'SUCCESS' ? 'default' : 'destructive'}>
                            {transaction.status}
                          </Badge>
                            <p className="text-sm text-muted-foreground">
                              {formatDate(transaction.createdAt)}
                            </p>
                          </div>
                        </div>
                      ))}
                      {selectedUser.paymentTransactions.length > 3 && (
                        <p className="text-sm text-muted-foreground text-center">
                          +{selectedUser.paymentTransactions.length - 3} more transactions
                        </p>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* Actions */}
              <Separator />
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsUserModalOpen(false)}
                >
                  Close
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleToggleEmailVerification(selectedUser.id)}
                >
                  {selectedUser.isEmailVerified ? 'Unverify Email' : 'Verify Email'}
                    </Button>
                <Button
                  variant="outline"
                  onClick={() => handleUpdateUserRole(selectedUser.id, selectedUser.role === 'USER' ? 'AGENT' : 'USER')}
                >
                  Change Role
                      </Button>
                {selectedUser.deletedAt ? (
                  <Button
                    variant="default"
                    onClick={() => handleRestoreUser(selectedUser.id)}
                  >
                    Restore User
                  </Button>
                ) : (
                  <Button
                    variant="destructive"
                    onClick={() => handleDeleteUser(selectedUser.id)}
                  >
                    Delete User
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}