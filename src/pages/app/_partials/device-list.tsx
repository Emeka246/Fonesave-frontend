import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import DeviceService, {
  PaginationResponse,
  DevicePayload,
} from "@/services/device.service";
import {
  Smartphone,
  Eye,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Filter,
  Search,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate, useLocation } from "react-router-dom";
import { Input } from "@/components/ui/input";
import moment from "moment";
import { TransferOwnershipDialog } from "@/components/device/transfer-ownership-dialog";
import { useAuth } from "@/hooks/use-auth";
interface DeviceListProps {
  onDevicesChange?: (devices: DevicePayload[]) => void;
}

export function DeviceList({ onDevicesChange }: DeviceListProps) {
  const [devices, setDevices] = useState<DevicePayload[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [pagination, setPagination] = useState<PaginationResponse>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
    isNextPage: false,
    isPrevPage: false,
  });
  const navigate = useNavigate();
  const location = useLocation();
  const { isAgent } = useAuth();

  const fetchDevices = async (page: number = 1, status: string = "all") => {
    setLoading(true);
    try {
      const response = await DeviceService.getDevices(page, 10, status);
      const responseData = response.data as any;
      if (responseData && responseData.success) {
        setDevices(responseData.data);
        setPagination(responseData.pagination);
        if (onDevicesChange) {
          onDevicesChange(responseData.data);
        }
      }
    } catch (error) {
      console.error("Error fetching devices:", error);
      setDevices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices(currentPage, statusFilter);
  }, [currentPage, statusFilter, location.key]);

  // Refresh devices on component mount
  useEffect(() => {
    fetchDevices(1, "all");
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "CLEAN":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Clean
          </Badge>
        );
      case "STOLEN":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-green-100">
            Stolen
          </Badge>
        );
      case "LOST":
        return (
          <Badge className="bg-orange-100 text-orange-800 hover:bg-green-100">
            Lost
          </Badge>
        );
      case "BLOCKED":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-green-100">
            Blocked
          </Badge>
        );
      case "UNKNOWN":
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-green-100">
            Unknown
          </Badge>
        );

      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const renderPaginationControls = () => {
    if (pagination.totalPages <= 1) return null;

    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(pagination.totalPages, currentPage + 2);

    return (
      <div className="md:flex items-center justify-between mt-6 space-y-4 md:space-y-0">
        <div className="text-sm text-muted-foreground">
          Showing {(currentPage - 1) * pagination.limit + 1} to{" "}
          {Math.min(currentPage * pagination.limit, pagination.total)} of{" "}
          {pagination.total} devices
          {statusFilter !== "all" &&
            ` (filtered by ${statusFilter.toLowerCase()})`}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(1)}
            disabled={!pagination.isPrevPage}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={!pagination.isPrevPage}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {Array.from(
            { length: endPage - startPage + 1 },
            (_, i) => startPage + i
          ).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => handlePageChange(page)}
              className="w-8 h-8 p-0"
            >
              {page}
            </Button>
          ))}

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={!pagination.isNextPage}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pagination.totalPages)}
            disabled={!pagination.isNextPage}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };
  return (
    <>
      {/* Status Filter */}
      <div className="md:flex items-center justify-between gap-2 mb-4">
        {/* <div className="flex items-center gap-2 text-sm mt-5 mb-7 md:mb-0">
              <Smartphone className="h-5 w-5" />
                    Your Registered Devices
                </div> */}
        <div className="flex gap-4">
          <div className="space-y-2 gap-4 flex-1">
            <div className="flex items-center gap-2">
              <Search className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs font-medium">Search Input</span>
            </div>
            <Input className="w-full md:w-56" placeholder="Search devices..." />
          </div>
          <div className="space-y-2 gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs font-medium">Filter by Status</span>
            </div>
            <Select
              value={statusFilter}
              onValueChange={handleStatusFilterChange}
            >
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Devices</SelectItem>
                <SelectItem value="CLEAN">Clean</SelectItem>
                <SelectItem value="STOLEN">Stolen</SelectItem>
                <SelectItem value="LOST">Lost</SelectItem>
                <SelectItem value="BLOCKED">Blocked</SelectItem>
                <SelectItem value="UNKNOWN">Unknown</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      {loading ? (
        <Card>
          <CardContent className="text-center py-8">
            <div className="py-8 text-center text-muted-foreground">
              Loading devices...
            </div>
          </CardContent>
        </Card>
      ) : devices.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <Smartphone className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              No devices registered yet
            </h3>
            <p className="text-muted-foreground mb-4">
              Register your first device to get started with FoneOwner
              protection.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {devices.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Smartphone className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  {statusFilter === "all"
                    ? "No devices found"
                    : `No ${statusFilter.toLowerCase()} devices found`}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {statusFilter === "all"
                    ? "Try registering a new device to get started."
                    : `No devices with status "${statusFilter.toLowerCase()}" found. Try changing the filter.`}
                </p>
              </CardContent>
            </Card>
          ) : (
            devices.map((device: DevicePayload) => (
              <div
                key={device.id}
                className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="md:flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Smartphone className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{device.deviceName}</h4>
                      <p className="text-xs text-muted-foreground">
                        IMEI #1: {device.imei1}
                      </p>
                      {device.imei2 && (
                        <p className="text-xs text-muted-foreground">
                          IMEI #2: {device.imei2}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1 capitalize">
                        Brand: {device.deviceBrand || "—"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Model: {device.deviceModel || "—"}
                      </p>

                      {/* If you have a registeredDate property, use it. Otherwise, remove or replace this line. */}
                      {/* <p className="text-sm text-muted-foreground">Registered: {device.registeredDate ? new Date(device.registeredDate).toLocaleDateString() : '—'}</p> */}
                    </div>
                  </div>
                  <div className="flex  flex-col gap-3 items-end">
                    <div className="flex gap-2 mt-3 md:mt-0">
                      <Button
                        onClick={() =>
                          navigate(`/dashboard/devices/${device.id}`)
                        }
                        variant="outline"
                        size="sm"
                        className="sm:text-base text-xs"
                      >
                        <Eye className="h-4 w-4" />
                        View Details
                      </Button>
                      {!isAgent() ||
                        (!device?.registrations[0]?.ownerEmail && (
                          <TransferOwnershipDialog
                            deviceId={device.id}
                            deviceName={device.deviceName}
                            onTransferInitiated={() => fetchDevices(1, "all")}
                          />
                        ))}
                    </div>
                    {device.registrations[0] &&
                      device.registrations[0].payment && (
                        <div className="flex items-center gap-2">
                          {getStatusBadge(device.deviceStatus)}
                          {device.registrations[0].payment?.status ===
                            "SUCCESS" &&
                            moment(device.registrations[0].expiryDate).isBefore(
                              moment()
                            ) && (
                              <Badge
                                className="px-2 font-semibold"
                                variant="green"
                              >
                                Payment Paid
                              </Badge>
                            )}
                          {isAgent() &&
                            device.registrations[0].payment?.status ===
                              "PENDING" && (
                              <Badge
                                className="px-2 font-semibold"
                                variant="yellow"
                              >
                                Registration Pending
                              </Badge>
                            )}
                          {device.registrations[0].payment?.status ===
                            "FAILED" &&
                            moment(device.registrations[0].expiryDate).isBefore(
                              moment()
                            ) && (
                              <Badge
                                className="px-2 font-semibold"
                                variant="red"
                              >
                                Payment Failed
                              </Badge>
                            )}
                          {!device.registrations?.length ||
                          moment(device.registrations[0].expiryDate).isBefore(
                            moment()
                          ) ? (
                            <Badge className="px-2 font-semibold" variant="red">
                              Expired
                            </Badge>
                          ) : (
                            <Badge className="px-2" variant="outline">
                              Expiry at:{" "}
                              {moment(
                                device.registrations[0].expiryDate
                              ).format("D MMMM YYYY")}
                            </Badge>
                          )}
                        </div>
                      )}
                  </div>
                </div>
              </div>
            ))
          )}
          {devices.length > 0 && renderPaginationControls()}
        </div>
      )}
    </>
  );
}
