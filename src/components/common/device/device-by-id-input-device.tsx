
import { useState, useEffect } from "react";
import DeviceService, { DevicePayload } from "@/services/device.service";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Phone, ShieldAlert } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { Dot } from "lucide-react";
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";



export default function DeviceByIdInput() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [imeiInput, setImeiInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [searchResult, setSearchResult] = useState<DevicePayload | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showUnregisteredModal, setShowUnregisteredModal] = useState(false);

    const handleKeyPress = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleSearch();
      }
    };

    const handleSearch = async () => {
      if (!imeiInput.trim()) {
        setError('Please enter an IMEI number');
        return;
      }
      
      setIsLoading(true);
      setError(null);
      try {
        let response;
        if (isAuthenticated) {
          response = await DeviceService.searchDeviceByIMEIAuth(imeiInput);
        } else {
          response = await DeviceService.searchDeviceByIMEI(imeiInput);
        }
        console.log(response.data);
        const deviceData = response.data.data as DevicePayload;
        const isOwner = (response.data as any).isOwner || false;
        setSearchResult({ ...deviceData, isOwner, isAuthenticated });
        setIsModalOpen(true); // Show modal when response is received
      } catch (error: any) {
        console.error('Error searching device:', error);
        
        // Check if the error is specifically "Device not found" which means IMEI is not registered
        if (error?.data?.code === 'DEVICE_NOT_FOUND' || error?.data?.message?.includes('Device not found')) {
          setShowUnregisteredModal(true);
        } else {
          setError(error?.data?.message || 'Device not found or an error occurred');
        }
      } finally {
        setIsLoading(false);
      }
    };

    // Reset input when modal closes
    useEffect(() => {
      if (!isModalOpen && !showUnregisteredModal) {
        setImeiInput('');
        setSearchResult(null);
        setError(null);
      }
    }, [isModalOpen, showUnregisteredModal]);

  return (
    <>
      <Card className="rounded-2xl shadow-lg p-4 md:p-8 gap-4 md:gap-6">
        <CardHeader className="px-4 md:px-6">
          <CardTitle>Check Phone Status</CardTitle>
          <CardDescription>Enter your 15-Digits IMEI for instant verification</CardDescription>
        </CardHeader>
        <CardContent className="px-4 md:px-6">
          <div className="space-y-6 mt-2">
            <div className='relative'>
              <Input
                id="hero-imei"
                placeholder="Enter IMEI number"
                value={imeiInput}
                onChange={(e) => setImeiInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className="h-12 md:h-20 text-lg md:text-3xl placeholder:text-gray-300 font-medium"
                maxLength={15}
              />
              <div className="flex items-center justify-between gap-2 mt-2 text-[9px] sm:text-xs">
                <p className="text-zinc-500">
                  Dial <strong>*#06#</strong> on your phone to find IMEI
                </p>
                <Link to="#help" className="underline text-zinc-500">
                  Help to find it?
                </Link>
              </div>
            </div>
            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 px-4 md:px-6">
          <Button 
            onClick={handleSearch}
            disabled={isLoading}
            className="w-full rounded-full py-3 h-12 hover:opacity-80"
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <span>Verifying...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <span>Check phone Status</span>
              </div>
            )}
          </Button>
          {/* Trust Indicators */}
          <div className="pt-4 border-t mt-2 border-gray-200 w-full">
            <div className="flex items-center justify-center space-x-1 text-xs text-zinc-500">
              <div className="flex items-center space-x-1">
                <span>Secure</span>
              </div>
              <Dot />
              <div className="flex items-center space-x-1">
                <span>Fast</span>
              </div>
              <Dot />
              <div className="flex items-center space-x-1">
                <span>Global</span>
              </div>
            </div>
          </div>
        </CardFooter>
      </Card>
      {/* Device Status Modal */}
      <DeviceStatusModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        searchResult={searchResult}
        onCloseAndReset={() => {
          setIsModalOpen(false);
        }}
      />

      {/* Unregistered IMEI Modal */}
      <Dialog open={showUnregisteredModal} onOpenChange={setShowUnregisteredModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">IMEI Not Registered</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center p-6 border rounded-lg">
              <div className="flex items-center justify-center mb-4">
                <div className="rounded-full bg-blue-50 p-3">
                  <Phone className="w-12 h-12 text-blue-600" />
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <h3 className="font-semibold text-lg text-gray-900">
                  This IMEI is not registered on FonSave
                </h3>
                <p className="text-sm text-gray-600">
                  Register Your Phone Now,<br />
                  To Protect It From Theft
                </p>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button 
                onClick={() => setShowUnregisteredModal(false)}
                variant="outline"
                className="flex-1"
              >
                Close
              </Button>
              
              <Button 
                onClick={() => {
                  setShowUnregisteredModal(false);
                  navigate('/dashboard/new-registration');
                }}
                className="flex-1"
              >
                Register Your Device
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}


