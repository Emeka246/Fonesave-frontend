import * as React from "react"
import { DeviceTable } from "@/components/common/admin/device-table"
import { DeviceStatsCards } from "@/components/common/admin/device-stats"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { IconRefresh, IconDownload } from "@tabler/icons-react"
import { toast } from "sonner"
import { format } from "date-fns"
import { AdminDeviceService, Device as ServiceDevice, DeviceStats, DeviceFilters } from "@/services/admin-device.service"

// Use the service Device type
type Device = ServiceDevice;

// Device filters interface (redefined for local state)
interface LocalDeviceFilters {
  page?: number;
  limit?: number;
  status?: string;
  query?: string;
}




export default function AdminDevicesPage() {
  // State management
  const [devices, setDevices] = React.useState<Device[]>([])
  const [stats, setStats] = React.useState<DeviceStats>({
    totalDevices: 0,
    cleanDevices: 0,
    stolenDevices: 0,
    lostDevices: 0,
    blockedDevices: 0,
    unknownDevices: 0,
    registeredThisMonth: 0,
    registeredToday: 0,
  })
  const [totalCount, setTotalCount] = React.useState(0)
  const [currentPage, setCurrentPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(25)
  const [isLoading, setIsLoading] = React.useState(true)
  const [isStatsLoading, setIsStatsLoading] = React.useState(true)
  const [selectedDevice, setSelectedDevice] = React.useState<Device | null>(null)
  const [isDeviceModalOpen, setIsDeviceModalOpen] = React.useState(false)
  
  // Filter state
  const [filters, setFilters] = React.useState<LocalDeviceFilters>({
    page: 1,
    limit: 25,
    status: 'all',
    query: '',
  })

  // Load devices data
  const loadDevices = React.useCallback(async () => {
    try {
      setIsLoading(true)
      
      const apiFilters: DeviceFilters = {
        page: filters.page,
        limit: filters.limit,
        status: filters.status !== 'all' ? filters.status : undefined,
        query: filters.query || undefined
      }
      
      const response = await AdminDeviceService.getAllDevices(apiFilters)
      
      console.log(response.data)
      let _response = response.data as any
      if (_response.success && _response.data) {
        setDevices(_response?.data || [])
        setTotalCount(_response?.pagination?.total || 0)
      } else {
        throw new Error(_response.message || 'Failed to load devices')
      }
    } catch (error: any) {
      console.error("Error loading devices:", error)
      toast.error(error.message || "Failed to load devices")
    } finally {
      setIsLoading(false)
    }
  }, [filters])

  // Load statistics
  const loadStats = React.useCallback(async () => {
    try {
      setIsStatsLoading(true)
      
      const response = await AdminDeviceService.getDeviceStatistics()
      
      let _response = response.data as any
      console.log("success:",_response.data)
      if (_response.success && _response.data) {
        setStats(_response.data)
      } else {
        throw new Error(_response.message || 'Failed to load device statistics')
      }
    } catch (error: any) {
      console.error("Error loading device statistics:", error)
      toast.error(error.message || "Failed to load device statistics")
    } finally {
      setIsStatsLoading(false)
    }
  }, [])

  // Load data on mount and filter changes
  React.useEffect(() => {
    loadDevices()
  }, [loadDevices])

  React.useEffect(() => {
    loadStats()
  }, [loadStats])

  // Event handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    setFilters(prev => ({ ...prev, page }))
  }

  const handlePageSizeChange = (size: number) => {
    setPageSize(size)
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

  const handleUpdateStatus = async (deviceId: string, newStatus: Device['deviceStatus']) => {
    try {
      const response = await AdminDeviceService.updateDeviceStatus(deviceId, newStatus)
      
      if (response.data.success) {
        toast.success(`Device status updated to ${newStatus}`)
        loadDevices()
        loadStats()
      } else {
        throw new Error(response.data.message || 'Failed to update device status')
      }
    } catch (error: any) {
      console.error("Error updating device status:", error)
      toast.error(error.message || "Failed to update device status")
    }
  }

  const handleDeleteDevice = async (deviceId: string) => {
    if (!confirm("Are you sure you want to delete this device? This action cannot be undone.")) {
      return
    }

    try {
      const response = await AdminDeviceService.deleteDevice(deviceId)
      
      if (response.data.success) {
        toast.success("Device deleted successfully")
        loadDevices()
        loadStats()
      } else {
        throw new Error(response.data.message || 'Failed to delete device')
      }
    } catch (error: any) {
      console.error("Error deleting device:", error)
      toast.error(error.message || "Failed to delete device")
    }
  }

  const handleViewDevice = (device: Device) => {
    setSelectedDevice(device)
    setIsDeviceModalOpen(true)
  }

  const handleRefresh = () => {
    loadDevices()
    loadStats()
    toast.success("Data refreshed")
  }

  const handleExport = () => {
    toast.info("Export functionality coming soon")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight mb-1">Device Management</h1>
          <p className="text-muted-foreground text-xs">
            Monitor and manage all registered devices in the system
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleRefresh}>
            <IconRefresh className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <IconDownload className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <DeviceStatsCards stats={stats} isLoading={isStatsLoading} />

     

      {/* Device Table */}
      <DeviceTable
        data={devices}
        totalCount={totalCount}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        onStatusFilter={handleStatusFilter}
        onSearch={handleSearch}
        onUpdateStatus={handleUpdateStatus}
        onDeleteDevice={handleDeleteDevice}
        onViewDevice={handleViewDevice}
        isLoading={isLoading}
      />

      {/* Device Details Modal */}
      <Dialog open={isDeviceModalOpen} onOpenChange={setIsDeviceModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Device Details</DialogTitle>
            <DialogDescription>
              Complete information about {selectedDevice?.deviceName}
            </DialogDescription>
          </DialogHeader>
          
          {selectedDevice && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Device Information</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">Name:</span> {selectedDevice.deviceName}
                    </div>
                    <div>
                      <span className="font-medium">Brand:</span> {selectedDevice.deviceBrand || 'N/A'}
                    </div>
                    <div>
                      <span className="font-medium">Model:</span> {selectedDevice.deviceModel || 'N/A'}
                    </div>
                    <div>
                      <span className="font-medium">OS:</span> {selectedDevice.deviceOs || 'N/A'}
                    </div>
                    <div>
                      <span className="font-medium">Serial:</span> {selectedDevice.deviceSerial || 'N/A'}
                    </div>
                    <div>
                      <span className="font-medium">Condition:</span> {selectedDevice.deviceCondition || 'N/A'}
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Owner Information</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">Name:</span> {selectedDevice.user?.fullName || 'N/A'}
                    </div>
                    <div>
                      <span className="font-medium">Email:</span> {selectedDevice.user?.email || 'N/A'}
                    </div>
                    <div>
                      <span className="font-medium">Role:</span> {selectedDevice.user?.role || 'N/A'}
                    </div>
                    <div>
                      <span className="font-medium">Emergency Contact:</span> {selectedDevice.emergencyContact || 'N/A'}
                    </div>
                  </div>
                </div>
              </div>
              <Separator />
              {/* IMEI Information */}
              <div>
                <h4 className="font-semibold mb-2">IMEI Information</h4>
                <div className="space-y-2 text-sm font-mono">
                  <div>
                    <span className="font-medium">Primary IMEI:</span> {selectedDevice.imei1}
                  </div>
                  {selectedDevice.imei2 && (
                    <div>
                      <span className="font-medium">Secondary IMEI:</span> {selectedDevice.imei2}
                    </div>
                  )}
                </div>
              </div>
              <Separator />
              {/* Status and Purchase Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Status</h4>
                  <Badge className={`${selectedDevice.deviceStatus === 'CLEAN' ? 'bg-green-100 text-green-800' : 
                    selectedDevice.deviceStatus === 'STOLEN' ? 'bg-red-100 text-red-800' :
                    selectedDevice.deviceStatus === 'LOST' ? 'bg-orange-100 text-orange-800' :
                    selectedDevice.deviceStatus === 'BLOCKED' ? 'bg-gray-100 text-gray-800' :
                    'bg-blue-100 text-blue-800'}`}>
                    {selectedDevice.deviceStatus}
                  </Badge>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Registration</h4>
                  <div className="text-sm">
                    <div>
                      <span className="font-medium">Date:</span> {format(new Date(selectedDevice.createdAt), "PPP")}
                    </div>
                    <div>
                      <span className="font-medium">Time:</span> {format(new Date(selectedDevice.createdAt), "pp")}
                    </div>
                  </div>
                </div>
              </div>

              {/* Purchase Information */}
              {(selectedDevice.purchaseDate || selectedDevice.purchasePrice || selectedDevice.purchaseStore) && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-semibold mb-2">Purchase Information</h4>
                    <div className="space-y-2 text-sm">
                      {selectedDevice.purchaseDate && (
                        <div>
                          <span className="font-medium">Date:</span> {format(new Date(selectedDevice.purchaseDate), "PPP")}
                        </div>
                      )}
                      {selectedDevice.purchasePrice && (
                        <div>
                          <span className="font-medium">Price:</span> ₦{selectedDevice.purchasePrice.toLocaleString()}
                        </div>
                      )}
                      {selectedDevice.purchaseStore && (
                        <div>
                          <span className="font-medium">Store:</span> {selectedDevice.purchaseStore}
                        </div>
                      )}
                      {selectedDevice.purchaseNote && (
                        <div>
                          <span className="font-medium">Notes:</span> {selectedDevice.purchaseNote}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* Registration Details */}
              {selectedDevice.registrations && selectedDevice.registrations.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-semibold mb-2">Registration Details</h4>
                    {selectedDevice.registrations.map((reg, index) => (
                      <div key={index} className="space-y-2 text-sm border rounded p-3">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Registration #{index + 1}</span>
                          <Badge variant={reg.isFreeRegistration ? "secondary" : "default"}>
                            {reg.isFreeRegistration ? "Free" : "Paid"}
                          </Badge>
                        </div>
                        <div>
                          <span className="font-medium">Type:</span> {reg.registrationType}
                        </div>
                        <div>
                          <span className="font-medium">Date:</span> {format(new Date(reg.createdAt), "PPP")}
                        </div>
                        {reg.expiryDate && (
                          <div>
                            <span className="font-medium">Expires:</span> {format(new Date(reg.expiryDate), "PPP")}
                          </div>
                        )}
                        <div>
                          <span className="font-medium">Account Created:</span> {reg.accountCreated ? "Yes" : "No"}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
