import { AppLogo } from "../../common/app/app-logo";
import { Button } from "@/components/ui/button";
import { useNavigate, Link } from "react-router-dom";
import ROUTES from "@/routes/ROUTES_CONFIG";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";

export const SiteFooter = () => {
    const navigate = useNavigate();
    const scrollToTop = useScrollToTop();
    return (
        <footer className="p-0 mt-20 md:mt-10">
            {/* Call to Action Section */}
              <div className="flex *:items-center justify-center -mb-20">
                <div className="container section-space pb-0 ">
                    <div className="panel-inverse">
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-4">
                            <h2 className="text-xl md:text-4xl font-bold text-white">
                                Ready to level up your
                                <br />
                                device verification?
                            </h2> 
                        <p className="text-zinc-300 text-sm text-balance">
                            Trusted by phone users and agents across the World for secure device verification.
                        </p>
                        </div>
                        
                            {/* Call to Action Buttons */}
                        <div className="flex-col md:flex-row flex gap-4 md:items-center justify-end">
                            <Button 
                                onClick={() => {
                                    navigate(ROUTES.NEW_REGISTRATION);
                                    scrollToTop();
                                }}
                                className="rounded-full px-6 font-medium"
                                variant="white"
                            >
                                Register Your Phone
                            </Button>
                            <Button 
                                variant="blue"
                                onClick={() => navigate(ROUTES.BECOME_AGENT)}
                                className='rounded-full px-6 font-medium'
                            >
                                Become an Agent
                            </Button>
                            </div>
                        </div>
                    </div>
                </div> 
              </div>
            {/* Footer Content */}
              <div className="bg-zinc-200 dark:bg-zinc-950 pt-30">
                <div className="container py-10">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
                      <div className="col-span-2">
                        <div className="flex items-start space-x-2 mb-6">
                            <AppLogo />
                        </div>
                        <p className="text-zinc-600 dark:text-zinc-300 mb-4 text-balance">
                          Our platform leverages cutting-edge tools and a vast device database to deliver fast, reliable results.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold  mb-4">Follow Us</h4>
                        <ul className="space-y-2 text-zinc-600 dark:text-zinc-300">
                          <li><a href="#" className="hover:">Facebook</a></li>
                          <li><a href="#" className="hover:">Instagram</a></li>
                          <li><a href="https://x.com/Fonsaveofficial?t=83B1NlbpC8RQ9cNHI3wOsA&s=09" target="_blank" rel="noopener noreferrer" className="hover:">X (Twitter)</a></li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold  mb-4">Company</h4>
                        <ul className="space-y-2 text-zinc-600 dark:text-zinc-300">
                          <li><Link to="/about" className="hover:" onClick={scrollToTop}>About Us</Link></li>
                          <li><Link to="/why-trust-us" className="hover:" onClick={scrollToTop}>Why Trust Us</Link></li>
                          <li><Link to="/contact" className="hover:" onClick={scrollToTop}>Contact</Link></li>
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold  mb-4">Legal</h4>
                        <ul className="space-y-2 text-zinc-600 dark:text-zinc-300">
                          <li><Link to="/privacy-policy" className="hover:" onClick={scrollToTop}>Privacy Policy</Link></li>
                          <li><Link to="/terms-conditions" className="hover:" onClick={scrollToTop}>Terms & Conditions</Link></li>
                          <li><Link to="/disclaimer" className="hover:" onClick={scrollToTop}>Disclaimer</Link></li>
                          <li><Link to="/refund-policy" className="hover:" onClick={scrollToTop}>Refund Policy</Link></li>
                        </ul>
                      </div>
                    </div>        
                    <div className="border-t border-zinc-200 pt-8 flex flex-col sm:flex-row justify-between items-center">
                      <p className="text-zinc-500 text-sm">
                        © 2025 FonSave. All rights reserved.
                      </p>
                    </div>
                </div>
              </div>
        </footer>
    );
};