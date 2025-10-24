import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Star, ArrowRight, Copy } from 'lucide-react';
import { FAQs } from '@/components/common/site/site-faqs';
import { IconUserOwnerShipTransfer } from '@/components/ui/custom-icons';
import { toast } from 'sonner';
import DeviceByIdInput from '@/components/common/device/device-by-id-input-device';
import ROUTES from '@/routes/ROUTES_CONFIG';

export default function Homepage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
       {/* Hero Section */}
       <div className='-mt-24 bg-zinc-100 dark:bg-zinc-950' >
        <div className="container py-32 lg:py-32">
          <div className="grid grid-col-1 md:grid-cols-2 md:gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-4 md:space-y-8 md:px-10">
              <div className='hidden md:flex items-center justify-start gap-4 '>
                    <span className="flex items-center justify-center size-7 md:size-10 rounded-full border border-black/30 text-black/50 dark:bg-white/10 dark:text-white/50">
                        <Star className="size-3 md:size-6 dark:text-white" />
                    </span>
                    <div>
                    <h3 className="text-xs md:text-sm font-bold">
                        Rated 5.0
                        </h3>
                        <p className="text-xs text-zinc-500">
                            Over 500,000+ verified devices
                        </p>
                    </div>
              </div>
              <div className="">
                <h1 className="page-title">
                    Register Your Phone Now, In Case of Theft or Loss
                </h1>
                <p className="section-subtitle">
                   Protect your phone, avoid buying stolen phones, earn money as a FonSave Agent by helping others register their phones.
                </p>
              </div>
                <div className="flex items-center space-x-4 mt-5 md:mt-10">
                  <Button 
                    onClick={() => navigate(ROUTES.NEW_REGISTRATION)}
                    className="sm:text-base text-xs rounded-full px-6 font-medium"
                  >
                    Register Your Phone
                  </Button>
                  <Button 
                    variant="blue"
                    onClick={() => navigate(ROUTES.BECOME_AGENT)}
                    className='sm:text-base text-xs rounded-full px-6 font-medium'
                  >
                    Become an Agent
                  </Button>
                </div>
            </div>
            

            {/* Right Content - IMEI Verification Panel */}
            <div className="relative w-full md:max-w-lg mx-auto mt-6 md:mt-10">
              <DeviceByIdInput />
            </div>
          </div>
        </div>
        </div>

        

        {/* Features Section */}
       
        {/* <FeatureList

         <section className="section-space pt-0 -mt-20">
          <div className="container shadow-2xl bg-white md:panel p-8 md:p-14">
            <div className="mb-10 border-b border-zinc-200 pb-8">
              <div className="section-badge">Our Features</div>
              <div className="grid md:grid-cols-2 md:gap-8 items-center">
                <div>
                  <h2 className="section-title max-w-xl">
                    Unlock the power of <br />
                    IMEI verification
                  </h2>
                </div>
                <div className='flex-1 flex items-center justify-end'>
                  <p className="section-subtitle m-0 max-w-xl ml-auto">
                    Seamlessly integrate IMEI verification into your business processes.
                    Ensure device authenticity and security with our reliable service.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className='px-4 md:px-8'>
                <ShieldCheck className="icon-size mb-4 md:mb-8" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                   Verified Ownership Badge
                </h3>
                <p className="section-text">
                  Upload proof of purchase or verification badge to enhance trust and transparency.
                  Ensure your device is verified with officially.
                </p>
              </div>
               <div className='px-4 md:px-8'>
                <Search className="icon-size mb-4 md:mb-8" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                   IMEI Activity Logs
                </h3>
                <p className="section-text">
                  Access detailed logs of IMEI activity, including verification history and alerts.
                  Monitor device status changes in real-time.
                </p>
              </div>
                <div className='px-4 md:px-8'>
                <ArrowRightLeft className="icon-size mb-4 md:mb-8" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                 Report Suspicious Activity
                </h3>
                <p className="section-text">
                  Easily report stolen or suspicious devices to our database.
                  Contribute to a safer community by sharing device information.
                </p>
              </div>
            </div>
          </div>
        </section>
        */}


      
        {/* Why Choose Us */}
        <section className="section-space mt-20">
          <div className="container">
            <div className='max-w-2xl mx-auto text-center mb-12'>
            <span className="section-badge">
              Why Choose Us
            </span>
            <h2 className="section-title">
              Simple, secure, and reliable verification process
            </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14 items-center">
             <div className="col-span-2 md:col-span-1">
                  <div className="panel-accent px-10 md:px-20  justify-start h-full md:min-h-[300px]">
                    <div className="text-4xl md:text-7xl font-black mb-6 md:mb-12">
                      500K+
                    </div>
                    <p className="text-lg md:text-2xl">
                      Every action (registered, marked stolen, recovered, transferred) is logged with timestamps
                    </p>
                  </div>
                </div>
                <div className="col-span-2 md:col-span-1">
                <div className="panel-accent px-10 md:px-20  flex flex-col justify-start h-full md:min-h-[300px]">
                    <p className="text-lg md:text-2xl mb-6 md:mb-12">
                    Effortless phone ownership transfer for buyers and sellers.
                    </p>
                  <IconUserOwnerShipTransfer className="w-[80%] mx-auto" />
                </div>
                </div>
                <div className="col-span-2 panel-accent px-10 md:px-20">
                  <div className='flex items-end justify-between'>
                  <div className="max-w-2xl mr-auto">
                          <div className='section-badge border border-zinc-300'>
                           Our Pricing
                          </div>

                          <h3 className="section-title">
                            Simple and Affordable Pricing
                          </h3>
                            <p className="text-lg md:text-2xl">
                              For a annual fee of <strong>₦1,000</strong> (Nigeria) per phone, users can verify their device's status and ownership.
                            </p>
                          <div>
                            <Button 
                        onClick={() => navigate(ROUTES.NEW_REGISTRATION)}
                        size="lg"
                        className="mt-10 sm:text-base text-xs rounded-full !px-8">
                       Register Your Phone
                        <ArrowRight className="ml-2 size-5" />
                      </Button>
                          </div>  
                   </div>
                  
                   </div>
                </div>
              </div>
            </div>
        </section>

        {/* Steps Section */}
        <div className="py-20 bg-black mt-20">
          <div className="container px-4 sm:px-6 lg:px-8 text-white">
           <div className="mb-10 border-b border-zinc-800 pb-8">
              <div className="section-badge">
                How to Find Your IMEI 
              </div>
              <div className="grid md:grid-cols-2 gap-4 md:gap-8 items-center">
                <div>
                  <h2 className="section-title text-white">
                    Understanding Your Device IMEI number
                  </h2>
                </div>
                <div className='flex-1 flex items-center justify-end'>
                  <p className="section-subtitle m-0 max-w-xl ml-auto">
                    The IMEI (International Mobile Equipment Identity) is a unique identifier for your mobile device.
                    It helps in tracking, verifying, and securing your device.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12">
                 <div className="space-y-6 bg-zinc-950 p-4 md:p-10">
  
                    <div
                      className="text-6xl md:text-8xl rounded-full font-semibold"
                      style={{
                        background: 'linear-gradient(#eee, #333)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        
                        opacity: 0.7
                      }}
                    >
                      1
                    </div>
            
                    <h3 className="text-white font-semibold text-2xl mt-4">Quick Dial Method</h3>
                    
                    <div className="mt-6 relative">
                      <Input
                        readOnly
                        value="*#06#"
                        className="h-14 w-full text-2xl font-mono pr-12 border-0 bg-zinc-900"
                      />
                      <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                        <Copy className="w-5 h-5 text-zinc-300" />
                      </span>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="hover:bg-transparent cursor-pointer absolute inset-y-0 right-0 px-3"
                        onClick={() => {
                          navigator.clipboard.writeText('*#06#');
                          toast.success('IMEI code copied to clipboard!')
                        }}
                        aria-label="Copy IMEI code"
                        tabIndex={-1}
                        style={{ zIndex: 1 }}
                      />
                    </div>
                    <p className="text-sm text-gray-400 mt-2">
                      Your IMEI will appear instantly on the screen
                    </p>
              </div>
              <div className="space-y-6 bg-zinc-950 p-4 md:p-10">
                    <div
                      className="text-6xl md:text-8xl rounded-full font-semibold"
                      style={{
                        background: 'linear-gradient(#eee, #333)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        
                        opacity: 0.7
                      }}
                    >
                      2
                    </div>
            
                    <h3 className="text-white font-semibold text-2xl mt-4">Through Device Settings</h3>
                    
                    <div className="mt-6 relative">
                      <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-900">
                        <div className="flex text-xs md:text-sm space-x-2">
                          <div>Settings</div>
                          <div className="text-zinc-500">
                            <ArrowRight className="inline size-4" />
                          </div>
                          <div>General / More Settings</div>
                          <div className="text-zinc-500">
                            <ArrowRight className="inline size-4" />
                          </div>
                          <div>About Phone</div>
                        </div>
                        </div>
                    </div>
                    <p className="text-sm text-gray-400 mt-2">
                    Look for "IMEI" or "Device Information"
                    </p>
              </div>
              

            </div>
          </div>
        </div>

        {/* FAQs */} 
        <section className='section-space mt-20'>
          <FAQs />
        </section>
      </div>
  );
}
