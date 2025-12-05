import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAppSelector } from "@/store/hooks";
import { getCurrencySymbol } from "@/lib/utils";
import {
  deviceBrands,
  deviceConditions,
  operatingSystems,
  deviceStatuses,
} from "./_lib";
import DeviceStatusSelector from "@/components/common/device/device-status-selector";

import {
  IconDeviceMobile,
  IconAlertCircle,
  IconWallet,
  IconGift,
} from "@tabler/icons-react";
import DeviceService, {
  DeviceRegistrationPayload,
} from "@/services/device.service";
import PaymentService from "@/services/payment.service";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { ApiResponse } from "@/services";
import { cn } from "@/lib/utils";

interface DeviceFormErrors {
  imei1?: string;
  imei2?: string;
  deviceBrand?: string;
  deviceModel?: string;
  deviceCondition?: string;
  deviceOs?: string;
  deviceStatus?: string;
  deviceSerial?: string;
  purchaseDate?: string;
  purchasePrice?: number;
  purchaseStore?: string;
  purchaseNote?: string;
  notes?: string;
  emergencyContact?: string;
  ownerEmail?: string;
  ownerPhone?: string;
}

interface AgentRegistrationStats {
  totalRegistrations: number;
  paidRegistrations: number;
  freeRegistrationsEarned: number;
  freeRegistrationsUsed: number;
  hasFreeRegistrations: boolean;
  balance: number;
  nextFreeRegistrationThreshold: number;
  agent_free_registration_threshold: number;
}

const initialFormData: DeviceRegistrationPayload = {
  deviceName: "",
  ownerEmail: "", // New field for agent registrations
  ownerPhone: "", // New field for agent registrations
  imei1: "",
  imei2: "",
  deviceBrand: "",
  deviceModel: "",
  deviceCondition: "new",
  deviceOs: "",
  deviceStatus: "CLEAN", // Changed from lowercase "clean" to uppercase "CLEAN" to match the values in deviceStatuses
  deviceSerial: "",
  purchaseDate: new Date(),
  purchasePrice: 0,
  purchaseStore: "",
  purchaseNote: "",
  emergencyContact: "",
  payFromBalance: true,
  isOwnerSelfRegistration: false,
};

