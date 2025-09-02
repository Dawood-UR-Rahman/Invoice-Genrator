import { Card, CardContent } from "@/components/ui/card";

export default function Terms() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Terms of Service</h1>
        <p className="text-xl text-muted-foreground">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>

      <Card>
        <CardContent className="p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                By accessing and using Invoice Detail, you accept and agree to be bound by the terms and 
                provisions of this agreement. If you do not agree to these terms, you should not use our service.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Invoice Detail is a web-based invoicing application that allows users to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Create and customize professional invoices</li>
                <li>Generate PDF documents with QR codes</li>
                <li>Send invoices via email</li>
                <li>Track invoice history and status</li>
                <li>Manage client information</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                To use certain features of our service, you may need to create an account. You are responsible for:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Maintaining the confidentiality of your account credentials</li>
                <li>All activities that occur under your account</li>
                <li>Providing accurate and current information</li>
                <li>Promptly updating your account information when changes occur</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Acceptable Use</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>You agree not to use the service to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Create fraudulent or misleading invoices</li>
                <li>Violate any laws or regulations</li>
                <li>Infringe on intellectual property rights</li>
                <li>Transmit harmful or malicious code</li>
                <li>Interfere with the service's functionality</li>
                <li>Access another user's account without permission</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Data and Privacy</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Your use of our service is also governed by our Privacy Policy. We are committed to 
                protecting your data and maintaining your privacy. Please review our Privacy Policy to 
                understand how we collect, use, and protect your information.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Intellectual Property</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                The service and all content, features, and functionality are owned by Invoice Detail and are 
                protected by copyright, trademark, and other intellectual property laws. You may not:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Copy, modify, or distribute our software</li>
                <li>Reverse engineer or attempt to derive source code</li>
                <li>Remove or alter proprietary notices</li>
                <li>Create derivative works based on our service</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Service Availability</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                We strive to maintain high availability of our service, but we do not guarantee 
                uninterrupted access. The service may be temporarily unavailable for maintenance, 
                updates, or due to circumstances beyond our control.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Limitation of Liability</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                To the fullest extent permitted by law, Invoice Detail shall not be liable for any indirect, 
                incidental, special, consequential, or punitive damages, including loss of profits, data, 
                or use, arising from your use of the service.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. Disclaimer of Warranties</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                The service is provided "as is" and "as available" without warranties of any kind, 
                either express or implied, including but not limited to implied warranties of 
                merchantability, fitness for a particular purpose, or non-infringement.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">10. Termination</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                We reserve the right to terminate or suspend your account and access to the service 
                at our sole discretion, without notice, for conduct that we believe violates these 
                terms or is harmful to other users or the service.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">11. Changes to Terms</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                We reserve the right to modify these terms at any time. We will notify users of any 
                significant changes via email or through our application. Your continued use of the 
                service after changes constitute acceptance of the new terms.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">12. Governing Law</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                These terms shall be governed by and construed in accordance with the laws of 
                [Your Jurisdiction], without regard to its conflict of law provisions.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">13. Contact Information</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <div className="bg-muted/50 rounded-lg p-4">
                <p><strong>Email:</strong> legal@invoicedetail.com</p>
                <p><strong>Address:</strong> Invoice Detail Legal Team, [Your Address]</p>
              </div>
            </div>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}