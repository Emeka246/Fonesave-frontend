import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { 
  Plus
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { DeviceList } from "./_partials/device-list";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import useAuth from '@/hooks/use-auth'
import TopUpWalletDialog from "@/components/dialogs/topup-wallet-dialog";
import { getCurrencySymbol } from "@/lib/utils";
import { getCurrentUser } from "@/services/auth.service";
import { setUser } from "@/store/slices/auth.slice";




export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(state => state.auth.user);
  

  // Mock user data - in real app, this would come from API
  const userData = {
    name: currentUser?.fullName || "User",
    availableBalance: currentUser?.balance || 0,
  };

  const {isAgent} = useAuth();
  
  // This will be used to track when we navigate back to this page
  const [locationKey, setLocationKey] = useState(location.key);
  
  useEffect(() => {
    // Update the location key when it changes
    setLocationKey(location.key);
  }, [location.key]);

  // Refresh user data on component mount
  useEffect(() => {
    const refreshUserData = async () => {
      try {
        const response = await getCurrentUser();
        if (response.data && response.data.success) {
          // Update user data in Redux store with latest balance
          dispatch(setUser(response.data.user));
        }
      } catch (error) {
        console.error('Failed to refresh user data:', error);
        // Don't show error to user as this is a background refresh
      }
    };

    refreshUserData();
  }, [dispatch]);

  return (
    <>
      {/* Welcome Section */}
      <div className="flex justify-between items-start gap-2 mb-3 md:mb-0">
        <div>
          <h1 className="text-base md:text-3xl font-bold mb-2">Welcome, <span className="md:hidden">{userData.name.split(" ")[0]}</span><span className="hidden md:inline">{userData.name}</span></h1>
          <p className="hidden md:block text-xs md:text-base text-muted-foreground">Manage your registered devices and monitor their security status.</p>
        </div>
        {isAgent() && (
          <div className="flex flex-col items-end border border-blue-200 rounded-md px-4 py-2">
            <span className="inline-block rounded-full bg-blue-100 text-blue-800 px-4 py-1 text-xs md:text-sm font-semibold">
              {getCurrencySymbol("NGN") + " " + userData.availableBalance.toLocaleString()}
            </span>
            <span className="hidden sm:block text-xs text-muted-foreground mt-1">Available Balance in your wallet</span>
            <span className="sm:hidden block text-xs text-muted-foreground mt-1">Available Balance</span>
          </div>
        )}
       
      </div>

      {/* Agent Quick Stats */}
      {/* {isAgent() && (
        
        <AgentQuickStatsComponent />
      )} */}

      {/* Quick Actions Buttons */}
      <section className="mb-3">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button 
              onClick={() => navigate('/dashboard/new-registration')} 
              className="justify-start h-auto p-4"
            >
              <Plus className="size-4 md:size-7 mr-0 md:mr-3" />
              <div className="text-left text-xs md:text-sm">
                <div className="font-semibold">Register New Device</div>
                <div className="hidden md:block text-xs text-muted-foreground mt-1">Add a new device to your account</div>
              </div>
            </Button>
            

            {isAgent() && ( 
              <>
            <TopUpWalletDialog
              trigger={
                <Button 
                  className="justify-start h-auto p-4 w-full"
                  variant="blue"
                >
                  <Plus className="size-4 md:size-7 mr-0 md:mr-3" />
                  <div className="text-left text-xs md:text-sm">
                    <div className="font-semibold">Fund Wallet</div>
                    <div className="hidden md:block text-xs text-zinc-200 mt-1">Add funds to your wallet</div>
                  </div>
                </Button>
              }
            />

           
            </>
            )}


      

            {/* <Button 
              variant="outline" 
              onClick={() => navigate('/dashboard/search-device')} 
              className="justify-start h-auto p-4"
            >
              <Search className="h-5 w-5 mr-3" />
              <div className="text-left">
                <div className="font-semibold">IMEI Status Checker</div>
                <div className="text-sm text-muted-foreground">Verify if a device is stolen or blocked</div>
              </div>
            </Button> */}
          </div>
          </section>

      {/* Registered Devices */}
      <section className="mb-8">
        <DeviceList key={locationKey} />
      </section>
     
    </>
  );
}

// Define an interface for the stats card

