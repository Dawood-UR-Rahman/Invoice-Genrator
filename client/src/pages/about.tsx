import { Card, CardContent } from "@/components/ui/card";

export default function About() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">About Invoice Pro</h1>
        <p className="text-xl text-muted-foreground">
          Professional invoicing made simple for modern businesses
        </p>
      </div>

      {/* Mission */}
      <Card>
        <CardContent className="p-8">
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            We believe that creating professional invoices shouldn't be complicated or expensive. 
            Invoice Pro was built to empower businesses of all sizes with a simple, powerful, and 
            beautiful invoicing solution that helps you get paid faster.
          </p>
        </CardContent>
      </Card>

      {/* Features */}
      <Card>
        <CardContent className="p-8">
          <h2 className="text-2xl font-semibold mb-6">What We Offer</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <i className="fas fa-receipt text-primary"></i>
                </div>
                <div>
                  <h3 className="font-semibold">Professional Templates</h3>
                  <p className="text-sm text-muted-foreground">Multiple design options for your brand</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <i className="fas fa-file-pdf text-primary"></i>
                </div>
                <div>
                  <h3 className="font-semibold">PDF Generation</h3>
                  <p className="text-sm text-muted-foreground">High-quality PDF exports with QR codes</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <i className="fas fa-envelope text-primary"></i>
                </div>
                <div>
                  <h3 className="font-semibold">Email Integration</h3>
                  <p className="text-sm text-muted-foreground">Send invoices directly to clients</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <i className="fas fa-qrcode text-primary"></i>
                </div>
                <div>
                  <h3 className="font-semibold">QR Code Payments</h3>
                  <p className="text-sm text-muted-foreground">Easy payment access for your clients</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Team */}
      <Card>
        <CardContent className="p-8">
          <h2 className="text-2xl font-semibold mb-4">Built by Professionals</h2>
          <p className="text-muted-foreground leading-relaxed">
            Invoice Pro is developed by a team of experienced software engineers and business professionals 
            who understand the challenges of managing invoices and getting paid on time. We're committed to 
            providing you with the best possible experience while keeping your data secure and private.
          </p>
        </CardContent>
      </Card>

      {/* Values */}
      <Card>
        <CardContent className="p-8">
          <h2 className="text-2xl font-semibold mb-6">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <i className="fas fa-shield-alt text-primary text-2xl"></i>
              </div>
              <h3 className="font-semibold">Security First</h3>
              <p className="text-sm text-muted-foreground">Your data is protected with industry-standard security</p>
            </div>
            
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <i className="fas fa-heart text-primary text-2xl"></i>
              </div>
              <h3 className="font-semibold">Customer Focus</h3>
              <p className="text-sm text-muted-foreground">We build features that solve real business problems</p>
            </div>
            
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <i className="fas fa-rocket text-primary text-2xl"></i>
              </div>
              <h3 className="font-semibold">Innovation</h3>
              <p className="text-sm text-muted-foreground">Constantly improving and adding new features</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}