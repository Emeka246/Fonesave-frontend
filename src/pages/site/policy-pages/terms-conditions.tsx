import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCheck, Smartphone, CreditCard, UserX, Ban } from "lucide-react";

export default function TermsConditions() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">
            Terms and Conditions
          </CardTitle>
          <p className="text-center text-muted-foreground">
            Last Updated: January 2025
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-lg">
            Welcome to Fonsave.com. By accessing or using our platform, you agree to the following:
          </p>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <UserCheck className="h-5 w-5" />
                Eligibility
              </h3>
              <p className="text-muted-foreground">
                You must be 18+ or have parental consent to use our services.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                Use of Service
              </h3>
              <p className="text-muted-foreground">
                You agree to register your own device(s) only and not submit false IMEI numbers.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payments
              </h3>
              <p className="text-muted-foreground">
                All registrations are charged yearly per device. Agents may charge extra fees to customers, but the platform fee remains fixed.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <Ban className="h-5 w-5" />
                Prohibited Actions
              </h3>
              <p className="text-muted-foreground">
                No fraudulent use of IMEIs, resale of stolen phones, or attempts to hack/manipulate the platform.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <UserX className="h-5 w-5" />
                Termination
              </h3>
              <p className="text-muted-foreground">
                We may suspend accounts that violate these rules.
              </p>
            </div>

          </div>
        </CardContent>
      </Card>
    </div>
  );
}