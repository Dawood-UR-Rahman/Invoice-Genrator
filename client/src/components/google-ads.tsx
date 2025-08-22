import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface GoogleAdsProps {
  adSlot?: string;
  adFormat?: 'horizontal' | 'vertical' | 'square';
  className?: string;
}

export default function GoogleAds({ 
  adSlot = "demo-ad-slot", 
  adFormat = "horizontal",
  className = "" 
}: GoogleAdsProps) {
  const [adLoaded, setAdLoaded] = useState(false);
  const [showDemo, setShowDemo] = useState(true);

  useEffect(() => {
    // Simulate ad loading
    const timer = setTimeout(() => {
      setAdLoaded(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const getDemoAdContent = () => {
    const ads = [
      {
        title: "Professional Templates",
        description: "Create stunning invoices with our premium templates",
        cta: "Upgrade Now",
        color: "bg-blue-500"
      },
      {
        title: "Invoice Analytics",
        description: "Track payments and client insights with our dashboard",
        cta: "Learn More", 
        color: "bg-green-500"
      },
      {
        title: "Auto Payment Reminders",
        description: "Never miss a payment with automated follow-ups",
        cta: "Try Free",
        color: "bg-purple-500"
      },
      {
        title: "Multi-Currency Support",
        description: "Invoice globally with 50+ currencies supported",
        cta: "Explore",
        color: "bg-orange-500"
      }
    ];

    return ads[Math.floor(Math.random() * ads.length)];
  };

  const demoAd = getDemoAdContent();

  const getAdDimensions = () => {
    switch (adFormat) {
      case 'vertical':
        return 'w-full h-96';
      case 'square':
        return 'w-full aspect-square';
      case 'horizontal':
      default:
        return 'w-full h-24';
    }
  };

  if (showDemo) {
    return (
      <Card className={`${className} overflow-hidden`}>
        <CardContent className="p-0">
          <div className={`${getAdDimensions()} ${demoAd.color} text-white relative`}>
            <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
            <div className="relative h-full flex flex-col justify-center p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs bg-white/20 px-2 py-1 rounded">Advertisement</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white/70 hover:text-white p-1 h-auto"
                  onClick={() => setShowDemo(false)}
                >
                  <i className="fas fa-times text-xs"></i>
                </Button>
              </div>
              
              <h3 className="text-lg font-bold mb-1">{demoAd.title}</h3>
              <p className="text-sm text-white/90 mb-3">{demoAd.description}</p>
              
              <Button 
                size="sm" 
                variant="secondary" 
                className="self-start bg-white text-gray-900 hover:bg-gray-100"
              >
                {demoAd.cta}
              </Button>
            </div>
            
            <div className="absolute bottom-1 right-1">
              <span className="text-xs text-white/60">Sponsored</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`${className} overflow-hidden`}>
      <CardContent className="p-4">
        <div className={`${getAdDimensions()} border-2 border-dashed border-gray-300 rounded flex items-center justify-center bg-gray-50`}>
          {!adLoaded ? (
            <div className="text-center">
              <i className="fas fa-spinner fa-spin text-2xl text-gray-400 mb-2"></i>
              <p className="text-sm text-gray-500">Loading advertisement...</p>
            </div>
          ) : (
            <div className="text-center">
              <i className="fas fa-ad text-2xl text-gray-400 mb-2"></i>
              <p className="text-sm text-gray-500">Google Ads Placeholder</p>
              <p className="text-xs text-gray-400 mt-1">Ad Slot: {adSlot}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Google Ads Integration Component
export function GoogleAdsScript() {
  useEffect(() => {
    // Add Google AdSense script to document head only once
    const scriptId = 'google-adsense-script';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.async = true;
      script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-demo';
      script.crossOrigin = 'anonymous';
      document.head.appendChild(script);

      // Initialize ads after a delay
      setTimeout(() => {
        try {
          ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
        } catch (e) {
          console.log('AdSense initialization delayed');
        }
      }, 1000);
    }
  }, []);

  return null;
}

// Responsive Google Ad Component
export function ResponsiveGoogleAd({ 
  adSlot, 
  className = "",
  adFormat = "auto" 
}: {
  adSlot: string;
  className?: string;
  adFormat?: string;
}) {
  return (
    <div className={`google-ad-container ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-XXXXXXXXXX"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive="true"
      />
    </div>
  );
}