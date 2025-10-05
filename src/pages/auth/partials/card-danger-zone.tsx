
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel } from "@/components/ui/alert-dialog";
import { deleteAccount } from "@/services/user.service";
import { useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/slices/auth.slice";
import { toast } from "sonner";
import { AlertTriangle } from "lucide-react";

export function CardDangerZone(){
  const dispatch = useAppDispatch();
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmationText, setConfirmationText] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDeleteAccount = async () => {
    if (confirmationText !== "DELETE") {
      toast.error("Please type 'DELETE' to confirm account deletion");
      return;
    }

    try {
      setIsDeleting(true);
      await deleteAccount();
      
      toast.success("Account deleted successfully");
      
      // Logout and redirect after a short delay
      setTimeout(async () => {
        await dispatch(logout());
        window.location.href = '/login';
      }, 1500);
      
    } catch (error: any) {
      console.error('Failed to delete account:', error);
      toast.error(error.response?.data?.message || "Failed to delete account");
    } finally {
      setIsDeleting(false);
      setIsDialogOpen(false);
      setConfirmationText("");
    }
  };

  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      setConfirmationText("");
    }
  };

  const isDeleteEnabled = confirmationText === "DELETE" && !isDeleting;
return (
<Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Danger Zone
              </CardTitle>
              <CardDescription>
                Manage your account's most sensitive actions. These actions cannot be undone.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-lg bg-destructive/5">
                  <div>
                    <h4 className="font-medium text-destructive">Delete Account</h4>
                    <p className="text-sm text-muted-foreground">
                      Permanently delete your account and all associated data. This action cannot be undone.
                    </p>
                  </div>
                  <AlertDialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm" disabled={isDeleting}>
                        Delete Account
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5 text-destructive" />
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="space-y-3">
                          <p>
                            This action cannot be undone. This will permanently delete your
                            account and remove all your data from our servers including:
                          </p>
                          <ul className="list-disc list-inside space-y-1 text-sm">
                            <li>Your profile information</li>
                            <li>All your session data</li>
                            <li>Customer records and analytics</li>
                            <li>Any saved settings and preferences</li>
                          </ul>
                          <div className="bg-muted p-3 rounded-md">
                            <p className="text-sm font-medium mb-2">
                              To confirm, type <span className="font-mono bg-background px-1 rounded">DELETE</span> in the box below:
                            </p>
                            <Input
                              placeholder="Type DELETE to confirm"
                              value={confirmationText}
                              onChange={(e) => setConfirmationText(e.target.value)}
                              className="mt-2"
                              disabled={isDeleting}
                            />
                          </div>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>
                          Cancel
                        </AlertDialogCancel>
                        <Button
                          variant="destructive"
                          onClick={handleDeleteAccount}
                          disabled={!isDeleteEnabled}
                          className="bg-destructive hover:bg-destructive/90"
                        >
                          {isDeleting ? "Deleting Account..." : "Delete Account"}
                        </Button>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
)}