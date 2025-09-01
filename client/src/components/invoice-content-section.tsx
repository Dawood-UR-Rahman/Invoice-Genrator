import { Card, CardContent } from "@/components/ui/card";
import heroImage from "@/assets/Professional_invoice_dashboard_hero_83e6a056.png";
import featuresImage from "@/assets/Invoice_business_features_showcase_00ba884b.png";
import processImage from "@/assets/Invoice_workflow_process_diagram_8ee2c762.png";

interface FeatureItem {
  icon: string;
  title: string;
  description: string;
}

interface ProcessStep {
  number: string;
  title: string;
  description: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

const features: FeatureItem[] = [
  {
    icon: "⚡",
    title: "Fast and Easy",
    description: "Generate invoices in seconds. Add your logo, client details, and items, and your invoice is ready."
  },
  {
    icon: "🎨",
    title: "Fully Customizable",
    description: "Personalize your invoices with templates, colors, fonts, and branding to reflect your business style."
  },
  {
    icon: "🔄",
    title: "Automated & Recurring",
    description: "Save time by automating recurring invoices and payment reminders."
  },
  {
    icon: "📊",
    title: "Track Payments",
    description: "Stay on top of your business with real-time tracking of paid, pending, and overdue invoices."
  },
  {
    icon: "🛡️",
    title: "Secure and Reliable",
    description: "Your data is protected, and every invoice complies with modern billing standards."
  },
  {
    icon: "🌍",
    title: "Multi-Currency Support",
    description: "Invoice clients around the world with ease using any major currency."
  }
];

const processSteps: ProcessStep[] = [
  {
    number: "01",
    title: "Enter Details",
    description: "Enter your business and client details."
  },
  {
    number: "02",
    title: "Add Items",
    description: "Add products, services, and pricing."
  },
  {
    number: "03",
    title: "Customize",
    description: "Select a template and customize your invoice."
  },
  {
    number: "04",
    title: "Download/Send",
    description: "Download as PDF or send directly to your client."
  },
  {
    number: "05",
    title: "Track",
    description: "Track payments and automate reminders."
  }
];

const additionalFeatures: FeatureItem[] = [
  {
    icon: "🎁",
    title: "Free Invoice Generator",
    description: "Start creating invoices at no cost."
  },
  {
    icon: "📄",
    title: "Multiple Templates",
    description: "Professional designs for every business type."
  },
  {
    icon: "📧",
    title: "PDF & Email Delivery",
    description: "Download invoices or send them directly to clients."
  },
  {
    icon: "🧮",
    title: "Tax & Discount Calculations",
    description: "Automatic totals for hassle-free billing."
  },
  {
    icon: "🔗",
    title: "Accounting Integrations",
    description: "Sync with QuickBooks, Xero, or other tools."
  }
];

const faqs: FAQItem[] = [
  {
    question: "What is Invoicedetail.com?",
    answer: "A free, online invoice generator designed for freelancers, small businesses, and entrepreneurs."
  },
  {
    question: "Can I customize my invoices?",
    answer: "Yes! Add logos, colors, fonts, and branding to every invoice."
  },
  {
    question: "Is there a limit to the number of invoices?",
    answer: "No. Create unlimited invoices with our free or premium options."
  },
  {
    question: "Can I automate recurring invoices?",
    answer: "Absolutely. Set schedules for recurring billing and automated reminders."
  },
  {
    question: "Does it support multiple currencies?",
    answer: "Yes, invoice clients worldwide in any major currency."
  },
  {
    question: "How do I send invoices?",
    answer: "Invoices can be downloaded as PDFs or emailed directly to clients."
  },
  {
    question: "Is my data secure?",
    answer: "Yes, we prioritize data security and comply with modern privacy standards."
  },
  {
    question: "Can I integrate it with accounting software?",
    answer: "Yes, we support integration with tools like QuickBooks and Xero."
  },
  {
    question: "Do you offer templates for different business types?",
    answer: "Yes, we have templates for freelancers, agencies, and small businesses."
  },
  {
    question: "Is it free to use?",
    answer: "Our basic invoice generator is completely free, with premium features available for advanced needs."
  }
];

export default function InvoiceContentSection() {
  return (
    <div className="space-y-16 py-16">
      {/* Hero Section */}
      <section className="text-center">
        <div className="mx-auto max-w-4xl">
          <div className="relative mb-8">
            <img 
              src={heroImage} 
              alt="Professional Invoice Management" 
              className="w-full h-64 md:h-80 object-cover rounded-2xl shadow-2xl"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-2xl"></div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-purple-600 to-blue-600 bg-clip-text text-transparent mb-6">
            Create Professional Invoices Instantly
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
            Simplify Your Billing with Our Free Invoice Generator
          </p>
          <p className="text-lg text-foreground/80 max-w-3xl mx-auto leading-relaxed">
            Invoicedetail.com making invoices effortless. Whether you're a freelancer, small business owner, or entrepreneur, 
            our online invoice generator helps you create professional invoices in minutes. No complicated software. 
            No manual calculations. Just accurate, polished invoices ready to send.
          </p>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="relative">
          <img 
            src={featuresImage} 
            alt="Invoice Features" 
            className="w-full h-auto rounded-2xl shadow-2xl"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent rounded-2xl"></div>
        </div>
        
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Why Choose Invoicedetail.com?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Discover the features that make invoicing simple and professional
          </p>
          
          <div className="space-y-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-primary to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xl">{feature.icon}</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gradient-to-br from-secondary/50 to-background rounded-3xl p-8 md:p-12 border border-border">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <img 
              src={processImage} 
              alt="Invoice Workflow Process" 
              className="w-full h-auto rounded-2xl shadow-2xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent rounded-2xl"></div>
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Features You'll Love
            </h2>
            <div className="space-y-6">
              {additionalFeatures.map((feature, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xl">{feature.icon}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section - Image Right */}
      <section className="bg-gradient-to-br from-secondary/50 to-background rounded-3xl p-8 md:p-12 border border-border">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Create professional invoices in just 5 simple steps
            </p>
            <div className="space-y-6">
              {processSteps.map((step, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-lg font-bold">{step.number}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <img 
              src={heroImage} 
              alt="Invoice Creation Dashboard" 
              className="w-full h-auto rounded-2xl shadow-2xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent rounded-2xl"></div>
          </div>
        </div>
      </section>

      {/* Professional Solutions Section - Image Left */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="relative">
          <img 
            src={processImage} 
            alt="Professional Invoice Solutions" 
            className="w-full h-auto rounded-2xl shadow-2xl"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent rounded-2xl"></div>
        </div>
        
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Professional Solutions
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Everything you need to know about our invoice generator
          </p>
          
          <div className="space-y-6">
            {faqs.slice(0, 5).map((faq, index) => (
              <div key={index} className="space-y-3">
                <h3 className="text-lg font-semibold text-foreground">{faq.question}</h3>
                <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Advanced Features Section - Image Right */}
      <section className="bg-gradient-to-br from-secondary/30 to-accent/30 rounded-3xl p-8 md:p-12 border border-border">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Advanced Features
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Powerful tools for professional invoice management
            </p>
            
            <div className="space-y-6">
              {faqs.slice(5).map((faq, index) => (
                <div key={index} className="space-y-3">
                  <h3 className="text-lg font-semibold text-foreground">{faq.question}</h3>
                  <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <img 
              src={featuresImage} 
              alt="Advanced Invoice Features" 
              className="w-full h-auto rounded-2xl shadow-2xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent rounded-2xl"></div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center gradient-primary rounded-3xl p-8 md:p-12 text-primary-foreground">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Ready to Create Your First Invoice?
        </h2>
        <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
          Join thousands of businesses already using Invoicedetail.com to streamline their billing process
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <div className="flex items-center gap-2 text-lg">
            <i className="fas fa-check text-green-300"></i>
            <span>Free Forever</span>
          </div>
          <div className="flex items-center gap-2 text-lg">
            <i className="fas fa-check text-green-300"></i>
            <span>No Credit Card Required</span>
          </div>
          <div className="flex items-center gap-2 text-lg">
            <i className="fas fa-check text-green-300"></i>
            <span>Unlimited Invoices</span>
          </div>
        </div>
      </section>
    </div>
  );
}