export default function NewRegistrationPage() {
  const navigate = useNavigate();
  const { constants } = useAppSelector((state) => state.app);
  const DEFAULT_CURRENCY = constants?.DEFAULT_CURRENCY || "NGN";
  const PRICE_AGENT_REGISTRATION_NGN =
    constants?.PRICE_AGENT_REGISTRATION_NGN || 0;
  const PRICE_USER_REGISTRATION_NGN =
    constants?.PRICE_USER_REGISTRATION_NGN || 0;
  const { isAgent, user } = useAuth();
  const [formData, setFormData] =
    useState<DeviceRegistrationPayload>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<DeviceFormErrors>({});
  const [imeiValidations, setImeiValidations] = useState<(boolean | null)[]>([
    null,
    null,
  ]);
  // Function to check IMEI duplicate
  const checkImei = async (imei: string, index: number) => {
    if (!imei || imei.length < 14) return;

    try {
      const res = await DeviceService.searchDeviceByIMEI(imei);

      if (res?.data?.success && res?.data?.data) {
        return res.data.data; // the device found
      } else {
        return null;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const [agentRegistrationStats, setAgentRegistrationStats] =
    useState<AgentRegistrationStats>({
      totalRegistrations: 0,
      paidRegistrations: 0,
      freeRegistrationsEarned: 0,
      freeRegistrationsUsed: 0,
      hasFreeRegistrations: false,
      balance: 0,
      nextFreeRegistrationThreshold: 0,
      agent_free_registration_threshold: 0,
    });

  // Set default payment method as 'wallet' for agents, 'paystack' for regular users
  const [paymentMethod, setPaymentMethod] = useState<
    "paystack" | "wallet" | "free"
  >(isAgent() ? "wallet" : "paystack");

  // Refs for form fields to enable scrolling to errors
  const fieldRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  const handleInputChange = (
    field: keyof DeviceRegistrationPayload,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (field in errors) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const scrollToFirstError = (errors: DeviceFormErrors) => {
    // Define the order of fields to check for errors
    const fieldOrder = [
      "imei1",
      "imei2",
      "deviceBrand",
      "deviceModel",
      "deviceCondition",
      "deviceStatus",
      "ownerEmail",
      "ownerPhone",
    ];

    // Find the first field with an error
    for (const field of fieldOrder) {
      if (errors[field as keyof DeviceFormErrors]) {
        const element = fieldRefs.current[field];
        if (element) {
          // Add a small delay to ensure DOM has updated
          setTimeout(() => {
            element.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
            element.focus();
          }, 100);
          break;
        }
      }
    }
  };

  const validateForm = (): boolean => {
    const newErrors: DeviceFormErrors = {};

    // Validate IMEI1 and IMEI2
    const imeiErrors: string[] = ["", ""];

    // Validate primary IMEI (required)
    const primaryImei = formData.imei1;
    if (!primaryImei.trim()) {
      imeiErrors[0] = "Primary IMEI is required";
    } else if (!/^\d{15}$/.test(primaryImei)) {
      imeiErrors[0] = "IMEI must be exactly 15 digits";
    }

    // Validate secondary IMEI (optional)
    const secondaryImei = formData.imei2;
    if (
      secondaryImei &&
      secondaryImei.trim() &&
      !/^\d{15}$/.test(secondaryImei)
    ) {
      imeiErrors[1] = "IMEI must be exactly 15 digits";
    }

    // Add errors if found
    if (imeiErrors[0] || imeiErrors[1]) {
      newErrors.imei1 = imeiErrors[0];
      newErrors.imei2 = imeiErrors[1];
    }

    if (!formData.deviceBrand?.trim()) {
      newErrors.deviceBrand = "Brand is required";
    }

    if (!formData.deviceModel?.trim()) {
      newErrors.deviceModel = "Model is required";
    }

    if (!formData.deviceCondition) {
      newErrors.deviceCondition = "Condition is required";
    }

    if (!formData.deviceStatus) {
      newErrors.deviceStatus = "Device status is required";
    }

    // Validate owner email for agents (only when not self-registering)
    if (
      isAgent() &&
      !formData.isOwnerSelfRegistration &&
      !formData.ownerEmail?.trim()
    ) {
      newErrors.ownerEmail =
        "Owner email is required when registering for others";
    }

    if (
      isAgent() &&
      !formData.isOwnerSelfRegistration &&
      !formData.ownerPhone?.trim()
    ) {
      newErrors.ownerPhone =
        "Owner phone is required when registering for others";
    }

    setErrors(newErrors);

    // Scroll to first error if validation fails
    if (Object.keys(newErrors).length > 0) {
      scrollToFirstError(newErrors);
    }

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Stop form if duplicated IMEI found
    if (imeiValidations[0] === false || imeiValidations[1] === false) {
      toast.error("One of the IMEIs is already registered.");
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Transform form data to match API payload structure
      const devicePayload: DeviceRegistrationPayload = {
        imei1: formData.imei1, // First IMEI is required
        imei2: formData.imei2 || null, // Second IMEI is optional
        deviceName:
          formData.deviceName.trim() ||
          `${formData.deviceBrand} ${formData.deviceModel}`,
        deviceStatus: formData.deviceStatus,
        deviceBrand: formData.deviceBrand,
        deviceModel: formData.deviceModel,
        deviceCondition: formData.deviceCondition,
        deviceSerial: formData.deviceSerial || undefined,
        deviceOs: formData.deviceOs || undefined,
        purchaseDate: formData.purchaseDate
          ? new Date(formData.purchaseDate)
          : undefined,
        purchasePrice: formData.purchasePrice
          ? parseFloat(formData.purchasePrice as unknown as string)
          : undefined,
        purchaseStore: formData.purchaseStore || undefined,
        purchaseNote: formData.purchaseNote || undefined,
        emergencyContact: formData.emergencyContact || undefined,
      };

      if (isAgent()) {
        if (!formData.isOwnerSelfRegistration) {
          devicePayload.ownerEmail = formData.ownerEmail || undefined;
          devicePayload.ownerPhone = formData.ownerPhone || undefined;
        }
        devicePayload.payFromBalance = formData.payFromBalance || false;
        devicePayload.isOwnerSelfRegistration =
          formData.isOwnerSelfRegistration || false;
      }

      console.log(devicePayload);

      // Make API call to create device
      const response: ApiResponse = await DeviceService.createDevice(
        devicePayload
      );

      if (response.data?.success) {
        // Determine if we got back a device with payment data or just a device
        if (response.data.data?.payment) {
          // We have payment data
          const { device, payment, deviceRegistration } = response.data.data;
          console.log(payment);

          if (isAgent()) {
            // Payment was processed from wallet or was a free registration
            toast.success(
              deviceRegistration.isFreeRegistration
                ? "Device registered successfully using a free registration!"
                : "We Have Sent Email To Complete The Registration!",
              {
                duration: 10000, // show for 15 seconds
              }
            );

            // Refresh agent wallet and stats
            loadAgentWalletAndStats();

            // Scroll to top and redirect to dashboard
            window.scrollTo({ top: 0, behavior: "smooth" });
            navigate("/dashboard");
          } else {
            if (payment.authorizationUrl) {
              // Store relevant payment data in sessionStorage
              sessionStorage.setItem(
                "devicePayment",
                JSON.stringify({
                  deviceId: device.id,
                  deviceName: device.deviceName || devicePayload.deviceName,
                  paymentReference: payment.reference,
                  returnUrl: "/dashboard",
                })
              );

              // Redirect to payment page
              window.location.href = payment.authorizationUrl;
            }
          }
        } else {
          // Just got a device without payment info (fallback)
          toast.success("Device registered successfully!");
          window.scrollTo({ top: 0, behavior: "smooth" });
          navigate("/dashboard");
        }
      } else {
        throw new Error(response.data?.message || "Failed to register device");
      }
    } catch (error: any) {
      console.error("Error during device registration:", error);

      // Handle other errors
      const errorMessage =
        error?.data?.message ||
        error?.message ||
        "An error occurred while registering the device";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Load agent wallet balance and registration stats
  useEffect(() => {
    if (isAgent()) {
      loadAgentWalletAndStats();
    }
  }, []);

  const loadAgentWalletAndStats = async () => {
    try {
      // Get registration stats
      const statsResponse = await PaymentService.getAgentRegistrationStats();
      if (
        statsResponse.data?.data &&
        statsResponse.data?.data?.registrationStats
      ) {
        // The API return format might be different from our local interface
        const { registrationStats } = statsResponse.data.data;

        setAgentRegistrationStats(registrationStats);

        // If user is an agent, set wallet as default payment method if they have sufficient balance
        if (
          user?.balance &&
          user.balance >= (constants?.PRICE_AGENT_REGISTRATION_NGN || 0)
        ) {
          // If wallet has enough balance, set it as default payment method
          setPaymentMethod("wallet");
        }
      }
    } catch (error: any) {
      console.error("Error loading agent wallet data:", error);

      // Handle 401 errors in wallet loading
      if (error?.status === 401) {
        toast.error("Your session has expired. Please log in again.");
        return;
      }
    }
  };

  const handleReset = () => {
    setFormData(initialFormData);
    setErrors({});
    setImeiValidations([null, null]);
  };

  const selectedCondition = deviceConditions.find(
    (c) => c.value === formData.deviceCondition
  );
  return (
    <>
      <div>
        <h1 className="text-lg md:text-3xl font-bold">Register New Device</h1>
        <p className="text-xs md:text-base text-muted-foreground">
          Add a new device to your FoneOwner list
        </p>
      </div>

      <form
        id="device-registration-form"
        onSubmit={handleSubmit}
        className="space-y-6 pb-24"
      >
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Device Information */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IconDeviceMobile className="h-5 w-5" />
                  Device Information
                </CardTitle>
                <CardDescription>
                  Enter the basic information about the device
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Device's Owner Name Field */}
                <div className="space-y-2">
                  <Label htmlFor="deviceName">Device's Owner Name</Label>
                  <Input
                    id="deviceName"
                    placeholder="e.g., My Samsung S23, Work iPhone, etc."
                    value={formData.deviceName}
                    onChange={(e) =>
                      handleInputChange("deviceName", e.target.value)
                    }
                  />
                </div>

                {isAgent() && (
                  <>
                    <div className="space-y-4 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">
                          Registration Type
                        </Label>
                        <RadioGroup
                          value={
                            formData.isOwnerSelfRegistration ? "self" : "other"
                          }
                          onValueChange={(value) => {
                            const isSelf = value === "self";
                            setFormData((prev) => ({
                              ...prev,
                              isOwnerSelfRegistration: isSelf,
                              ownerEmail: isSelf ? "" : prev.ownerEmail,
                              ownerPhone: isSelf ? "" : prev.ownerPhone,
                            }));
                          }}
                          className="flex flex-col space-y-2"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="other" id="register-other" />
                            <Label htmlFor="register-other" className="text-sm">
                              Register device for someone else
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="self" id="register-self" />
                            <Label htmlFor="register-self" className="text-sm">
                              Register device for myself
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {formData.isOwnerSelfRegistration
                          ? "You're registering this device for yourself. Owner contact details are not required."
                          : "You're registering this device for someone else. Owner contact details are required."}
                      </p>
                    </div>

                    {/* Owner Contact Details - Only show when registering for others */}
                    {!formData.isOwnerSelfRegistration && (
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="ownerEmail">Device Owner Email</Label>
                          <Input
                            ref={(el) => {
                              fieldRefs.current["ownerEmail"] = el;
                            }}
                            id="ownerEmail"
                            type="email"
                            placeholder="e.g., owner@email.com"
                            value={formData.ownerEmail || ""}
                            onChange={(e) =>
                              handleInputChange("ownerEmail", e.target.value)
                            }
                            required
                            className={
                              errors.ownerEmail ? "border-red-500" : ""
                            }
                          />
                          {errors.ownerEmail && (
                            <p className="text-sm text-red-600 flex items-center gap-1">
                              <IconAlertCircle className="h-4 w-4" />
                              {errors.ownerEmail}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="ownerPhone">
                            Device Owner's Phone Number
                          </Label>
                          <Input
                            ref={(el) => {
                              fieldRefs.current["ownerPhone"] = el;
                            }}
                            id="ownerPhone"
                            type="tel"
                            placeholder="e.g., +2348012345678"
                            value={formData.ownerPhone || ""}
                            onChange={(e) =>
                              handleInputChange("ownerPhone", e.target.value)
                            }
                            className={
                              errors.ownerPhone ? "border-red-500" : ""
                            }
                          />
                          {errors.ownerPhone && (
                            <p className="text-sm text-red-600 flex items-center gap-1">
                              <IconAlertCircle className="h-4 w-4" />
                              {errors.ownerPhone}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* IMEI Fields */}
                <div className="space-y-2">
                  <Label>IMEI Numbers</Label>

                  {/* IMEI 1 - Primary (Required) */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 relative">
                        <Input
                          ref={(el) => {
                            fieldRefs.current["imei1"] = el;
                          }}
                          placeholder="Enter primary IMEI number (required)"
                          value={formData.imei1 || ""}
                          onChange={(e) => {
                            const value = e.target.value
                              .replace(/\D/g, "")
                              .slice(0, 15);
                            handleInputChange("imei1", value);

                            // Validate IMEI using Luhn Algorithm
                            const isValid =
                              value.length === 15 &&
                              value
                                .split("")
                                .reverse()
                                .map(Number)
                                .reduce((sum, digit, idx) => {
                                  if (idx % 2 === 1) {
                                    digit *= 2;
                                    if (digit > 9) digit -= 9;
                                  }
                                  return sum + digit;
                                }, 0) %
                                10 ===
                                0;

                            setImeiValidations((prev) => [isValid, prev[1]]);
                          }}
                          maxLength={15}
                          className={errors.imei1 ? "border-red-500" : ""}
                        />
                      </div>
                    </div>

                    {/* Error message for IMEI 1 */}
                    {errors.imei1 && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <IconAlertCircle className="h-4 w-4" />
                        {errors.imei1}
                      </p>
                    )}

                    {imeiValidations[0] === false && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <IconAlertCircle className="h-4 w-4" />
                        Invalid IMEI format
                      </p>
                    )}
                  </div>

                  {/* IMEI 2 - Secondary (Optional) */}
                  <div className="space-y-2 mt-4">
                    <Label>Secondary IMEI (optional)</Label>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 relative">
                        <Input
                          ref={(el) => {
                            fieldRefs.current["imei2"] = el;
                          }}
                          placeholder="Enter secondary IMEI number (optional)"
                          value={formData.imei2 || ""}
                          onChange={(e) => {
                            const value = e.target.value
                              .replace(/\D/g, "")
                              .slice(0, 15);
                            handleInputChange("imei2", value);

                            // Validate IMEI using Luhn Algorithm
                            const isValid =
                              value.length === 15 &&
                              value
                                .split("")
                                .reverse()
                                .map(Number)
                                .reduce((sum, digit, idx) => {
                                  if (idx % 2 === 1) {
                                    digit *= 2;
                                    if (digit > 9) digit -= 9;
                                  }
                                  return sum + digit;
                                }, 0) %
                                10 ===
                                0;

                            setImeiValidations((prev) => [prev[0], isValid]);
                          }}
                          maxLength={15}
                          className={errors.imei2 ? "border-red-500" : ""}
                        />
                      </div>
                    </div>

                    {/* Error message for IMEI 2 */}
                    {errors.imei2 && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <IconAlertCircle className="h-4 w-4" />
                        {errors.imei2}
                      </p>
                    )}

                    {imeiValidations[1] === false && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <IconAlertCircle className="h-4 w-4" />
                        Invalid IMEI format
                      </p>
                    )}
                  </div>
                </div>

                {/* Device Serial */}
                <div className="space-y-2">
                  <Label htmlFor="deviceSerial">
                    Device Serial Number (optional)
                  </Label>
                  <Input
                    id="deviceSerial"
                    placeholder="e.g., SN123456789"
                    value={formData.deviceSerial || ""}
                    onChange={(e) =>
                      handleInputChange("deviceSerial", e.target.value)
                    }
                    className={errors.deviceSerial ? "border-red-500" : ""}
                  />
                  {errors.deviceSerial && (
                    <p className="text-sm text-red-600">
                      {errors.deviceSerial}
                    </p>
                  )}
                </div>

                {/* Brand and Model */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="brand">Brand</Label>
                    <Select
                      value={formData.deviceBrand || ""}
                      onValueChange={(value) =>
                        handleInputChange("deviceBrand", value)
                      }
                    >
                      <SelectTrigger
                        ref={(el) => {
                          fieldRefs.current["deviceBrand"] = el;
                        }}
                        className={`w-full${
                          errors.deviceBrand ? " border-red-500" : ""
                        }`}
                      >
                        <SelectValue placeholder="Select brand" />
                      </SelectTrigger>
                      <SelectContent>
                        {deviceBrands.map((brand) => (
                          <SelectItem key={brand} value={brand.toLowerCase()}>
                            {brand}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.deviceBrand && (
                      <p className="text-sm text-red-600">
                        {errors.deviceBrand}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="model">Model</Label>
                    <Input
                      ref={(el) => {
                        fieldRefs.current["deviceModel"] = el;
                      }}
                      id="model"
                      placeholder="e.g., iPhone 15 Pro"
                      value={formData.deviceModel || ""}
                      onChange={(e) =>
                        handleInputChange("deviceModel", e.target.value)
                      }
                      className={errors.deviceModel ? "border-red-500" : ""}
                    />
                    {errors.deviceModel && (
                      <p className="text-sm text-red-600">
                        {errors.deviceModel}
                      </p>
                    )}
                  </div>
                </div>

                {/* Operating System and Version */}
                <div className="space-y-2">
                  <Label htmlFor="operatingSystem">
                    Operating System (optional)
                  </Label>
                  <Select
                    value={formData.deviceOs || ""}
                    onValueChange={(value) =>
                      handleInputChange("deviceOs", value)
                    }
                  >
                    <SelectTrigger className={`w-full`}>
                      <SelectValue placeholder="Select OS" />
                    </SelectTrigger>
                    <SelectContent>
                      {operatingSystems.map((os) => (
                        <SelectItem key={os} value={os.toLowerCase()}>
                          {os}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Device Status */}
                <DeviceStatusSelector
                  value={formData.deviceStatus}
                  onValueChange={(value) =>
                    handleInputChange("deviceStatus", value)
                  }
                  placeholder="Select status"
                  label="Device Status"
                  allowAllStatuses={true}
                  error={errors.deviceStatus}
                  ref={(el) => {
                    fieldRefs.current["deviceStatus"] = el;
                  }}
                />

                {/* Condition */}
                <div className="space-y-2">
                  <Label htmlFor="condition">Condition</Label>
                  <Select
                    value={formData.deviceCondition || ""}
                    onValueChange={(value) =>
                      handleInputChange("deviceCondition", value)
                    }
                  >
                    <SelectTrigger
                      ref={(el) => {
                        fieldRefs.current["deviceCondition"] = el;
                      }}
                      className={`w-full${
                        errors.deviceCondition ? " border-red-500" : ""
                      }`}
                    >
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      {deviceConditions.map((condition) => (
                        <SelectItem
                          key={condition.value}
                          value={condition.value}
                        >
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className={`bg-${condition.color}-50 text-${condition.color}-700 border-${condition.color}-200`}
                            >
                              {condition.label}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.deviceCondition && (
                    <p className="text-sm text-red-600">
                      {errors.deviceCondition}
                    </p>
                  )}
                </div>
                {/* Emergency Contact */}
                <div className="space-y-2">
                  <Label htmlFor="emergencyContact">
                    Emergency Contact (optional)
                  </Label>
                  <Input
                    id="emergencyContact"
                    placeholder="Emergency contact phone or email"
                    value={formData.emergencyContact || ""}
                    onChange={(e) =>
                      handleInputChange("emergencyContact", e.target.value)
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    Contact information to be used in case the device is
                    reported stolen or lost
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Purchase Information */}
            <Card>
              <CardHeader>
                <CardTitle>Purchase Information</CardTitle>
                <CardDescription>
                  Optional purchase details for better tracking
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="purchaseDate">
                      Purchase Date (optional)
                    </Label>
                    <Input
                      id="purchaseDate"
                      type="date"
                      value={formData.purchaseDate as unknown as string}
                      onChange={(e) =>
                        handleInputChange("purchaseDate", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="purchasePrice">
                      Purchase Price (optional)
                    </Label>
                    <Input
                      id="purchasePrice"
                      type="number"
                      placeholder="0.00"
                      step="0.01"
                      value={formData.purchasePrice as unknown as string}
                      onChange={(e) =>
                        handleInputChange("purchasePrice", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="purchaseStore">
                    Retailer/Store (optional)
                  </Label>
                  <Input
                    id="purchaseStore"
                    placeholder="e.g., Apple Store, Amazon, Best Buy"
                    value={formData.purchaseStore || ""}
                    onChange={(e) =>
                      handleInputChange("purchaseStore", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="purchaseNote">
                    Additional Notes (optional)
                  </Label>
                  <Textarea
                    id="purchaseNote"
                    placeholder="Any additional information about the device..."
                    value={formData.purchaseNote || ""}
                    onChange={(e) =>
                      handleInputChange("purchaseNote", e.target.value)
                    }
                    rows={3}
                  />
                </div>
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
                    <span className="text-muted-foreground">IMEI(s):</span>
                    <div className="text-right">
                      {formData.imei1.trim() && formData.imei2?.trim() ? (
                        [formData.imei1, formData.imei2]
                          .filter((imei) => imei.trim())
                          .map((imei, index) => (
                            <div key={index} className="font-mono text-xs">
                              {imei || "—"}
                            </div>
                          ))
                      ) : (
                        <span>—</span>
                      )}
                    </div>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Brand:</span>
                    <span>{formData.deviceBrand || "—"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Model:</span>
                    <span>{formData.deviceModel || "—"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Condition:</span>
                    <span>
                      {selectedCondition ? (
                        <Badge variant="outline" className="text-xs">
                          {selectedCondition.label}
                        </Badge>
                      ) : (
                        "—"
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Operating System:
                    </span>
                    <span>{formData.deviceOs || "—"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">OS Version:</span>
                    <span>{formData.deviceOs || "—"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Serial Number:
                    </span>
                    <span className="font-mono text-xs">
                      {formData.deviceSerial || "—"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Emergency Contact:
                    </span>
                    <span>{formData.emergencyContact || "—"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Status:</span>
                    <span>
                      {formData.deviceStatus ? (
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            formData.deviceStatus === "CLEAN"
                              ? "bg-green-50 text-green-700 border-green-200"
                              : formData.deviceStatus === "STOLEN"
                              ? "bg-red-50 text-red-700 border-red-200"
                              : formData.deviceStatus === "LOST"
                              ? "bg-orange-50 text-orange-700 border-orange-200"
                              : formData.deviceStatus === "BLOCKED"
                              ? "bg-red-50 text-red-700 border-red-200"
                              : "bg-gray-50 text-gray-700 border-gray-200"
                          }`}
                        >
                          {deviceStatuses.find(
                            (s) => s.value === formData.deviceStatus
                          )?.label || formData.deviceStatus}
                        </Badge>
                      ) : (
                        "—"
                      )}
                    </span>
                  </div>
                </div>
                <Separator />
                <p className="text-xs *:text-muted-foreground flex items-start gap-2">
                  <IconAlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span className="sr-only">Alert:</span>
                  <span>
                    Make sure the IMEI number and device status are correct as
                    they are critical for tracking and compliance. Device status
                    can be updated later if needed.
                  </span>
                </p>
              </CardContent>
            </Card>

            {/* Payment Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Payment & Renewal Details
                </CardTitle>
                <CardDescription className="text-xs">
                  Secure your device registration and stay protected.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Registration Fee */}
                <div className="flex items-center justify-between">
                  <span className="font-medium text-muted-foreground">
                    Registration Fee:
                  </span>
                  <span className="text-lg font-bold text-primary">
                    {isAgent()
                      ? `${
                          getCurrencySymbol(DEFAULT_CURRENCY) +
                          "" +
                          PRICE_AGENT_REGISTRATION_NGN
                        }`
                      : `${
                          getCurrencySymbol(DEFAULT_CURRENCY) +
                          "" +
                          PRICE_USER_REGISTRATION_NGN
                        }`}{" "}
                    <span className="text-xs text-muted-foreground">/year</span>
                  </span>
                </div>

                {/* Renewal Date */}
                <div className="flex items-center justify-between">
                  <span className="font-medium text-muted-foreground">
                    Renewal Date:
                  </span>
                  <span className="text-sm font-semibold text-green-700 bg-green-50 px-2 py-1 rounded">
                    {new Date(
                      Date.now() + 365 * 24 * 60 * 60 * 1000
                    ).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>

                {/* Payment Methods - Only for Agents */}
                {isAgent() && (
                  <>
                    <Separator />
                    <div>
                      <CardTitle className="mb-4">
                        Select Payment Method
                      </CardTitle>
                      <RadioGroup
                        value={paymentMethod}
                        onValueChange={(value) => {
                          const newPaymentMethod = value as
                            | "paystack"
                            | "wallet"
                            | "free";
                          setPaymentMethod(newPaymentMethod);
                          // Update payFromBalance based on selected payment method
                          if (isAgent()) {
                            setFormData((prev) => ({
                              ...prev,
                              payFromBalance: newPaymentMethod === "wallet",
                            }));
                          }
                        }}
                        className="space-y-2"
                      >
                        {/* Wallet Option - Always show but disable if insufficient balance */}
                        <Label
                          htmlFor="wallet"
                          className={cn(
                            "flex flex-col items-start transition-all border rounded-lg p-3",
                            agentRegistrationStats.balance >=
                              (constants?.PRICE_AGENT_REGISTRATION_NGN || 0)
                              ? "cursor-pointer"
                              : "cursor-not-allowed opacity-50",
                            paymentMethod === "wallet"
                              ? "border-primary bg-primary/3"
                              : "opacity-60"
                          )}
                        >
                          <div className="flex items-start space-x-2">
                            <RadioGroupItem
                              value="wallet"
                              id="wallet"
                              disabled={
                                agentRegistrationStats.balance <
                                (constants?.PRICE_AGENT_REGISTRATION_NGN || 0)
                              }
                            />
                            <div className="flex items-center justify-start gap-2">
                              <IconWallet className="h-4 w-4 text-blue-600" />
                              <span className="font-semibold">
                                Pay from Wallet
                              </span>
                              <span className="text-xs text-muted-foreground">
                                (Balance:{" "}
                                {getCurrencySymbol(DEFAULT_CURRENCY) +
                                  "" +
                                  agentRegistrationStats.balance.toLocaleString()}
                                )
                              </span>
                            </div>
                          </div>
                          {agentRegistrationStats.balance <
                            (constants?.PRICE_AGENT_REGISTRATION_NGN || 0) && (
                            <div className="mt-2 text-xs text-muted-foreground">
                              Insufficient balance.
                              <Link
                                to="/billing"
                                className="text-primary hover:underline ml-1"
                              >
                                Top up your wallet
                              </Link>
                            </div>
                          )}
                        </Label>

                        {/* Free Registration Option - Only show if eligible */}
                        <Label
                          htmlFor="free"
                          className={cn(
                            "flex flex-col  items-start  cursor-pointer transition-all border rounded-lg p-3",
                            paymentMethod === "free"
                              ? "border-primary bg-primary/3"
                              : "",
                            agentRegistrationStats.hasFreeRegistrations
                              ? ""
                              : "opacity-60"
                          )}
                        >
                          <div className="flex flex-col gap-3 items-start">
                            <div className="flex gap-3 items-start">
                              <RadioGroupItem
                                value="free"
                                id="free"
                                className="mt-1"
                                disabled={
                                  !agentRegistrationStats.hasFreeRegistrations
                                }
                              />

                              <div className="flex items-center gap-2">
                                <IconGift className="h-4 w-4 text-green-600" />
                                <span className="font-semibold">
                                  Free Registration
                                </span>
                                <Badge
                                  className={
                                    agentRegistrationStats.hasFreeRegistrations
                                      ? "bg-green-100 text-xs text-green-700 hover:bg-green-100"
                                      : "bg-muted text-muted-foreground"
                                  }
                                >
                                  {agentRegistrationStats.hasFreeRegistrations
                                    ? agentRegistrationStats.freeRegistrationsEarned
                                    : "Not available"}
                                </Badge>
                              </div>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {agentRegistrationStats.hasFreeRegistrations
                                ? `You've earned a free device registration after 5 paid registrations`
                                : `You need ${
                                    agentRegistrationStats.agent_free_registration_threshold -
                                    agentRegistrationStats.nextFreeRegistrationThreshold
                                  } more paid registrations to unlock a free registration`}
                            </span>
                          </div>
                        </Label>
                      </RadioGroup>
                    </div>
                  </>
                )}

                <Separator />

                <div className="text-xs text-muted-foreground">
                  <p>
                    This annual fee covers 12 months of device protection. Your
                    device will be registered on the FoneOwner platform and
                    you'll receive alerts if your device is reported stolen or
                    missing.
                  </p>
                  <p className="mt-2">
                    {!isAgent() || paymentMethod === "paystack"
                      ? "After submitting the form, you'll be redirected to Paystack to complete your payment securely."
                      : paymentMethod === "wallet"
                      ? "The registration fee will be deducted from your wallet balance."
                      : "You'll use one of your free registrations for this device."}
                  </p>
                </div>

                {/* Payment Platform - Only show for Paystack */}
                {(!isAgent() || paymentMethod === "paystack") && (
                  <div className="flex items-center gap-2">
                    <img
                      src="https://cdn.brandfetch.io/idM5mrwtDs/theme/dark/logo.svg?c=1bxid64Mup7aczewSAYMX&t=1667559828449"
                      alt="Paystack"
                      className="h-4"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Fixed buttons at bottom */}
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t shadow-lg z-50 p-4">
          <div className="flex justify-between items-center max-w-7xl mx-auto">
            <Button
              type="button"
              variant="outline"
              className="hidden sm:inline-flex"
              onClick={handleReset}
              disabled={isSubmitting}
            >
              Reset Form
            </Button>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                  navigate(-1);
                }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>

              {/* Main Submit Button with Spinner */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="gap-2 flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      ></path>
                    </svg>
                    Processing...
                  </>
                ) : isAgent() ? (
                  paymentMethod === "free" ? (
                    "Register Device (Free)"
                  ) : paymentMethod === "wallet" ? (
                    "Register & Pay from Wallet"
                  ) : (
                    `Register & Pay ${getCurrencySymbol(
                      DEFAULT_CURRENCY
                    )}${PRICE_AGENT_REGISTRATION_NGN}`
                  )
                ) : (
                  `Register & Pay ${getCurrencySymbol(
                    DEFAULT_CURRENCY
                  )}${PRICE_USER_REGISTRATION_NGN}`
                )}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
