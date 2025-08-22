import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="relative mt-32">
      {/* Modern Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/10"></div>
      
      <div className="relative border-t border-border/50 bg-card/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-16">
            {/* Company Info */}
            <div className="space-y-8 fade-in">
              <div className="space-y-4">
                <h3 className="text-2xl font-display font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Invoice Pro
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed font-body">
                  The most professional and user-friendly invoice management system for modern businesses.
                </p>
              </div>
              <div className="flex space-x-4">
                {[
                  { icon: 'fab fa-twitter', href: 'https://twitter.com', label: 'Twitter' },
                  { icon: 'fab fa-linkedin', href: 'https://linkedin.com', label: 'LinkedIn' },
                  { icon: 'fab fa-github', href: 'https://github.com', label: 'GitHub' },
                  { icon: 'fab fa-discord', href: 'https://discord.com', label: 'Discord' }
                ].map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-11 h-11 bg-accent hover:bg-primary/10 rounded-xl flex items-center justify-center text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-105 shadow-sm hover:shadow-md"
                    aria-label={social.label}
                  >
                    <i className={social.icon}></i>
                  </a>
                ))}
              </div>
            </div>

            {/* Features */}
            <div className="space-y-6 fade-in fade-in-delay-1">
              <h4 className="text-lg font-display font-semibold text-foreground border-b border-border/50 pb-3">Features</h4>
              <ul className="space-y-3">
                {[
                  { label: 'Create Invoices', to: '/create', icon: 'fas fa-plus' },
                  { label: 'Invoice History', to: '/history', icon: 'fas fa-history' },
                  { label: 'PDF Export', to: '/create', icon: 'fas fa-file-pdf' },
                  { label: 'Email Integration', to: '/create', icon: 'fas fa-envelope' },
                  { label: 'QR Code Generation', to: '/create', icon: 'fas fa-qrcode' }
                ].map((item) => (
                  <li key={item.label}>
                    <Link 
                      href={item.to}
                      className="flex items-start text-muted-foreground hover:text-foreground transition-all duration-300 group"
                    >
                      <i className={`${item.icon} mr-3 group-hover:text-primary transition-colors`}></i>
                      <span className="group-hover:translate-x-1 transition-transform font-body text-left">{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div className="space-y-6 fade-in fade-in-delay-2">
              <h4 className="text-lg font-display font-semibold text-foreground border-b border-border/50 pb-3">Support</h4>
              <ul className="space-y-3">
                {[
                  { label: 'Contact Us', to: '/contact' },
                  { label: 'About Us', to: '/about' },
                  { label: 'Help Center', href: 'mailto:support@invoicepro.com' }
                ].map((item) => (
                  <li key={item.label}>
                    {item.to ? (
                      <Link 
                        href={item.to}
                        className="flex items-start text-muted-foreground hover:text-foreground transition-all duration-300 group"
                      >
                        <i className="fas fa-arrow-right mr-3 group-hover:text-primary transition-colors"></i>
                        <span className="group-hover:translate-x-1 transition-transform font-body text-left">{item.label}</span>
                      </Link>
                    ) : (
                      <a 
                        href={item.href}
                        className="flex items-start text-muted-foreground hover:text-foreground transition-all duration-300 group"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <i className="fas fa-arrow-right mr-3 group-hover:text-primary transition-colors"></i>
                        <span className="group-hover:translate-x-1 transition-transform font-body text-left">{item.label}</span>
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div className="space-y-6 fade-in fade-in-delay-3">
              <h4 className="text-lg font-display font-semibold text-foreground border-b border-border/50 pb-3">Legal</h4>
              <ul className="space-y-3">
                {[
                  { label: 'Privacy Policy', to: '/privacy' },
                  { label: 'Terms of Service', to: '/terms' }
                ].map((item) => (
                  <li key={item.label}>
                    <Link 
                      href={item.to}
                      className="flex items-start text-muted-foreground hover:text-foreground transition-all duration-300 group"
                    >
                      <i className="fas fa-arrow-right mr-3 group-hover:text-primary transition-colors"></i>
                      <span className="group-hover:translate-x-1 transition-transform font-body text-left">{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-border/50 mt-16 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
              <div className="text-muted-foreground text-sm font-body text-left">
                © {new Date().getFullYear()} Invoice Pro. All rights reserved. Built with ❤️ for modern businesses.
              </div>
              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-body">All systems operational</span>
                </div>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors font-body">
                  Version 2.0.1
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}