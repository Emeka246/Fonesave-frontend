import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  IconUsers, 
  IconCurrencyDollar, 
  IconShield, 
  IconTrendingUp, 
  IconCheck,
  IconArrowRight
} from '@tabler/icons-react';
import ROUTES from '@/routes/ROUTES_CONFIG';

export default function BecomeAgentPage() {
  const navigate = useNavigate();

  const benefits = [
    {
      icon: <IconCurrencyDollar className="h-6 w-6 text-green-600" />,
      title: "Earn in Two Ways",
      description: "Charge customers your own price above ₦1000 platform fee and keep the extra profit"
    },
    {
      icon: <IconUsers className="h-6 w-6 text-purple-600" />,
      title: "Make an Impact",
      description: "Reduce phone theft in your community and create safer neighborhoods"
    },
    {
      icon: <IconShield className="h-6 w-6 text-purple-600" />,
      title: "Flexible Business",
      description: "Work anytime, anywhere with just your phone and internet access"
    },
    {
      icon: <IconTrendingUp className="h-6 w-6 text-orange-600" />,
      title: "Free Registrations",
      description: "Get 1 free registration for every 5 paid ones - keep 100% of what you charge"
    }
  ];

  const requirements = [
    "Own a smartphone with internet access",
    "Valid email address and phone number",
    "Willingness to interact with customers and explain the benefits",
    "Commitment to helping reduce phone theft in your community",
    "Basic understanding of mobile device registration process"
  ];

  const steps = [
    {
      step: "1",
      title: "Sign Up",
      description: "Register as a FonSave Agent with your details"
    },
    {
      step: "2", 
      title: "Fund Wallet",
      description: "Add minimum ₦1000 to your wallet to start"
    },
    {
      step: "3",
      title: "Register Customers",
      description: "Enter customer's email and they receive registration link"
    },
    {
      step: "4",
      title: "Earn Profits",
      description: "Keep extra money charged and get free registrations"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-primary text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Become a <span>FonSave Agent</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-foreground/80">
              Help protect phones and fight theft across Africa while earning money
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-blue-500 hover:bg-blue-600 text-black font-semibold"
                onClick={() => navigate(ROUTES.REGISTER)}
              >
                Register as Agent
                <IconArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Become a FonSave Agent?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              FonSave Agents help protect phones and fight theft across Africa. As an agent, you earn money every time you register a device, while also creating safer communities.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex justify-center mb-4">
                    {benefit.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Agent Requirements
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                To become a FonSave Agent, you need to meet these basic requirements:
              </p>
              <ul className="space-y-4">
                {requirements.map((requirement, index) => (
                  <li key={index} className="flex items-start">
                    <IconCheck className="h-6 w-6 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{requirement}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-lg p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Agent Rewards Structure</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b">
                  <span className="text-gray-600">Platform Fee</span>
                  <Badge variant="outline" className="text-purple-600 border-purple-600">
                    ₦1000 per registration
                  </Badge>
                </div>
                <div className="flex justify-between items-center py-3 border-b">
                  <span className="text-gray-600">Your Charge</span>
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    Your own price
                  </Badge>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-gray-600">Free Registration</span>
                  <Badge variant="outline" className="text-purple-600 border-purple-600">
                    Every 5 paid ones
                  </Badge>
                </div>
              </div>
              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-green-800">
                  <strong>How it works:</strong> Charge customers your own price above ₦1000 platform fee. Keep the extra money (e.g., if you charged ₦1500, you keep ₦500). After every 5 paid registrations, you get 1 free registration worth ₦1000.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Get started as a FonSave Agent in just 4 simple steps
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Join the Movement Today
          </h2>
          <p className="text-xl mb-8 text-primary-foreground/80">
            Every registered phone is one less stolen phone in circulation. Become a FonSave Agent today — earn money while protecting your community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-blue-500 hover:bg-blue-600 text-black font-semibold"
              onClick={() => navigate(ROUTES.REGISTER)}
            >
              Register as Agent Now
              <IconArrowRight className="ml-2 h-5 w-5" />
            </Button>

          </div>
        </div>
      </section>
    </div>
  );
}
