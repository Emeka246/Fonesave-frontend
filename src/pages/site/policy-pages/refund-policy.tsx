import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CreditCard,
  AlertTriangle,
  CheckCircle,
  XCircle,
  DollarSign,
} from "lucide-react";

export default function RefundPolicy() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center flex items-center justify-center gap-3">
            <CreditCard className="h-8 w-8" />
            Refund Policy
          </CardTitle>
          <p className="text-center text-muted-foreground text-lg mt-4">
            Our policy regarding refunds for IMEI registrations and services
          </p>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="border-l-4 border-orange-500 bg-orange-50 dark:bg-orange-950/20 p-6 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-6 w-6 text-orange-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold mb-2 text-orange-800 dark:text-orange-200">
                  General Policy
                </h3>
                <p className="text-orange-700 dark:text-orange-300">
                  Payments for IMEI registrations are non-refundable once
                  processed.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <XCircle className="h-6 w-6  mt-1" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3">
                  Non-Refundable Services
                </h3>
                <p className="text-muted-foreground">
                  All IMEI registration fees are non-refundable once the payment
                  has been processed and the device has been registered in our
                  system.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <CheckCircle className="h-6 w-6  mt-1" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3">
                  Refund Considerations
                </h3>
                <p className="text-muted-foreground">
                  However, in rare cases (e.g., double charges, technical
                  errors), refunds may be considered at our discretion.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <DollarSign className="h-6 w-6  mt-1" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3">Agent Fees</h3>
                <p className="text-muted-foreground">
                  Agents are responsible for charging customers fairly;
                  Foneowner.com is not liable for extra fees agents add.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-muted/50 p-6 rounded-lg border-l-4">
            <h4 className="font-semibold text-lg mb-2">
              Refund Request Process
            </h4>
            <p className="text-muted-foreground">
              If you believe you are eligible for a refund due to technical
              errors or double charges, please contact our support team with
              your transaction details and a clear explanation of the issue. All
              refund requests will be reviewed on a case-by-case basis.
            </p>
          </div>

          <div className="text-center text-sm pt-4 border-t">
            <p>
              This refund policy is subject to change without notice. Please
              review periodically for updates.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
