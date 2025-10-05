import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { IconDotsVertical, IconEye, IconEdit, IconTrash, IconMail, IconRestore } from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { User } from "@/services/admin-user.service"

interface UserFilters {
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

interface UserTableProps {
  data: User[]
  totalCount: number
  isLoading?: boolean
  filters: UserFilters
  onFilterChange: (filters: Partial<UserFilters>) => void
  onPageChange: (page: number) => void
  onViewUser: (user: User) => void
  onUpdateUserRole: (userId: string, role: User['role']) => void
  onToggleEmailVerification: (userId: string) => void
  onDeleteUser: (userId: string) => void
  onRestoreUser: (userId: string) => void
}

export function UserTable({
  data,
  totalCount,
  isLoading = false,
  filters,
  onFilterChange,
  onPageChange,
  onViewUser,
  onUpdateUserRole,
  onToggleEmailVerification,
  onDeleteUser,
  onRestoreUser
}: UserTableProps) {
  const [searchQuery, setSearchQuery] = React.useState(filters.query || "")

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onFilterChange({ query: searchQuery })
  }

  const handleRoleFilter = (role: string) => {
    onFilterChange({ role })
  }

  const handleStatusFilter = (status: string) => {
    onFilterChange({ status })
  }

  const handleEmailVerificationFilter = (verified: string) => {
    if (verified === 'all') {
      onFilterChange({ isEmailVerified: undefined })
    } else {
      onFilterChange({ isEmailVerified: verified === 'verified' })
    }
  }

  const handleDevicesFilter = (hasDevices: string) => {
    if (hasDevices === 'all') {
      onFilterChange({ hasDevices: undefined })
    } else {
      onFilterChange({ hasDevices: hasDevices === 'with_devices' })
    }
  }

  // Calculate pagination
  const currentPage = filters.page || 1
  const pageSize = filters.limit || 25
  const totalPages = Math.ceil(totalCount / pageSize)
  const startIndex = (currentPage - 1) * pageSize + 1
  const endIndex = Math.min(currentPage * pageSize, totalCount)

  // Format currency
  const formatAmount = (amount: number, currency: string = 'NGN') => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount)
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
    <Card>
      <CardContent className="p-6">
        {/* Filters */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search" className="mb-1">Search users</Label>
              <form onSubmit={handleSearchSubmit} className="flex gap-2">
                <Input
                  id="search"
                  placeholder="Search by email, name, or phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-80"
                />
                <Button type="submit" variant="outline">Search</Button>
              </form>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="min-w-[150px]">
              <Label className="mb-1">Role</Label>
              <Select value={filters.role || 'all'} onValueChange={handleRoleFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="USER">Users</SelectItem>
                  <SelectItem value="AGENT">Agents</SelectItem>
                  <SelectItem value="ADMIN">Admins</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="min-w-[150px]">
              <Label className="mb-1">Status</Label>
              <Select value={filters.status || 'all'} onValueChange={handleStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="deleted">Deleted</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="min-w-[150px]">
              <Label className="mb-1">Email Verification</Label>
              <Select 
                value={filters.isEmailVerified === undefined ? 'all' : filters.isEmailVerified ? 'verified' : 'unverified'} 
                onValueChange={handleEmailVerificationFilter}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="unverified">Unverified</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="min-w-[150px]">
              <Label className="mb-1">Devices</Label>
              <Select 
                value={filters.hasDevices === undefined ? 'all' : filters.hasDevices ? 'with_devices' : 'without_devices'} 
                onValueChange={handleDevicesFilter}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="with_devices">With Devices</SelectItem>
                  <SelectItem value="without_devices">Without Devices</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead>Devices</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-[70px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    Loading users...
                  </TableCell>
                </TableRow>
              ) : data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                data.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      <div>
                        <p className="font-medium">{user.fullName || 'No Name'}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        {user.phone && (
                          <p className="text-xs text-muted-foreground">{user.phone}</p>
                        )}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <Badge variant={getRoleBadgeVariant(user.role)}>
                        {user.role}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <Badge variant={getStatusBadgeVariant(user)}>
                          {getStatusText(user)}
                        </Badge>
                        {user.isEmailVerified && (
                          <Badge variant="outline" className="text-green-600 text-xs">
                            Verified
                          </Badge>
                        )}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div>
                        <p className="font-medium">
                          {formatAmount(user.balance, user.defaultCurrency)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {user.defaultCurrency}
                        </p>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="text-center">
                        <p className="font-medium">{user._count?.devices || 0}</p>
                        <p className="text-xs text-muted-foreground">devices</p>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div>
                        {user.lastLogin ? (
                          <p className="text-sm">
                            {format(new Date(user.lastLogin), 'MMM dd, yyyy')}
                          </p>
                        ) : (
                          <p className="text-sm text-muted-foreground">Never</p>
                        )}
                      </div>
                    </TableCell>

                    <TableCell>
                      <p className="text-sm">
                        {format(new Date(user.createdAt), 'MMM dd, yyyy')}
                      </p>
                    </TableCell>

                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <IconDotsVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onViewUser(user)}>
                            <IconEye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onUpdateUserRole(user.id, user.role === 'USER' ? 'AGENT' : 'USER')}>
                            <IconEdit className="mr-2 h-4 w-4" />
                            Change Role
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onToggleEmailVerification(user.id)}>
                            <IconMail className="mr-2 h-4 w-4" />
                            {user.isEmailVerified ? 'Unverify Email' : 'Verify Email'}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {user.deletedAt ? (
                            <DropdownMenuItem onClick={() => onRestoreUser(user.id)}>
                              <IconRestore className="mr-2 h-4 w-4" />
                              Restore User
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem 
                              onClick={() => onDeleteUser(user.id)}
                              className="text-red-600"
                            >
                              <IconTrash className="mr-2 h-4 w-4" />
                              Delete User
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
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Showing {startIndex} to {endIndex} of {totalCount} users
            </div>
            <div className="flex items-center gap-2">
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
                  const page = i + 1
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => onPageChange(page)}
                      className="w-8 h-8 p-0"
                    >
                      {page}
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
        )}
      </CardContent>
    </Card>
  )
}