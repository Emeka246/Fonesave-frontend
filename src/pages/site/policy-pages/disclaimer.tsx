import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, FileText, XCircle, Search } from "lucide-react";

export default function Disclaimer() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center flex items-center justify-center gap-3">
            <FileText className="h-8 w-8" />
            Disclaimer
          </CardTitle>
          <p className="text-center text-muted-foreground text-lg mt-4">
            Important information regarding the use of fonsave.com services
          </p>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="border-l-4 border-red-500 bg-red-50 dark:bg-red-950/20 p-6 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold mb-2 text-red-800 dark:text-red-200">Device Recovery Guarantee</h3>
                <p className="text-red-700 dark:text-red-300">
                  Fonsave.com does not guarantee recovery of stolen devices. Our service is designed to help prevent resale of stolen phones and support community awareness.
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
                <h3 className="text-xl font-semibold mb-3">Service Limitations</h3>
                <p className="text-muted-foreground">
                  We are not responsible for losses caused by theft, incorrect IMEI submission, or third-party misuse.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <Search className="h-6 w-6  mt-1" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3">Search Results Accuracy</h3>
                <p className="text-muted-foreground">
                  Search results reflect data entered by users; we cannot guarantee completeness or accuracy.
                </p>
              </div>
            </div>
          </div>

          <div className="border-l-4  p-6 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-6 w-6  flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold mb-2">Important Notice</h3>
                <p className="">
                  By using fonsave.com, you acknowledge that you have read, understood, and agree to this disclaimer. 
                  If you do not agree with any part of this disclaimer, please discontinue use of our services immediately.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center text-sm pt-4 border-t">
            <p>
              This disclaimer is subject to change without notice. Please review periodically for updates.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}