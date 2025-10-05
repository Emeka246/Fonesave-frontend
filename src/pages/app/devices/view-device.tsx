import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DeviceService from "@/services/device.service";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IconDeviceMobile, IconAlertTriangle } from "@tabler/icons-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import moment from "moment";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import DeviceStatusSelector from "@/components/common/device/device-status-selector";
import { TransferOwnershipDialog } from "@/components/device/transfer-ownership-dialog";

const statusColor = {
  clean: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  stolen: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  lost: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  blocked: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  unknown: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
};

export default function ViewDevicePage() {
  const { id } = useParams<{ id: string }>();
  const [registration, setRegistration] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAgent } = useAuth();
  // Theft report state
  const [showTheftReport, setShowTheftReport] = useState(false);
  const [theftStatus, setTheftStatus] = useState<string>("");
  const [ownerMessage, setOwnerMessage] = useState<string>("");
  const [ownerPhoneInput, setOwnerPhoneInput] = useState<string>("");
  const [useSendNumber, setUseSendNumber] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const fetchDevice = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await DeviceService.getDeviceById(id!);
      if (response) {
        setRegistration(response.data.data);
      } else {
        setError("Device not found.");
      }
    } catch (e) {
      console.error('Frontend fetch error:', e);
      setError("Failed to fetch device.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchDevice();
  }, [id]);

  const handleTheftReport = async () => {
    if (!theftStatus) {
      setSubmitError("Please select a status");
      return;
    }

    // Only require message for STOLEN or LOST status
    if ((theftStatus === "STOLEN" || theftStatus === "LOST") && !ownerMessage.trim()) {
      setSubmitError("Please enter a message for the finder");
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      await DeviceService.updateDeviceStatus(id!, theftStatus as 'STOLEN' | 'LOST', ownerMessage, ownerPhoneInput);

      toast.success('Device status updated successfully! Your message will be shown to anyone who searches for this device.');
      setShowTheftReport(false);
      
      // Refresh device data
      const response = await DeviceService.getDeviceById(id!);
      if (response) {
        setRegistration(response.data.data);
      }
    } catch (error: any) {
      setSubmitError(error?.data?.message || "Failed to submit theft report");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading device details...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;
  if (!registration) return null;

  // Destructure all values from API response
  const {
    registrationType,
    isFreeRegistration,
    ownerEmail,
    ownerPhone,
    accountCreated,
    expiryDate,
    createdAt,
    updatedAt,
    device = {},
    user = {},
    agent = {},
    payment = {},
  } = registration;

  const paymentStatus = payment.status === "SUCCESS" ? "paid" : "unpaid";
  const paidAt = payment.paidAt ? moment(payment.paidAt) : null;
  const expiryAt = expiryDate ? moment(expiryDate) : null;

  const ownedDevice = !isAgent() || !agent;

  return (
    <div>
      
      {/* Device details card */}
      <Card className="mb-4">
        <CardHeader className="block md:flex justify-between items-end gap-2">
                <div className="space-y-2">
                <div className="flex items-center gap-3">
                <IconDeviceMobile className="h-6 w-6 text-blue-600" />
                <CardTitle className="text-base md:text-xl font-bold">{device.deviceName || `${device.deviceBrand} ${device.deviceModel}`}</CardTitle>
                <Badge className={statusColor[(device.deviceStatus || '').toLowerCase() as keyof typeof statusColor] || "bg-gray-100 text-gray-800"}>
                  {device.deviceStatus || "—"}
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground">
                Registered: {device.createdAt ? moment(device.createdAt).format("LLL") : "—"}
                {device.updatedAt && (
                  <> &middot; Updated: {moment(device.updatedAt).format("LLL")}</>
                )}
              </div>
          </div>
            <div className="flex flex-col md:flex-row justify-end gap-2 mt-4 md:mt-0">
              {!isAgent() && (
              <TransferOwnershipDialog
                            deviceId={device.id}
                            deviceName={device.deviceName}
                            onTransferInitiated={() => fetchDevice()}
                          />
              )}
                {(ownedDevice && device.deviceStatus === "CLEAN" || device.deviceStatus === "UNKNOWN") && (
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => setShowTheftReport(true)}
                  >
                    Report Theft/Loss
                  </Button>
                )}
                {(ownedDevice && device.deviceStatus === "STOLEN" || device.deviceStatus === "LOST") && (
                  <Button 
                    variant="blue" 
                    onClick={() => setShowTheftReport(true)}
                  >
                    Update Message
                  </Button>
                )}
            </div>
        </CardHeader>
        <Separator />
        <CardContent className="space-y-6 py-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-muted-foreground text-xs">Brand</div>
              <div className="font-medium">{device.deviceBrand || "—"}</div>
            </div>
            <div>
              <div className="text-muted-foreground text-xs">Model</div>
              <div className="font-medium">{device.deviceModel || "—"}</div>
            </div>
            <div>
              <div className="text-muted-foreground text-xs">IMEI 1</div>
              <div className="font-mono text-xs">{device.imei1 || "—"}</div>
            </div>
            <div>
              <div className="text-muted-foreground text-xs">IMEI 2</div>
              <div className="font-mono text-xs">{device.imei2 || "—"}</div>
            </div>
            <div>
              <div className="text-muted-foreground text-xs">Serial Number</div>
              <div className="font-mono text-xs">{device.deviceSerial || "—"}</div>
            </div>
            <div>
              <div className="text-muted-foreground text-xs">Condition</div>
              <div className="capitalize">{device.deviceCondition || "—"}</div>
            </div>
            <div>
              <div className="text-muted-foreground text-xs">Operating System</div>
              <div>{device.deviceOs || "—"}</div>
            </div>
            <div>
              <div className="text-muted-foreground text-xs">Purchase Date</div>
              <div>{device.purchaseDate ? moment(device.purchaseDate).format("LL") : "—"}</div>
            </div>
            <div>
              <div className="text-muted-foreground text-xs">Purchase Price</div>
              <div>{device.purchasePrice ? `$${device.purchasePrice}` : "—"}</div>
            </div>
            <div>
              <div className="text-muted-foreground text-xs">Purchase Store</div>
              <div>{device.purchaseStore || "—"}</div>
            </div>
          </div>
          <Separator />
          <div>
            <div className="text-muted-foreground text-xs mb-1">Notes</div>
            <div>{device.purchaseNote || <span className="text-muted-foreground">—</span>}</div>
          </div>
          
          {/* Owner Message and Phone Display */}
          {(device.deviceStatus === "STOLEN" || device.deviceStatus === "LOST") && (device.ownerMessage || device.ownerPhone) && (
            <>
              <Separator />
              <div className="space-y-3">
                {device.ownerMessage && (
                  <div>
                    <div className="text-muted-foreground text-xs mb-2">Message for Finder</div>
                    <div className="p-3 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                      <p className="text-sm text-gray-700 dark:text-gray-300 italic">"{device.ownerMessage}"</p>
                    </div>
                  </div>
                )}
                {device.ownerPhone && (
                  <div>
                    <div className="text-muted-foreground text-xs mb-2">Contact Phone</div>
                    <div className="p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
                      <p className="text-sm text-gray-700 dark:text-gray-300 font-mono">{device.ownerPhone}</p>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>


      {/* Theft Report Dialog */}
      <Dialog open={showTheftReport} onOpenChange={setShowTheftReport}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <IconAlertTriangle className="h-5 w-5" />
              {device.deviceStatus === "STOLEN" || device.deviceStatus === "LOST" ? "Update Device Status" : "Report Device Theft/Loss"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <DeviceStatusSelector
              value={theftStatus}
              onValueChange={setTheftStatus}
              placeholder="Select status"
              label="Status *"
              error={submitError && !theftStatus ? "Please select a status" : undefined}
            />

            {/* Only show message and phone fields for STOLEN or LOST status */}
            {(theftStatus === "STOLEN" || theftStatus === "LOST") && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="ownerMessage">Message for Finder *</Label>
                  <Textarea
                    id="ownerMessage"
                    placeholder="Leave a message for whoever finds your phone (e.g., 'Please return my phone and get 10,000 naira reward', 'Contact me at +234...', etc.)"
                    value={ownerMessage}
                    onChange={(e) => setOwnerMessage(e.target.value)}
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground">
                    This message will be displayed to anyone who searches for your device's IMEI number
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ownerPhone">Owner Phone Number (Optional)</Label>
                  <Input
                    id="ownerPhone"
                    type="tel"
                    placeholder="Enter phone number for contact (e.g., +2348012345678)"
                    value={ownerPhoneInput}
                    onChange={(e) => setOwnerPhoneInput(e.target.value)}
                  />
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="useSendNumber"
                      checked={useSendNumber}
                      onCheckedChange={(checked) => {
                        setUseSendNumber(checked as boolean);
                        const phoneToUse = registrationType === 'AGENT' ? ownerPhone : user.phone;
                        if (checked && phoneToUse) {
                          setOwnerPhoneInput(phoneToUse);
                        } else if (!checked) {
                          setOwnerPhoneInput("");
                        }
                      }}
                    />
                    <Label htmlFor="useSendNumber" className="text-sm">
                      Use my registered phone number ({registrationType === 'AGENT' ? ownerPhone : user.phone || "N/A"})
                    </Label>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    This phone number will be displayed to anyone who finds your device
                  </p>
                </div>
              </>
            )}

            {submitError && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{submitError}</AlertDescription>
              </Alert>
            )}

            <div className="flex gap-2 pt-4">
              <Button
                onClick={handleTheftReport}
                disabled={submitting || !theftStatus || ((theftStatus === "STOLEN" || theftStatus === "LOST") && !ownerMessage.trim())}
                className="bg-red-600 hover:bg-red-700 flex-1"
              >
                {submitting ? "Submitting..." : "Submit Report"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowTheftReport(false);
                  setTheftStatus("");
                  setOwnerMessage("");
                  setOwnerPhoneInput("");
                  setUseSendNumber(false);
                  setSubmitError(null);
                }}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Registration, agent, user, payment info */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="text-base">Registration Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs">
          <div>
            <span className="text-muted-foreground block">Type:</span>
            <span className="font-medium block">{registrationType || "—"}</span>
          </div>
          {isAgent() && (
            <>
              <div>
                <span className="text-muted-foreground block">Free Registration:</span>
                <span className="font-medium block">{isFreeRegistration ? "Yes" : "No"}</span>
              </div>
              <div className="col-span-2">
                <span className="text-muted-foreground block">Owner Email:</span>
                <span className="font-medium block">{ownerEmail || "—"}</span>
              </div>
              <div>
                <span className="text-muted-foreground block">Owner Phone:</span>
                <span className="font-medium block">{ownerPhone || "—"}</span>
              </div>
              <div>
                <span className="text-muted-foreground block">Account Created:</span>
                <span className="font-medium block">{accountCreated ? "Yes" : "No"}</span>
              </div>
            </>
          )}
          <div>
            <span className="text-muted-foreground block">Expiry Date:</span>
            <span className="font-medium block">{expiryAt ? expiryAt.format("LLL") : "—"}</span>
          </div>
          <div>
            <span className="text-muted-foreground block">Created At:</span>
            <span className="font-medium block">{createdAt ? moment(createdAt).format("LLL") : "—"}</span>
          </div>
          <div>
            <span className="text-muted-foreground block">Updated At:</span>
            <span className="font-medium block">{updatedAt ? moment(updatedAt).format("LLL") : "—"}</span>
          </div>
        </CardContent>
      </Card>

      {agent && (
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="text-base">Agent</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1Re md:grid-cols-3 gap-4 text-xs">
            <>
              <div><span className="text-muted-foreground">Agent Email:</span> <span className="font-medium">{agent.email || "—"}</span></div>
              <div><span className="text-muted-foreground">Agent Name:</span> <span className="font-medium">{agent.fullName || "—"}</span></div>
            </>
        </CardContent>
      </Card>
      )}

      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="text-base">Payment</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs">
          <div><span className="text-muted-foreground">Amount:</span> <span className="font-medium">{payment.amount ? `${payment.amount} ${payment.currency || ''}` : "—"}</span></div>
          <div><span className="text-muted-foreground">Status:</span> <span className="font-medium">{payment.status || "—"}</span></div>
          <div><span className="text-muted-foreground">Paid At:</span> <span className="font-medium">{paidAt ? paidAt.format("LLL") : "—"}</span></div>
        </CardContent>
      </Card>

      {/* Payment warning */}
      {paymentStatus !== "paid" && (
        <Alert variant="destructive" className="flex items-center gap-2 mb-4">
          <AlertTriangle className="h-5 w-5 text-red-500" />
          <AlertTitle>Payment Pending</AlertTitle>
          <AlertDescription>
            This device registration is not paid. It will <b>not</b> be listed on public search until payment is completed.
          </AlertDescription>
        </Alert>
      )}

      {/* Ownership Transfer History */}
      {device.ownershipTransfers && device.ownershipTransfers.length > 0 && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-base">Ownership Transfer History</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {device.ownershipTransfers.map((transfer: any, index: number) => (
              <div key={transfer.id} className="border rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge 
                      className={
                        transfer.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                        transfer.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        transfer.status === 'ACCEPTED' ? 'bg-blue-100 text-blue-800' :
                        transfer.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }
                    >
                      {transfer.status}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      Transfer #{index + 1}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {moment(transfer.createdAt).format("LLL")}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">From:</span>
                    <div className="font-medium">
                      {transfer.currentOwner?.fullName || 'Unknown'}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {transfer.currentOwner?.email}
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-muted-foreground">To:</span>
                    <div className="font-medium">
                      {transfer.newOwner?.fullName || transfer.newOwnerEmail}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {transfer.newOwner?.email || transfer.newOwnerEmail}
                    </div>
                  </div>
                </div>

                {transfer.transferMessage && (
                  <div className="mt-2">
                    <span className="text-muted-foreground text-xs">Message:</span>
                    <div className="text-sm bg-gray-50 dark:bg-gray-900 p-2 rounded mt-1">
                      "{transfer.transferMessage}"
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-muted-foreground">
                  <div>
                    <span className="block">Initiated:</span>
                    <span>{moment(transfer.initiatedAt).format("MMM DD, YYYY")}</span>
                  </div>
                  {transfer.acceptedAt && (
                    <div>
                      <span className="block">Accepted:</span>
                      <span>{moment(transfer.acceptedAt).format("MMM DD, YYYY")}</span>
                    </div>
                  )}
                  {transfer.completedAt && (
                    <div>
                      <span className="block">Completed:</span>
                      <span>{moment(transfer.completedAt).format("MMM DD, YYYY")}</span>
                    </div>
                  )}
                  <div>
                    <span className="block">Expires:</span>
                    <span>{moment(transfer.expiresAt).format("MMM DD, YYYY")}</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
