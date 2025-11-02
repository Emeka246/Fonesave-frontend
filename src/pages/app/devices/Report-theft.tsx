import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DeviceService from "@/services/device.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import {
  IconShield,
  IconAlertTriangle,
  IconPhone,
  IconCalendar,
  IconUser,
  IconFileText,
  IconSearch,
  IconExclamationCircle,
  IconCheck,
  IconLoader2,
  IconAlertCircle,
} from "@tabler/icons-react";

interface TheftReportData {
  imei: string;
  deviceBrand: string;
  deviceModel: string;
  deviceColor: string;
  deviceStatus: string;
  incidentDate: string;
  incidentTime: string;
  location: string;
  circumstances: string;
  policeReportNumber: string;
  reportingOfficer: string;
  policeStation: string;
  reporterName: string;
  reporterPhone: string;
  reporterEmail: string;
  reporterAddress: string;
  witnessName: string;
  witnessPhone: string;
  additionalInfo: string;
  insuranceClaim: boolean;
  insuranceCompany: string;
  insurancePolicyNumber: string;
  notifyCarrier: boolean;
  urgentFlag: boolean;
  ownerMessage: string;
}

const initialReportData: TheftReportData = {
  imei: "",
  deviceBrand: "",
  deviceModel: "",
  deviceColor: "",
  deviceStatus: "",
  incidentDate: "",
  incidentTime: "",
  location: "",
  circumstances: "",
  policeReportNumber: "",
  reportingOfficer: "",
  policeStation: "",
  reporterName: "",
  reporterPhone: "",
  reporterEmail: "",
  reporterAddress: "",
  witnessName: "",
  witnessPhone: "",
  additionalInfo: "",
  insuranceClaim: false,
  insuranceCompany: "",
  insurancePolicyNumber: "",
  notifyCarrier: true,
  urgentFlag: false,
  ownerMessage: "",
};

const circumstanceOptions = [
  "Pickpocketing",
  "Burglary",
  "Robbery",
  "Vehicle break-in",
  "Lost in public place",
  "Stolen from workplace",
  "Stolen from home",
  "Mugging/Street theft",
  "Other",
];

