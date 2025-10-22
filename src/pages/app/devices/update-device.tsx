import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DeviceService from "@/services/device.service";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { IconDeviceMobile, IconAlertCircle } from "@tabler/icons-react";
import moment from "moment";
import { deviceBrands, deviceConditions, operatingSystems } from "./_lib";
import DeviceStatusSelector from "@/components/common/device/device-status-selector";
import ROUTES from "@/routes/ROUTES_CONFIG";




// --- End design constants ---

export default function UpdateDevicePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [registration, setRegistration] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<any>({});
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    async function fetchDevice() {
      setLoading(true);
      setError(null);
      try {
        const response:any = await DeviceService.getDeviceById(id!);
        if (response) {
          setRegistration(response.data.data);
          setForm(response.data?.data?.device || {});
        } else {
          setError("Device not found.");
        }
      } catch (e) {
        setError("Failed to fetch device.");
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchDevice();
  }, [id]);

  const handleChange = (field: string, value: any) => {
    setForm((prev: any) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev: any) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await DeviceService.updateDevice(id!, form);
      navigate(`${ROUTES.VIEW_DEVICE.replace(":id", id!)}`);
    } catch (e) {
      alert("Failed to update device.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading device...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;
  if (!registration) return null;

  // --- UI ---
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Main Device Information */}
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconDeviceMobile className="h-5 w-5" />
              Update Device Information
            </CardTitle>
            <CardDescription>Update the basic information about the device</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="deviceName">Device Name</Label>
                <Input
                  id="deviceName"
                  value={form.deviceName || ""}
                  onChange={e => handleChange("deviceName", e.target.value)}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="imei1">IMEI 1</Label>
                  <Input
                    id="imei1"
                    value={form.imei1 || ""}
                    onChange={e => handleChange("imei1", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="imei2">IMEI 2 (optional)</Label>
                  <Input
                    id="imei2"
                    value={form.imei2 || ""}
                    onChange={e => handleChange("imei2", e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="deviceSerial">Device Serial Number (optional)</Label>
                <Input
                  id="deviceSerial"
                  value={form.deviceSerial || ""}
                  onChange={e => handleChange("deviceSerial", e.target.value)}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="deviceBrand">Brand</Label>
                  <Select value={form.deviceBrand || ""} onValueChange={value => handleChange("deviceBrand", value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select brand" />
                    </SelectTrigger>
                    <SelectContent>
                      {deviceBrands.map((brand) => (
                        <SelectItem key={brand} value={brand.toLowerCase()}>{brand}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deviceModel">Model</Label>
                  <Input
                    id="deviceModel"
                    value={form.deviceModel || ""}
                    onChange={e => handleChange("deviceModel", e.target.value)}
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="deviceOs">Operating System</Label>
                  <Select value={form.deviceOs || ""} onValueChange={value => handleChange("deviceOs", value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select OS" />
                    </SelectTrigger>
                    <SelectContent>
                      {operatingSystems.map((os) => (
                        <SelectItem key={os} value={os.toLowerCase()}>{os}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <DeviceStatusSelector
                  value={form.deviceStatus || ""}
                  onValueChange={value => handleChange("deviceStatus", value)}
                  placeholder="Select status"
                  label="Device Status"
                  allowAllStatuses={true}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deviceCondition">Condition</Label>
                <Select value={form.deviceCondition || ""} onValueChange={value => handleChange("deviceCondition", value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    {deviceConditions.map((condition) => (
                      <SelectItem key={condition.value} value={condition.value}>
                        <Badge variant="outline" className={`bg-${condition.color}-50 text-${condition.color}-700 border-${condition.color}-200`}>
                          {condition.label}
                        </Badge>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergencyContact">Emergency Contact (optional)</Label>
                <Input
                  id="emergencyContact"
                  value={form.emergencyContact || ""}
                  onChange={e => handleChange("emergencyContact", e.target.value)}
                />
              </div>
              <Separator />
              <CardTitle className="text-base mt-4">Purchase Information</CardTitle>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="purchaseDate">Purchase Date (optional)</Label>
                  <Input
                    id="purchaseDate"
                    type="date"
                    value={form.purchaseDate ? moment(form.purchaseDate).format("YYYY-MM-DD") : ""}
                    onChange={e => handleChange("purchaseDate", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="purchasePrice">Purchase Price (optional)</Label>
                  <Input
                    id="purchasePrice"
                    type="number"
                    value={form.purchasePrice || ""}
                    onChange={e => handleChange("purchasePrice", e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="purchaseStore">Retailer/Store (optional)</Label>
                <Input
                  id="purchaseStore"
                  value={form.purchaseStore || ""}
                  onChange={e => handleChange("purchaseStore", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="purchaseNote">Additional Notes (optional)</Label>
                <Textarea
                  id="purchaseNote"
                  value={form.purchaseNote || ""}
                  onChange={e => handleChange("purchaseNote", e.target.value)}
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => navigate(-1)} disabled={submitting}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Updating..." : "Update Device"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
      {/* Summary Sidebar */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Device Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">IMEI 1:</span>
                <span className="font-mono text-xs">{form.imei1 || "—"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">IMEI 2:</span>
                <span className="font-mono text-xs">{form.imei2 || "—"}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Brand:</span>
                <span>{form.deviceBrand || "—"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Model:</span>
                <span>{form.deviceModel || "—"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Condition:</span>
                <span>{form.deviceCondition || "—"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Operating System:</span>
                <span>{form.deviceOs || "—"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Serial Number:</span>
                <span className="font-mono text-xs">{form.deviceSerial || "—"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Emergency Contact:</span>
                <span>{form.emergencyContact || "—"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Status:</span>
                <span>{form.deviceStatus || "—"}</span>
              </div>
            </div>
            <Separator />
            <p className="text-xs *:text-muted-foreground flex items-start gap-2">
              <IconAlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span className="sr-only">Alert:</span>
              <span>
                Make sure the IMEI number and device status are correct as they are critical for tracking and compliance. Device status can be updated later if needed.
              </span>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
