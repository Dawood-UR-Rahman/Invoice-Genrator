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
    icon: "fas fa-bolt",
    title: "Fast and Easy",
    description: "Generate invoices in seconds. Add your logo, client details, and items, and your invoice is ready."
  },
  {
    icon: "fas fa-palette",
    title: "Fully Customizable",
    description: "Personalize your invoices with templates, colors, fonts, and branding to reflect your business style."
  },
  {
    icon: "fas fa-sync-alt",
    title: "Automated & Recurring",
    description: "Save time by automating recurring invoices and payment reminders."
  },
  {
    icon: "fas fa-chart-line",
    title: "Track Payments",
    description: "Stay on top of your business with real-time tracking of paid, pending, and overdue invoices."
  },
  {
    icon: "fas fa-shield-alt",
    title: "Secure and Reliable",
    description: "Your data is protected, and every invoice complies with modern billing standards."
  },
  {
    icon: "fas fa-globe",
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
    icon: "fas fa-gift",
    title: "Free Invoice Generator",
    description: "Start creating invoices at no cost."
  },
  {
    icon: "fas fa-th-large",
    title: "Multiple Templates",
    description: "Professional designs for every business type."
  },
  {
    icon: "fas fa-file-pdf",
    title: "PDF & Email Delivery",
    description: "Download invoices or send them directly to clients."
  },
  {
    icon: "fas fa-calculator",
    title: "Tax & Discount Calculations",
    description: "Automatic totals for hassle-free billing."
  },
  {
    icon: "fas fa-link",
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
      <section>
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Why Choose Invoicedetail.com?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover the features that make invoicing simple and professional
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 glass border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-primary to-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <i className={`${feature.icon} text-white text-2xl`}></i>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-4">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gradient-to-br from-secondary/50 to-background rounded-3xl p-8 md:p-12 border border-border">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Features You'll Love
            </h2>
            <div className="space-y-6">
              {additionalFeatures.map((feature, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <i className={`${feature.icon} text-white text-lg`}></i>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <img 
              src={featuresImage} 
              alt="Invoice Features" 
              className="w-full h-auto rounded-2xl shadow-2xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent rounded-2xl"></div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section>
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Create professional invoices in just 5 simple steps
          </p>
          <img 
            src={processImage} 
            alt="Invoice Creation Process" 
            className="w-full max-w-4xl mx-auto h-auto rounded-2xl shadow-2xl mb-8"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {processSteps.map((step, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white border-0 shadow-lg relative overflow-hidden">
              <CardContent className="p-6 text-center relative z-10">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-primary to-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white text-xl font-bold">{step.number}</span>
                </div>
                <h3 className="text-lg font-bold text-foreground mb-3">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
              </CardContent>
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-gradient-to-br from-secondary/30 to-accent/30 rounded-3xl p-8 md:p-12 border border-border">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about our invoice generator
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {faqs.map((faq, index) => (
            <Card key={index} className="glass border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-foreground mb-3">{faq.question}</h3>
                <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
              </CardContent>
            </Card>
          ))}
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