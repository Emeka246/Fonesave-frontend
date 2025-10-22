import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Eye, Database, RefreshCw, Users } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center flex items-center justify-center gap-3">
            Privacy Policy
          </CardTitle>
          <p className="text-center text-muted-foreground text-lg mt-4">
            Your Privacy Matters to Us
          </p>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="grid gap-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <Database className="h-6 w-6 mt-1" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3">Data We Collect</h3>
                <p className="text-muted-foreground">
                  Email, phone IMEIs, payment info (via Paystack).
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <Eye className="h-6 w-6  mt-1" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3">Why We Collect</h3>
                <p className="text-muted-foreground">
                  To register and verify devices, process payments, and send reminders.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <Users className="h-6 w-6  mt-1" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3">Data Sharing</h3>
                <p className="text-muted-foreground">
                  We do not sell your data. Limited access may be shared with payment providers and law enforcement if required.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <Shield className="h-6 w-6  mt-1" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3">Security</h3>
                <p className="text-muted-foreground">
                  All data is encrypted and stored securely.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <RefreshCw className="h-6 w-6  mt-1" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3">Your Control</h3>
                <p className="text-muted-foreground">
                  You may request deletion of your account and associated data anytime.
                </p>
              </div>
            </div>

          </div>

          <div className="bg-muted/50 p-6 rounded-lg border-l-4">
            <h4 className="font-semibold text-lg mb-2">Your Rights</h4>
            <p className="text-muted-foreground">
              You have the right to access, update, or delete your personal information at any time. 
              Contact our support team if you need assistance with your data privacy rights.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}