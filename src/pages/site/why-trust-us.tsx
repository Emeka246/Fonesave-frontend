import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Shield,
  Award, 
  Users, 
  CheckCircle, 
  Database,
  Lock,
  Zap,

} from 'lucide-react';

export default function WhyTrustUs() {
  
  const trustFactors = [
    {
      icon: Shield,
      title: 'Enterprise-Grade Security',
      description: 'Bank-level encryption and security protocols protect your data and searches.',
      color: 'blue'
    },
    {
      icon: Database,
      title: 'Comprehensive Global Database',
      description: 'Access to the world\'s largest IMEI database with real-time updates from multiple sources.',
      color: 'green'
    },
    {
      icon: Zap,
      title: 'Lightning-Fast Results',
      description: 'Get instant verification results in under 3 seconds with our optimized infrastructure.',
      color: 'yellow'
    },
    {
      icon: Lock,
      title: 'Privacy First Approach',
      description: 'Your searches are private and never stored. We prioritize user privacy above all.',
      color: 'purple'
    },
    {
      icon: Award,
      title: 'Industry Recognition',
      description: 'Trusted by law enforcement, insurance companies, and mobile retailers worldwide.',
      color: 'orange'
    },
    {
      icon: Users,
      title: 'Community-Driven Updates',
      description: 'Crowdsourced data from verified users ensures the most up-to-date information.',
      color: 'teal'
    }
  ];

  const certifications = [
    'ISO 27001 Certified',
    'GDPR Compliant',
    'CCPA Compliant',
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className='-mt-24 bg-zinc-100 dark:bg-zinc-950'>
        <div className="container py-32 lg:py-40">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <Badge className="section-badge">
              Why Trust FonSave
            </Badge>
            <h1 className="page-title">
              The most trusted IMEI verification platform worldwide
            </h1>
            <p className="section-subtitle max-w-3xl mx-auto">
              Join millions who trust FonSave for secure, accurate, and instant device verification. 
              Here's why we're the industry leader in mobile device security.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      {/* <section className="section-space">
        <div className="container border-y border-zinc-200 py-7">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className='flex items-center justify-center gap-4'>
                        <div className="w-12 h-12 rounded-full flex items-center justify-center">
                            <stat.icon className="w-6 h-6 text-primary" />
                        </div>
                        <div className='relative'>
                        <p className="text-xl font-bold">{stat.label}</p>
                  </div>
                  </div>
            ))}
          </div>
        </div>
      </section> */}

     
      <section className="section-space">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <div className="section-badge">
              Trust & Security
            </div>
            <h2 className="section-title">
              Built on a foundation of trust and reliability
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-sm">
            {trustFactors.map((factor, index) => (
              <Card key={index} className="panel h-full">
                <CardHeader>
                    <factor.icon className={`w-6 h-6 mb-4`} />
                  <CardTitle className="text-lg">{factor.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{factor.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
       {/* Trust Factors */}
      <section className="section-space">
        <div className="container">
            <div 
                className="relative rounded-3xl shadow-xl overflow-hidden min-h-[500px] border border-zinc-200 dark:border-zinc-700"
                style={{
                    backgroundImage: `url('/images/why-trust-us-bg.webp')`,
                    backgroundSize: 'auto 100%',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right center'
                }}
            >
                {/* Gradient overlay for smooth blending */}
                <div className="absolute inset-0" style={{
                    background: 'linear-gradient(to right, white 0%, white 50%, rgba(255,255,255,0.5) 70%, transparent 100%)'
                }}></div>
               
                
                {/* Content */}
                <div className="relative z-10 px-6 py-8 md:px-10 md:py-10 h-full flex items-center">
                    <div className="max-w-2xl">
                        <div>
              <div className="section-badge">
                Trusted by Industry Leaders
              </div>
              <h2 className="section-title text-zinc-900">
                Powering security for businesses worldwide
              </h2>
              <p className="section-subtitle text-balance">
                From small retailers to Fortune 500 companies, FonSave is the preferred choice 
                for device verification and fraud prevention.
              </p>
              
              <div className="space-y-4 mt-8 *:text-zinc-800">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 " />
                  <span>Used by 50+ law enforcement agencies</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 " />
                  <span>Trusted by major insurance providers</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 " />
                  <span>Integrated by leading mobile retailers</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 " />
                  <span>Preferred by enterprise security teams</span>
                </div>
              </div>
            </div>
                    </div>
                </div>
            </div>
        </div>
      </section>
   

      {/* Certifications & Compliance */}
      <section className="section-space">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <div className="section-badge">
              Certifications & Compliance
            </div>
            <h2 className="section-title">
              Meeting the highest industry standards
            </h2>
            <p className="section-subtitle">
              We maintain rigorous certifications and compliance standards to ensure your data is protected
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mx-auto">
            {certifications.map((cert, index) => (
              <Card key={index} className="text-center panel-accent">
                <CardContent className="pt-6">
                  <Award className="w-8 h-8 text-primary mx-auto mb-3" />
                  <p className="font-medium text-sm">{cert}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>


    </div>
  );
}