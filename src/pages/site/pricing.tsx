import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Zap, Users, Gift, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Pricing() {
  const navigate = useNavigate();
  const [currency, setCurrency] = useState<"NGN" | "USD">("NGN");

  const exchangeRate = 1100; // Example: 1 USD = 1500 NGN

 

  // Helper to convert and format price
  function formatPrice(naira: string) {
    const amount = parseInt(naira.replace(/[^\d]/g, ""), 10);
    if (currency === "NGN") {
      return `₦${amount.toLocaleString()}`;
    } else {
      const usd = (amount / exchangeRate).toFixed(2);
      return `$${usd}`;
    }
  }

  const plans = [
    {
      name: "Normal User",
      description: "Standard registration for individuals",
      price: "₦1,000",
      period: "per registration",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      features: [
        "IMEI verification",
        "Theft reporting capability",
        "Email notifications",
        "Public database listing",
        "Recovery assistance",
      ],
      buttonText: "Register Now",
      popular: false,
      type: "normal"
    },
    {
      name: "Agent Program",
      description: "Special rates for agents helping others register",
      price: "₦800",
      period: "per registration",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      features: [
        "Discounted ₦800 rate (₦200 savings)",
        "1 FREE registration every 5 paid",
        "Pre-fund account for instant registration",
        "Higher earning potential",
        "Priority support",
      ],
      buttonText: "Join Agent Program",
      popular: true,
      type: "agent"
    }
  ];

  // Update plan prices based on currency
  const displayedPlans = plans.map(plan => ({
    ...plan,
    price: formatPrice(plan.price)
  }));

 

  const agentBenefits = [
    {
      icon: TrendingUp,
      title: "Higher Earnings",
      description: "Keep the difference when registering for others at full price"
    },
    {
      icon: Zap,
      title: "Faster Processing", 
      description: "Pre-funded accounts enable instant registration without delays"
    },
    {
      icon: Gift,
      title: "Loyalty Rewards",
      description: "Earn 1 free registration for every 5 paid registrations"
    },
    {
      icon: Users,
      title: "Steady Business",
      description: "Build a customer base who return for faster, cheaper service"
    }
  ];

  return (
    <div className="container">
      {/* Header Section */}
     

      {/* Pricing Cards */}
      <section className="section-space"> 
         <div className="text-center mb-10 mx-auto">
        <Badge variant="secondary" className="mb-4">
          Registration Pricing
        </Badge>
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Choose Your <span className="text-primary">Registration Plan</span>
        </h1>
      </div>

      {/* Currency Switcher */}
      <div className="flex justify-center mb-10">
        <div className="inline-flex border rounded-lg overflow-hidden">
          <button
            className={`px-4 py-2 text-sm font-medium ${currency === "NGN" ? "bg-zinc-900 text-white" : "bg-white text-zinc-900"}`}
            onClick={() => setCurrency("NGN")}
          >
            NGN (₦)
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${currency === "USD" ? "bg-zinc-900 text-white" : "bg-white text-zinc-900"}`}
            onClick={() => setCurrency("USD")}
          >
            USD ($)
          </button>
        </div>
      </div>
   
      <div className="max-w-5xl mx-auto grid gap-8">
        <div className="grid grid-cols-2 gap-md">
            {displayedPlans.map((plan, index) => {
            return (
                <Card 
                key={index}
                className={`relative ${plan.popular ? 'border border-blue-600' : ''}`}
                >
                {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-600 hover:bg-blue-700">
                        Recommended for Agents
                    </Badge>
                    </div>
                )}
                <CardContent>
                
                            <div className="relative mb-6">
                        <div className="text-xl font-bold">{plan.name}</div>
                    </div>
                    <div className="mb-6">
                        <div className="flex items-center gap-4">
                            <div className="text-3xl font-bold">{plan.price}</div>
                            {plan.type === "agent" && (
                        <div>
                        </div>
                    )}
                    </div>
                    
                    <div className="text-muted-foreground">{plan.period}</div>
                    
                    </div>
                   
                    
                            <ul className="space-y-3 mb-10">
                    {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start gap-3">
                        <Check className="h-5 w-5 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                        </li>
                    ))}
                    </ul>
                     
                    <Button 
                    className={`${plan.popular ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                    onClick={() => navigate('/register')}
                    >
                    <Zap className="h-4 w-4 mr-2" />
                    {plan.buttonText}
                    </Button>
                </CardContent>
                </Card>
            );
            })}
        </div>
      </div>
      </section>

      {/* Agent Benefits */}
      <section className="section-space">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Join the Agent Program?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Build a profitable business while helping your community secure their devices
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-sm">
          {agentBenefits.map((benefit, index) => (
            <Card key={index} className="text-center bg-white/70 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                  <benefit.icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold mb-2">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      
      </section>
    </div>
  );
}