interface DeviceStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  searchResult: DevicePayload | null;
  onCloseAndReset: () => void;
}

export function DeviceStatusModal({ isOpen, onClose, searchResult, onCloseAndReset }: DeviceStatusModalProps) {
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CLEAN':
        return 'bg-emerald-50 border border-emerald-200 text-emerald-800';
      case 'STOLEN':
        return 'bg-red-50 border border-red-200 text-red-800';
      case 'LOST':
        return 'bg-yellow-50 border border-yellow-200 text-yellow-800';
      case 'BLOCKED':
        return 'bg-gray-50 border border-gray-200 text-gray-800';
      case 'UNKNOWN':
        return 'bg-gray-50 border border-gray-200 text-gray-800';
      default:
        return 'bg-gray-50 border border-gray-200 text-gray-800';
    }
  }
  return (
      <>
      {/* Results Modal */}
      <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        {searchResult && (
          <div className="space-y-4 mt-3">
            <div className="text-center p-6 border rounded-lg">
              
              <div className="space-y-2 mb-4">
                <h3 className="font-semibold text-base md:text-lg ">
                  {searchResult.deviceStatus === 'CLEAN' ? 'Device Verified Safe' : 
                   searchResult.deviceStatus === 'STOLEN' ? 'Device Flagged as Stolen' :
                   searchResult.deviceStatus === 'LOST' ? 'Device Reported as Lost' :
                   searchResult.deviceStatus === 'BLOCKED' ? 'Device is Blocked' :
                   'Device Status Unknown'}
                </h3>
                <p className="font-mono text-xs md:text-sm text-zinc-400">{searchResult.imei1}</p>
                <p className="text-xs">Verified {new Date(searchResult.createdAt).toLocaleDateString()}</p>
              </div>

              <Badge className={`${getStatusColor(searchResult.deviceStatus)} px-3 py-1 md:px-4 md:py-2 text-base font-semibold rounded-full`}>
                {searchResult.deviceStatus.toUpperCase()}
              </Badge>
            </div>
                    <table className="w-full text-xs mb-4 border rounded-lg">
                    <tbody>
                      <tr className="border-b">
                        <td className="font-medium py-2 px-2 border-r ">Brand</td>
                        <td className="py-2 px-2">{searchResult.deviceBrand || '—'}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="font-medium py-2 px-2 border-r">Model</td>
                        <td className="py-2 px-2">{searchResult.deviceModel || '—'}</td>
                      </tr>
                      {searchResult.deviceName && (
                        <tr className="border-b">
                          <td className="font-medium py-2 px-2 border-r">Device Owner Name</td>
                          <td className="py-2 px-2">
                            <p>{searchResult.deviceName}</p>
                            {!searchResult.isAuthenticated && (
                              <Link to="/login" className="text-blue-500 hover:underline">
                                Login to view device owner name
                              </Link>
                            )}
                          </td>
                        </tr>
                      )}
                      
                    </tbody>
                    </table>


            
            {searchResult.deviceStatus === 'STOLEN' && (
              <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <span className="text-red-500 text-2xl">
                    <ShieldAlert className="w-8 h-8 text-red-600" />
                  </span>
                  <div className="flex-1">
                    <h4 className="text-red-800 dark:text-red-300 font-semibold">Warning: Stolen Device</h4>
                    <p className="text-red-700 dark:text-red-400 text-xs md:text-sm mt-1">
                      This device has been reported as stolen. Do not purchase or use this device. 
                      Contact authorities if you have information about this device.
                    </p>
                    {searchResult.ownerMessage && (
                      <div className="mt-3 p-3 bg-white dark:bg-gray-800 rounded border border-red-200 dark:border-red-700">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">Message from Owner:</p>
                        <p className="text-sm text-gray-700 dark:text-gray-300 italic">"{searchResult.ownerMessage}"</p>
                        {searchResult.isAuthenticated && searchResult.ownerPhone && (
                          <p className="text-sm font-mono text-gray-600 dark:text-gray-400 mt-2">
                            Contact: {searchResult.ownerPhone}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            
            
            {searchResult.deviceStatus === 'LOST' && (
              <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <span className="text-yellow-500 text-2xl">
                    <ShieldAlert className="w-8 h-8 text-yellow-600" />
                  </span>
                  <div className="flex-1">
                    <h4 className="text-yellow-800 dark:text-yellow-300 font-semibold">Caution: Lost Device</h4>
                    <p className="text-yellow-700 dark:text-yellow-400 text-xs md:text-sm mt-1">
                      This device has been reported as lost. Please verify ownership before purchasing or using this device.
                    </p>
                    {searchResult.ownerMessage && (
                      <div className="mt-3 p-3 bg-white dark:bg-gray-800 rounded border border-yellow-200 dark:border-yellow-700">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">Message from Owner:</p>
                        <p className="text-sm text-gray-700 dark:text-gray-300 italic">"{searchResult.ownerMessage}"</p>
                        {searchResult.isAuthenticated && searchResult.ownerPhone && (
                          <p className="text-sm font-mono text-gray-600 dark:text-gray-400 mt-2">
                            Contact: {searchResult.ownerPhone}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}


            
            {searchResult.deviceStatus === 'BLOCKED' && (
              <div className="bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <span className=" text-2xl">
                    <ShieldAlert className="w-8 h-8 text-gray-600 dark:text-gray-400" />
                  </span>
                  <div>
                    <h4 className="text-gray-800 dark:text-gray-300 font-semibold">Device Blocked</h4>
                    <p className="text-gray-700 dark:text-gray-400 text-xs md:text-sm mt-1">
                      This device has been blocked by the carrier or manufacturer. It may not work properly on networks.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {searchResult.deviceStatus === 'CLEAN' && (
              <div className="bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <span className="text-emerald-500 text-2xl">
                    <ShieldCheck className="w-8 h-8 text-emerald-600" />
                  </span>
                  <div>
                    <h4 className="text-emerald-800 dark:text-emerald-300 font-semibold">Device Verified</h4>
                    <p className="text-emerald-700 dark:text-emerald-400 text-xs md:text-sm mt-1">
                      This device appears to be legitimate and safe to use. No theft reports found in our database.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {searchResult.deviceStatus === 'UNKNOWN' && (
              <div className="bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <span className=" text-2xl">
                    <ShieldAlert className="w-8 h-8 text-gray-600 dark:text-gray-400" />
                  </span>
                  <div>
                    <h4 className="text-gray-800 dark:text-gray-300 font-semibold">Status Unknown</h4>
                    <p className="text-gray-700 dark:text-gray-400 text-xs md:text-sm mt-1">
                      We couldn't determine the status of this device. Please verify the IMEI and try again.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-4 md:pt-6">
              {/* close button  */}
              <Button 
                onClick={onCloseAndReset}
                variant="outline"
                className="flex-1"
              >
                Close
              </Button>
              
              <Button 
                onClick={() => navigate('/dashboard/new-registration')}
                className="flex-1"
              >
                Register Your Device
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
    </>
    )
}