export default function ReportTheftPage() {
  const navigate = useNavigate();
  const [reportData, setReportData] =
    useState<TheftReportData>(initialReportData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<
    Partial<TheftReportData> & { general?: string }
  >({});
  const [isImeiVerified, setIsImeiVerified] = useState<boolean | null>(null);
  const [existingDevice, setExistingDevice] = useState<any>(null);

  const handleInputChange = (
    field: keyof TheftReportData,
    value: string | boolean
  ) => {
    setReportData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const verifyImei = async () => {
    if (!reportData.imei || reportData.imei.length !== 15) {
      setIsImeiVerified(false);
      return;
    }

    // Simulate IMEI verification against registered devices
    setIsImeiVerified(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock device data (in real app, this would come from API)
      const mockDevice = {
        imei: reportData.imei,
        brand: "Apple",
        model: "iPhone 15 Pro",
        color: "Space Black",
        currentStatus: "Clean",
        owner: "John Doe",
      };

      setExistingDevice(mockDevice);
      setIsImeiVerified(true);

      // Pre-fill device details if found
      setReportData((prev) => ({
        ...prev,
        deviceBrand: mockDevice.brand,
        deviceModel: mockDevice.model,
        deviceColor: mockDevice.color,
      }));
    } catch (error) {
      setIsImeiVerified(false);
      setExistingDevice(null);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<TheftReportData> = {};

    // Required fields validation
    if (!reportData.imei.trim()) {
      newErrors.imei = "IMEI is required";
    } else if (!/^\d{15}$/.test(reportData.imei)) {
      newErrors.imei = "IMEI must be exactly 15 digits";
    }

    if (!reportData.incidentDate) {
      newErrors.incidentDate = "Incident date is required";
    }

    if (!reportData.location.trim()) {
      newErrors.location = "Location is required";
    }

    if (!reportData.circumstances.trim()) {
      newErrors.circumstances = "Circumstances are required";
    }

    if (!reportData.reporterName.trim()) {
      newErrors.reporterName = "Reporter name is required";
    }

    if (!reportData.reporterPhone.trim()) {
      newErrors.reporterPhone = "Reporter phone is required";
    }

    if (!reportData.reporterEmail.trim()) {
      newErrors.reporterEmail = "Reporter email is required";
    }

    if (!reportData.deviceStatus.trim()) {
      newErrors.deviceStatus = "Device status is required";
    }

    if (!reportData.ownerMessage.trim()) {
      newErrors.ownerMessage = "Message for finder is required";
    }

    // Conditional validation
    if (reportData.insuranceClaim) {
      if (!reportData.insuranceCompany.trim()) {
        newErrors.insuranceCompany = "Insurance company is required";
      }
      if (!reportData.insurancePolicyNumber.trim()) {
        newErrors.insurancePolicyNumber = "Policy number is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!isImeiVerified) {
      setErrors({ imei: "Please verify the IMEI first" });
      return;
    }

    setIsSubmitting(true);

    try {
      // Find the device ID from the verified device
      if (!existingDevice?.id) {
        setErrors({ imei: "Device not found. Please verify the IMEI again." });
        return;
      }

      // Mark device with selected status and owner message
      await DeviceService.updateDeviceStatus(
        existingDevice.id,
        reportData.deviceStatus as "STOLEN" | "LOST",
        reportData.ownerMessage
      );

      // Navigate to success page or device list
      const statusText =
        reportData.deviceStatus === "STOLEN" ? "stolen" : "lost";
      navigate("/table", {
        state: {
          message: `Theft report submitted successfully. Device ${reportData.imei} has been marked as ${statusText} with your message.`,
          type: "success",
        },
      });
    } catch (error: any) {
      console.error("Error submitting theft report:", error);
      setErrors({
        general:
          error?.data?.message ||
          "Failed to submit theft report. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setReportData(initialReportData);
    setErrors({});
    setIsImeiVerified(null);
    setExistingDevice(null);
  };

  return (
    <>
      <div>
        <h1 className="text-3xl font-bold text-red-600">
          Report Device Theft/Loss
        </h1>
        <p className="text-muted-foreground">
          Report a stolen or lost device and update its status in the system
        </p>
      </div>

      {/* Emergency Alert */}
      <Alert className="border-red-200 bg-red-50">
        <IconAlertTriangle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800">
          <strong>Important:</strong> If this is an emergency, please contact
          local authorities immediately. This form is for updating device
          records and does not replace filing a police report for stolen
          devices.
        </AlertDescription>
      </Alert>

      {/* General Error Alert */}
      {errors.general && (
        <Alert className="border-red-200 bg-red-50">
          <IconAlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            {errors.general}
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Form Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Device Identification */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IconPhone className="h-5 w-5" />
                  Device Identification
                </CardTitle>
                <CardDescription>
                  Enter the IMEI of the stolen device
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="imei">IMEI Number *</Label>
                  <div className="flex gap-2">
                    <Input
                      id="imei"
                      placeholder="Enter 15-digit IMEI number"
                      value={reportData.imei}
                      onChange={(e) =>
                        handleInputChange("imei", e.target.value)
                      }
                      maxLength={15}
                      className={errors.imei ? "border-red-500" : ""}
                    />
                    <Button
                      type="button"
                      onClick={verifyImei}
                      disabled={reportData.imei.length !== 15}
                      variant="outline"
                      className="gap-2"
                    >
                      <IconSearch className="h-4 w-4" />
                      Verify
                    </Button>
                  </div>

                  {errors.imei && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <IconAlertCircle className="h-4 w-4" />
                      {errors.imei}
                    </p>
                  )}

                  {isImeiVerified === true && existingDevice && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                      <p className="text-sm text-green-800 flex items-center gap-1">
                        <IconCheck className="h-4 w-4" />
                        Device found in system: {existingDevice.brand}{" "}
                        {existingDevice.model} ({existingDevice.color})
                      </p>
                    </div>
                  )}

                  {isImeiVerified === false && (
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                      <p className="text-sm text-yellow-800 flex items-center gap-1">
                        <IconExclamationCircle className="h-4 w-4" />
                        Device not found in system. You can still proceed with
                        the report.
                      </p>
                    </div>
                  )}

                  {isImeiVerified === null && reportData.imei.length === 15 && (
                    <p className="text-sm text-blue-600 flex items-center gap-1">
                      <IconLoader2 className="h-4 w-4 animate-spin" />
                      Verifying device...
                    </p>
                  )}
                </div>

                {/* Device Details */}
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="deviceBrand">Brand</Label>
                    <Input
                      id="deviceBrand"
                      placeholder="e.g., Apple, Samsung"
                      value={reportData.deviceBrand}
                      onChange={(e) =>
                        handleInputChange("deviceBrand", e.target.value)
                      }
                      disabled={!!existingDevice}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="deviceModel">Model</Label>
                    <Input
                      id="deviceModel"
                      placeholder="e.g., iPhone 15 Pro"
                      value={reportData.deviceModel}
                      onChange={(e) =>
                        handleInputChange("deviceModel", e.target.value)
                      }
                      disabled={!!existingDevice}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="deviceColor">Color</Label>
                    <Input
                      id="deviceColor"
                      placeholder="e.g., Space Black"
                      value={reportData.deviceColor}
                      onChange={(e) =>
                        handleInputChange("deviceColor", e.target.value)
                      }
                      disabled={!!existingDevice}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Incident Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IconCalendar className="h-5 w-5" />
                  Incident Details
                </CardTitle>
                <CardDescription>
                  Provide details about when and where the theft occurred
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="incidentDate">Date of Incident *</Label>
                    <Input
                      id="incidentDate"
                      type="date"
                      value={reportData.incidentDate}
                      onChange={(e) =>
                        handleInputChange("incidentDate", e.target.value)
                      }
                      className={errors.incidentDate ? "border-red-500" : ""}
                    />
                    {errors.incidentDate && (
                      <p className="text-sm text-red-600">
                        {errors.incidentDate}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="incidentTime">Approximate Time</Label>
                    <Input
                      id="incidentTime"
                      type="time"
                      value={reportData.incidentTime}
                      onChange={(e) =>
                        handleInputChange("incidentTime", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    placeholder="Street address, city, or general area"
                    value={reportData.location}
                    onChange={(e) =>
                      handleInputChange("location", e.target.value)
                    }
                    className={errors.location ? "border-red-500" : ""}
                  />
                  {errors.location && (
                    <p className="text-sm text-red-600">{errors.location}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="circumstances">Circumstances *</Label>
                  <Select
                    value={reportData.circumstances}
                    onValueChange={(value) =>
                      handleInputChange("circumstances", value)
                    }
                  >
                    <SelectTrigger
                      className={errors.circumstances ? "border-red-500" : ""}
                    >
                      <SelectValue placeholder="Select circumstances" />
                    </SelectTrigger>
                    <SelectContent>
                      {circumstanceOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.circumstances && (
                    <p className="text-sm text-red-600">
                      {errors.circumstances}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deviceStatus">Device Status *</Label>
                  <Select
                    value={reportData.deviceStatus}
                    onValueChange={(value) =>
                      handleInputChange("deviceStatus", value)
                    }
                  >
                    <SelectTrigger
                      className={errors.deviceStatus ? "border-red-500" : ""}
                    >
                      <SelectValue placeholder="Select device status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="STOLEN">Stolen</SelectItem>
                      <SelectItem value="LOST">Lost</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.deviceStatus && (
                    <p className="text-sm text-red-600">
                      {errors.deviceStatus}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="additionalInfo">Additional Details</Label>
                  <Textarea
                    id="additionalInfo"
                    placeholder="Describe what happened in detail..."
                    value={reportData.additionalInfo}
                    onChange={(e) =>
                      handleInputChange("additionalInfo", e.target.value)
                    }
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ownerMessage">Message for Finder *</Label>
                  <Textarea
                    id="ownerMessage"
                    placeholder="Leave a message for whoever finds your phone (e.g., 'Please return my phone and get 10,000 naira reward', 'Contact me at +234...', etc.)"
                    value={reportData.ownerMessage}
                    onChange={(e) => {
                      if (e.target.value.length <= 110) {
                        handleInputChange("ownerMessage", e.target.value);
                      }
                    }}
                    rows={3}
                    maxLength={110}
                    className={errors.ownerMessage ? "border-red-500" : ""}
                  />

                  {/* Character counter */}
                  <div className="flex justify-between text-xs text-gray-500">
                    <p>
                      This message will be displayed to anyone who searches for
                      your device's IMEI number
                    </p>
                    <span>{reportData.ownerMessage.length}/110</span>
                  </div>

                  {errors.ownerMessage && (
                    <p className="text-sm text-red-600">
                      {errors.ownerMessage}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Police Report Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IconShield className="h-5 w-5" />
                  Police Report Information
                </CardTitle>
                <CardDescription>
                  If you have filed a police report, please provide the details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="policeReportNumber">
                      Police Report Number
                    </Label>
                    <Input
                      id="policeReportNumber"
                      placeholder="Report number or case ID"
                      value={reportData.policeReportNumber}
                      onChange={(e) =>
                        handleInputChange("policeReportNumber", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="policeStation">Police Station</Label>
                    <Input
                      id="policeStation"
                      placeholder="Station name or precinct"
                      value={reportData.policeStation}
                      onChange={(e) =>
                        handleInputChange("policeStation", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reportingOfficer">Reporting Officer</Label>
                  <Input
                    id="reportingOfficer"
                    placeholder="Officer name or badge number"
                    value={reportData.reportingOfficer}
                    onChange={(e) =>
                      handleInputChange("reportingOfficer", e.target.value)
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Reporter Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IconUser className="h-5 w-5" />
                  Reporter Information
                </CardTitle>
                <CardDescription>
                  Contact information for the person reporting this theft
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="reporterName">Full Name *</Label>
                    <Input
                      id="reporterName"
                      placeholder="Your full name"
                      value={reportData.reporterName}
                      onChange={(e) =>
                        handleInputChange("reporterName", e.target.value)
                      }
                      className={errors.reporterName ? "border-red-500" : ""}
                    />
                    {errors.reporterName && (
                      <p className="text-sm text-red-600">
                        {errors.reporterName}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reporterPhone">Phone Number *</Label>
                    <Input
                      id="reporterPhone"
                      placeholder="Contact phone number"
                      value={reportData.reporterPhone}
                      onChange={(e) =>
                        handleInputChange("reporterPhone", e.target.value)
                      }
                      className={errors.reporterPhone ? "border-red-500" : ""}
                    />
                    {errors.reporterPhone && (
                      <p className="text-sm text-red-600">
                        {errors.reporterPhone}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reporterEmail">Email Address *</Label>
                  <Input
                    id="reporterEmail"
                    type="email"
                    placeholder="Your email address"
                    value={reportData.reporterEmail}
                    onChange={(e) =>
                      handleInputChange("reporterEmail", e.target.value)
                    }
                    className={errors.reporterEmail ? "border-red-500" : ""}
                  />
                  {errors.reporterEmail && (
                    <p className="text-sm text-red-600">
                      {errors.reporterEmail}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reporterAddress">Address</Label>
                  <Textarea
                    id="reporterAddress"
                    placeholder="Your full address"
                    value={reportData.reporterAddress}
                    onChange={(e) =>
                      handleInputChange("reporterAddress", e.target.value)
                    }
                    rows={2}
                  />
                </div>

                {/* Witness Information */}
                <Separator />
                <div className="space-y-3">
                  <Label className="text-base font-medium">
                    Witness Information (Optional)
                  </Label>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="witnessName">Witness Name</Label>
                      <Input
                        id="witnessName"
                        placeholder="Witness full name"
                        value={reportData.witnessName}
                        onChange={(e) =>
                          handleInputChange("witnessName", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="witnessPhone">Witness Phone</Label>
                      <Input
                        id="witnessPhone"
                        placeholder="Witness phone number"
                        value={reportData.witnessPhone}
                        onChange={(e) =>
                          handleInputChange("witnessPhone", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Insurance & Options */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IconFileText className="h-5 w-5" />
                  Insurance & Additional Options
                </CardTitle>
                <CardDescription>
                  Insurance claim and notification preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Insurance Claim */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="insuranceClaim"
                      checked={reportData.insuranceClaim}
                      onCheckedChange={(checked) =>
                        handleInputChange("insuranceClaim", checked as boolean)
                      }
                    />
                    <Label
                      htmlFor="insuranceClaim"
                      className="text-sm font-medium"
                    >
                      I plan to file an insurance claim for this device
                    </Label>
                  </div>

                  {reportData.insuranceClaim && (
                    <div className="ml-6 space-y-4 p-4 bg-gray-50 rounded-md">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="insuranceCompany">
                            Insurance Company *
                          </Label>
                          <Input
                            id="insuranceCompany"
                            placeholder="Insurance company name"
                            value={reportData.insuranceCompany}
                            onChange={(e) =>
                              handleInputChange(
                                "insuranceCompany",
                                e.target.value
                              )
                            }
                            className={
                              errors.insuranceCompany ? "border-red-500" : ""
                            }
                          />
                          {errors.insuranceCompany && (
                            <p className="text-sm text-red-600">
                              {errors.insuranceCompany}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="insurancePolicyNumber">
                            Policy Number *
                          </Label>
                          <Input
                            id="insurancePolicyNumber"
                            placeholder="Policy number"
                            value={reportData.insurancePolicyNumber}
                            onChange={(e) =>
                              handleInputChange(
                                "insurancePolicyNumber",
                                e.target.value
                              )
                            }
                            className={
                              errors.insurancePolicyNumber
                                ? "border-red-500"
                                : ""
                            }
                          />
                          {errors.insurancePolicyNumber && (
                            <p className="text-sm text-red-600">
                              {errors.insurancePolicyNumber}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Additional Options */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="notifyCarrier"
                      checked={reportData.notifyCarrier}
                      onCheckedChange={(checked) =>
                        handleInputChange("notifyCarrier", checked as boolean)
                      }
                    />
                    <Label
                      htmlFor="notifyCarrier"
                      className="text-sm font-medium"
                    >
                      Notify mobile carrier to block the device
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="urgentFlag"
                      checked={reportData.urgentFlag}
                      onCheckedChange={(checked) =>
                        handleInputChange("urgentFlag", checked as boolean)
                      }
                    />
                    <Label htmlFor="urgentFlag" className="text-sm font-medium">
                      Mark as urgent (high priority processing)
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Summary Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Report Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">IMEI:</span>
                    <span className="font-mono">{reportData.imei || "—"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Device:</span>
                    <span>
                      {reportData.deviceBrand && reportData.deviceModel
                        ? `${reportData.deviceBrand} ${reportData.deviceModel}`
                        : "—"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Color:</span>
                    <span>{reportData.deviceColor || "—"}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Incident Date:
                    </span>
                    <span>{reportData.incidentDate || "—"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Location:</span>
                    <span className="text-right text-xs">
                      {reportData.location || "—"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Circumstances:
                    </span>
                    <span className="text-xs">
                      {reportData.circumstances || "—"}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Police Report:
                    </span>
                    <span className="text-xs">
                      {reportData.policeReportNumber || "No"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Insurance:</span>
                    <span>{reportData.insuranceClaim ? "Yes" : "No"}</span>
                  </div>

                  {/* Status badges */}
                  <Separator />
                  <div className="space-y-2">
                    <span className="text-muted-foreground text-sm">
                      Options:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {reportData.notifyCarrier && (
                        <Badge
                          variant="outline"
                          className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                        >
                          Notify Carrier
                        </Badge>
                      )}
                      {reportData.urgentFlag && (
                        <Badge
                          variant="outline"
                          className="text-xs bg-red-50 text-red-700 border-red-200"
                        >
                          Urgent
                        </Badge>
                      )}
                      {!reportData.notifyCarrier && !reportData.urgentFlag && (
                        <span className="text-xs text-muted-foreground">
                          None
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Alert>
              <IconAlertTriangle className="h-4 w-4" />
              <AlertDescription>
                This report will immediately change the device status to
                "Stolen" and may trigger notifications to carriers and
                authorities.
              </AlertDescription>
            </Alert>
          </div>
        </div>

        {/* Form Actions */}
        <Card>
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              disabled={isSubmitting}
            >
              Reset Form
            </Button>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate(-1)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  isSubmitting ||
                  !reportData.imei ||
                  !reportData.incidentDate ||
                  !reportData.location
                }
                className="gap-2 bg-red-600 hover:bg-red-700"
              >
                {isSubmitting && (
                  <IconLoader2 className="h-4 w-4 animate-spin" />
                )}
                {isSubmitting ? "Submitting Report..." : "Submit Theft Report"}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </form>
    </>
  );
}
