import * as React from "react"
import { ColumnDef, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, ColumnFiltersState, SortingState } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent} from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { IconDotsVertical, IconEye, IconTrash, IconShield, IconAlertTriangle } from "@tabler/icons-react"
import { format } from "date-fns"

// Import Device interface from service
import { Device } from '@/services/admin-device.service';

interface DeviceTableProps {
  data: Device[]
  totalCount: number
  currentPage: number
  pageSize: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
  onStatusFilter: (status: string) => void
  onSearch: (query: string) => void
  onUpdateStatus?: (deviceId: string, status: Device['deviceStatus']) => void
  onDeleteDevice?: (deviceId: string) => void
  onViewDevice?: (device: Device) => void
  isLoading?: boolean
}

const getStatusColor = (status: Device['deviceStatus']) => {
  switch (status) {
    case 'CLEAN':
      return 'bg-green-100 text-green-800 border-green-200'
    case 'STOLEN':
      return 'bg-red-100 text-red-800 border-red-200'
    case 'LOST':
      return 'bg-orange-100 text-orange-800 border-orange-200'
    case 'BLOCKED':
      return 'bg-gray-100 text-gray-800 border-gray-200'
    case 'UNKNOWN':
      return 'bg-blue-100 text-blue-800 border-blue-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

const getStatusIcon = (status: Device['deviceStatus']) => {
  switch (status) {
    case 'CLEAN':
      return <IconShield className="h-3 w-3" />
    case 'STOLEN':
    case 'LOST':
      return <IconAlertTriangle className="h-3 w-3" />
    default:
      return null
  }
}

export function DeviceTable({
  data,
  totalCount,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
  onStatusFilter,
  onSearch,
  onUpdateStatus,
  onDeleteDevice,
  onViewDevice,
  isLoading = false
}: DeviceTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [searchQuery, setSearchQuery] = React.useState("")

  const columns: ColumnDef<Device>[] = [
    {
      accessorKey: "deviceName",
      header: "Device Name",
      cell: ({ row }) => (
        <div className="font-medium">
          {row.getValue("deviceName")}
          {row.original.deviceBrand && (
            <div className="text-sm text-muted-foreground">
              {row.original.deviceBrand} {row.original.deviceModel}
            </div>
          )}
        </div>
      ),
    },
    {
      accessorKey: "imei1",
      header: "IMEI",
      cell: ({ row }) => (
        <div className="font-mono text-sm">
          <div>{row.getValue("imei1")}</div>
          {row.original.imei2 && (
            <div className="text-muted-foreground">{row.original.imei2}</div>
          )}
        </div>
      ),
    },
    {
      accessorKey: "user",
      header: "Owner",
      cell: ({ row }) => {
        const user = row.getValue("user") as Device['user']
        return (
          <div>
            <div className="font-medium">{user?.fullName || 'N/A'}</div>
            <div className="text-sm text-muted-foreground">{user?.email}</div>
          </div>
        )
      },
    },
    {
      accessorKey: "deviceStatus",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("deviceStatus") as Device['deviceStatus']
        return (
          <Badge variant="outline" className={getStatusColor(status)}>
            {getStatusIcon(status)}
            <span className="ml-1">{status}</span>
          </Badge>
        )
      },
    },
    {
      accessorKey: "createdAt",
      header: "Registered",
      cell: ({ row }) => {
        const date = new Date(row.getValue("createdAt"))
        return (
          <div className="text-sm">
            {format(date, "MMM dd, yyyy")}
            <div className="text-muted-foreground">
              {format(date, "HH:mm")}
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "registrations",
      header: "Registration",
      cell: ({ row }) => {
        const registrations = row.getValue("registrations") as Device['registrations']
        const latestReg = registrations?.[0]
        
        if (!latestReg) {
          return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Unregistered</Badge>
        }

        const isExpired = latestReg.expiryDate && new Date(latestReg.expiryDate) < new Date()
        
        return (
          <div>
            <Badge variant="outline" className={isExpired ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}>
              {isExpired ? "Expired" : "Active"}
            </Badge>
            {latestReg.isFreeRegistration && (
              <Badge variant="outline" className="ml-1 bg-blue-100 text-blue-800">Free</Badge>
            )}
          </div>
        )
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const device = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <IconDotsVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onViewDevice?.(device)}>
                <IconEye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => onUpdateStatus?.(device.id, device.deviceStatus === 'BLOCKED' ? 'CLEAN' : 'BLOCKED')}
              >
                <IconShield className="mr-2 h-4 w-4" />
                {device.deviceStatus === 'BLOCKED' ? 'Unblock' : 'Block'} Device
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onUpdateStatus?.(device.id, 'STOLEN')}
                className="text-red-600"
              >
                <IconAlertTriangle className="mr-2 h-4 w-4" />
                Mark as Stolen
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => onDeleteDevice?.(device.id)}
                className="text-red-600"
              >
                <IconTrash className="mr-2 h-4 w-4" />
                Delete Device
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      columnFilters,
    },
  })

  const handleSearch = (value: string) => {
    setSearchQuery(value)
    onSearch(value)
  }

  const totalPages = Math.ceil(totalCount / pageSize)

  return (
    <Card>
      <CardContent>
        {/* Filters */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1">
            <Label htmlFor="search" className="mb-1">Search devices</Label>
            <Input
              id="search"
              placeholder="Search by device name, IMEI, or owner..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <div>
            <Label htmlFor="status-filter" className="mb-1">Filter by status</Label>
            <Select onValueChange={onStatusFilter}>
              <SelectTrigger className="w-56">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="CLEAN">Clean</SelectItem>
                <SelectItem value="STOLEN">Stolen</SelectItem>
                <SelectItem value="LOST">Lost</SelectItem>
                <SelectItem value="BLOCKED">Blocked</SelectItem>
                <SelectItem value="UNKNOWN">Unknown</SelectItem>
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
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: pageSize }).map((_, index) => (
                  <TableRow key={index}>
                    {columns.map((_, colIndex) => (
                      <TableCell key={colIndex}>
                        <div className="h-4 bg-muted animate-pulse rounded" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No devices found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between space-x-2 mt-4">
          <div className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, totalCount)} of {totalCount} devices
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
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = currentPage <= 3 ? i + 1 : currentPage - 2 + i
                if (page > totalPages) return null
                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => onPageChange(page)}
                  >
                    {page}
                  </Button>
                )
              })}
              {totalPages > 5 && currentPage < totalPages - 2 && (
                <>
                  <span className="px-2">...</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(totalPages)}
                  >
                    {totalPages}
                  </Button>
                </>
              )}
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
