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
import { ProgressBar } from "@/components/ui/progress-bar";
import { PaymentService } from "@/services/payment.service";





export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(state => state.auth.user);
  const appConstants = useAppSelector(state => state.app.constants);
  

  // Mock user data - in real app, this would come from API
  const userData = {
    name: currentUser?.fullName || "User",
    availableBalance: currentUser?.balance || 0,
  };

  const {isAgent} = useAuth();
  
  // This will be used to track when we navigate back to this page
  const [locationKey, setLocationKey] = useState(location.key);
  
  // Agent registration stats state
  const [agentStats, setAgentStats] = useState({
    paidRegistrations: 0,
    freeRegistrationsEarned: 0,
    freeRegistrationsUsed: 0,
    hasFreeRegistrations: false,
    nextFreeRegistrationThreshold: 0
  });
  const [loadingStats, setLoadingStats] = useState(false);
  
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

  // Fetch agent registration stats
  useEffect(() => {
    const fetchAgentStats = async () => {
      if (!isAgent()) return;
      
      setLoadingStats(true);
      try {
        const response = await PaymentService.getAgentRegistrationStats();
        if (response.data && response.data.success) {
          const stats = response.data.data.registrationStats;
          setAgentStats({
            paidRegistrations: stats.paidRegistrations || 0,
            freeRegistrationsEarned: stats.freeRegistrationsEarned || 0,
            freeRegistrationsUsed: stats.freeRegistrationsUsed || 0,
            hasFreeRegistrations: stats.hasFreeRegistrations || false,
            nextFreeRegistrationThreshold: stats.nextFreeRegistrationThreshold || 0
          });
        }
      } catch (error) {
        console.error('Failed to fetch agent stats:', error);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchAgentStats();
  }, []);

  return (
    <>
        
      {/* Welcome Section */}

        {isAgent() && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
        <div className="flex flex-col col-span-2">
          <h1 className="hidden md:block text-base md:text-3xl font-bold mb-2">Welcome, <span className="md:hidden">{userData.name.split(" ")[0]}</span><span className="hidden md:inline">{userData.name}</span></h1>
          <p className="hidden md:block text-xs md:text-base text-muted-foreground">Manage your registered devices and monitor their security status.</p>
        </div>

            {/* Free Registration Progress */}
            <div className="bg-white dark:bg-zinc-800 p-2 md:p-4 rounded-lg border shadow-sm">
              <div className="flex flex-col justify-between h-full">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-[10px] md:text-sm font-semibold text-gray-700 dark:text-gray-300">
                 Free Registration Progress
                 <br />
                </h3>
              </div>
              
              <div>
              {loadingStats ? (
                <div className="animate-pulse">
                  <div className="h-2 bg-gray-200 rounded-full mb-2"></div>
                </div>
              ) : (
                <>
                 <p className="text-xs text-right md:text-sm font-semibold mb-1">
                  {agentStats.nextFreeRegistrationThreshold} / {appConstants?.AGENCY_FREE_REGISTRATION_THRESHOLD}
                 </p>
                  <ProgressBar
                    current={agentStats.nextFreeRegistrationThreshold}
                    total={appConstants?.AGENCY_FREE_REGISTRATION_THRESHOLD || 5}
                    showText={false}
                    className="mb-2"
                  />
                </>
              )}
              </div>
              </div>
            </div>

            {/* Available Balance */}
            <div className="bg-white dark:bg-zinc-800 p-2 md:p-4 rounded-lg border shadow-sm">
              <h3 className="text-[10px] md:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Available Balance
              </h3>
              <div className="text-sm md:text-base font-bold text-blue-600 dark:text-blue-400 mb-2">
                {getCurrencySymbol("NGN") + " " + userData.availableBalance.toLocaleString()}
              </div>
              {/* {agentStats.freeRegistrationsEarned > 0 && !loadingStats && (
                <div className="text-[10px] md:text-xs text-gray-700 dark:text-gray-300">
                   You have <span className="font-bold ">{agentStats.freeRegistrationsEarned}</span> free registrations available
                </div>
              )}
              {loadingStats && (
                <div className="text-[10px] md:text-xs text-gray-500">
                  Loading...
                </div>
              )} */}
             
            </div>
          </div>
        )}

      {/* Agent Quick Stats */}
      {/* {isAgent() && (
        
        <AgentQuickStatsComponent />
      )} */}

      {/* Quick Actions Buttons */}
      <section className="mb-3">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
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

