import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Shield, Users, Globe } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import ROUTES from "@/routes/ROUTES_CONFIG";

export default function About() {
  const navigate = useNavigate();

  const isMobile = useIsMobile();

  const backgroundImage = isMobile
    ? "/images/about-bg-mobile.webp"
    : "/images/about-bg.webp";

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className=" bg-zinc-100 dark:bg-zinc-950">
        <div className="container py-32 lg:py-40">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <Badge className="section-badge">About FoneOwner</Badge>
            <h1 className="page-title">
              Africa's Trusted Phone Protection Platform
            </h1>
            <p className="section-subtitle max-w-2xl mx-auto">
              We are dedicated to helping individuals, phone dealers, and
              organizations register, protect, and verify phone IMEI numbers.
              Our mission is simple: reduce phone theft and make buying and
              selling phones safer for everyone.
            </p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <section className="section-space">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Stats always on top on mobile, left on desktop */}
            <div className="panel-accent px-10 md:px-20 flex flex-col justify-center h-full">
              <div className="text-4xl md:text-7xl font-black mb-6 md:mb-12">
                🎯
              </div>
              <p className="text-lg md:text-2xl">
                To create a secure, reliable, and accessible database where
                users across Nigeria and Africa can register, verify, and
                protect their phone IMEI numbers
              </p>
            </div>
            {/* Mission always below on mobile, right on desktop */}
            <div className="order-1 md:order-2 space-y-6">
              <div className="section-badge">🎯 Our Mission</div>
              <h2 className="section-title">
                Creating a safer phone market across Africa
              </h2>
              <p className="section-text">
                Every day, thousands of phones are stolen across Africa. Most
                victims never recover their devices, and buyers risk unknowingly
                purchasing stolen phones. FoneOwner provides the solution.
              </p>
              <p className="section-text">
                We help build a society where stolen phones are harder to sell —
                discouraging theft and saving people money and stress.
              </p>
              <div className="flex items-center space-x-4">
                <Button
                  onClick={() => navigate(ROUTES.NEW_REGISTRATION)}
                  className="rounded-full px-6 font-medium"
                >
                  Register Your Phone
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-space">
        <div className="container">
          <div
            className="px-6 py-8 md:px-10 md:py-10 rounded-3xl shadow-xl bg-cover bg-right pb-64 border border-zinc-200 dark:border-zinc-700"
            style={{
              backgroundImage: `url(${backgroundImage})`,
            }}
          >
            <div className="max-w-2xl mb-8 md:mb-12">
              <div className="section-badge">Why FoneOwner Matters</div>
              <h2 className="section-title-sm text-zinc-950">
                Building a safer phone ecosystem
              </h2>
            </div>

            <div className="flex flex-col gap-6 md:gap-8 max-w-md">
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <Shield className="size-6 text-zinc-800" />
                  <h3 className="text-lg font-semibold text-zinc-800">
                    Peace of Mind
                  </h3>
                </div>
                <p className="text-muted-foreground">
                  Secure your phone by registering its IMEI and protect it from
                  theft
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <Users className="size-6 text-zinc-800" />
                  <h3 className="text-lg font-semibold text-zinc-800">
                    Transparency
                  </h3>
                </div>
                <p className="text-muted-foreground">
                  Check if a phone is safe before buying with our instant
                  verification system
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <Globe className="size-6 text-zinc-800" />
                  <h3 className="text-lg font-semibold text-zinc-800">
                    Accountability
                  </h3>
                </div>
                <p className="text-muted-foreground">
                  Create a trusted environment for phone dealers and buyers
                  across Africa
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Agent Program Section */}
      <section className="section-space">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="section-badge">For Phone Dealers & Agents</div>
              <h2 className="section-title">
                Partner with us to build a safer phone market
              </h2>
              <p className="section-text max-w-2xl mx-auto">
                FoneOwner partners with local phone dealers and independent
                agents who help register users' devices and earn rewards while
                building a safer phone market.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="panel-accent space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Users className="size-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">For Agents</h3>
                <p className="text-muted-foreground">
                  Earn commissions on every successful registration. Help users
                  protect their devices while building your income.
                </p>
              </div>

              <div className="panel-accent space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Shield className="size-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">For Dealers</h3>
                <p className="text-muted-foreground">
                  Ensure all phones sold in your stores are properly verified.
                  Build trust with customers and reduce fraud risk.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="section-space bg-zinc-50 dark:bg-zinc-900">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <div className="section-badge">Our Vision</div>
            <h2 className="section-title">
              To become Africa's largest and most reliable IMEI verification
              platform
            </h2>
            <p className="section-text">
              Starting from Nigeria and expanding across the continent. We want
              every phone buyer and seller to say:
            </p>
            <div className="mt-8 p-6 bg-primary/5 rounded-2xl border border-primary/20">
              <p className="text-lg font-semibold text-primary italic">
                "Check it on FoneOwner before you buy."
              </p>
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              Created to solve the growing challenge of stolen phones in African
              markets
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="section-space">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <div className="section-badge">How It Works</div>
            <h2 className="section-title">
              Simple, fast, and reliable verification
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-sm">
            <div className="panel-accent space-y-4">
              <div className="w-8 h-8 text-lg font-extrabold border-2 border-primary rounded-full flex items-center justify-center">
                1
              </div>
              <h3 className="text-lg font-semibold">Register IMEI</h3>
              <p className="text-muted-foreground text-sm">
                Register your phone's 15-digit IMEI number for protection
                against theft
              </p>
            </div>

            <div className="panel-accent space-y-4">
              <div className="w-8 h-8 text-lg font-extrabold border-2 border-primary rounded-full flex items-center justify-center">
                2
              </div>
              <h3 className="text-lg font-semibold">Verify Before Buying</h3>
              <p className="text-muted-foreground text-sm">
                Check if a second-hand phone is safe before purchase with
                instant verification
              </p>
            </div>

            <div className="panel-accent space-y-4">
              <div className="w-8 h-8 text-lg font-extrabold border-2 border-primary rounded-full flex items-center justify-center">
                3
              </div>
              <h3 className="text-lg font-semibold">Report Stolen</h3>
              <p className="text-muted-foreground text-sm">
                Instantly report stolen or missing devices to help prevent
                resale
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Get Involved Section */}
      <section className="section-space bg-primary/5">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <div className="section-badge">Get Involved</div>
            <h2 className="section-title">
              Join the movement to stop phone theft
            </h2>
            <p className="section-text max-w-2xl mx-auto mb-12">
              Whether you're a phone owner, dealer, agent, or part of law
              enforcement, there's a place for you in building a safer phone
              market.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="panel-accent space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Shield className="size-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">Phone Owners</h3>
                <p className="text-muted-foreground text-sm">
                  Register your IMEI now and protect your device from theft
                </p>
              </div>

              <div className="panel-accent space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Users className="size-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">Dealers & Agents</h3>
                <p className="text-muted-foreground text-sm">
                  Join our agent program to earn rewards while building a safer
                  market
                </p>
              </div>

              <div className="panel-accent space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Globe className="size-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">Law Enforcement</h3>
                <p className="text-muted-foreground text-sm">
                  Partner with us to fight phone theft and fraud in your
                  community
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <Button
                onClick={() => navigate(ROUTES.NEW_REGISTRATION)}
                size="lg"
                className="rounded-full px-8 font-medium"
              >
                Protect Your Phone Now
              </Button>
              <p className="text-sm text-muted-foreground">
                FoneOwner.com – Register Your Phone Now — In Case of Theft or
                Loss.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
