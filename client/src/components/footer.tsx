import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="relative mt-20">
      {/* Pink Gradient Background */}
      <div className="absolute inset-0 gradient-animated opacity-90"></div>
      
      <div className="relative glass backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
            {/* Company Info */}
            <div className="space-y-6 fade-in">
              <div className="space-y-3">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-white via-pink-200 to-white bg-clip-text text-transparent font-[Plus_Jakarta_Sans]">
                  Invoice Pro
                </h3>
                <p className="text-white/90 text-sm leading-relaxed font-[Manrope]">
                  The most professional and user-friendly invoice management system for modern businesses.
                </p>
              </div>
              <div className="flex space-x-3">
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
                    className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white hover:text-pink-300 transition-all duration-500 hover:scale-110 btn-animate"
                    aria-label={social.label}
                  >
                    <i className={social.icon}></i>
                  </a>
                ))}
              </div>
            </div>

            {/* Features */}
            <div className="space-y-4 fade-in fade-in-delay-1">
              <h4 className="text-lg font-semibold text-white border-b border-pink-400/30 pb-2 font-[Plus_Jakarta_Sans]">Features</h4>
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
                      className="flex items-center text-white/70 hover:text-white transition-all duration-300 group"
                    >
                      <i className={`${item.icon} mr-3 group-hover:text-pink-400 transition-colors`}></i>
                      <span className="group-hover:translate-x-1 transition-transform font-[Manrope]">{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div className="space-y-4 fade-in fade-in-delay-2">
              <h4 className="text-lg font-semibold text-white border-b border-pink-400/30 pb-2 font-[Plus_Jakarta_Sans]">Support</h4>
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
                        className="flex items-center text-white/70 hover:text-white transition-all duration-300 group"
                      >
                        <i className="fas fa-arrow-right mr-3 group-hover:text-pink-400 transition-colors"></i>
                        <span className="group-hover:translate-x-1 transition-transform font-[Manrope]">{item.label}</span>
                      </Link>
                    ) : (
                      <a 
                        href={item.href}
                        className="flex items-center text-white/70 hover:text-white transition-all duration-300 group"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <i className="fas fa-arrow-right mr-3 group-hover:text-pink-400 transition-colors"></i>
                        <span className="group-hover:translate-x-1 transition-transform font-[Manrope]">{item.label}</span>
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div className="space-y-4 fade-in fade-in-delay-3">
              <h4 className="text-lg font-semibold text-white border-b border-pink-400/30 pb-2 font-[Plus_Jakarta_Sans]">Legal</h4>
              <ul className="space-y-3">
                {[
                  { label: 'Privacy Policy', to: '/privacy' },
                  { label: 'Terms of Service', to: '/terms' }
                ].map((item) => (
                  <li key={item.label}>
                    <Link 
                      href={item.to}
                      className="flex items-center text-white/70 hover:text-white transition-all duration-300 group"
                    >
                      <i className="fas fa-arrow-right mr-3 group-hover:text-blue-400 transition-colors"></i>
                      <span className="group-hover:translate-x-1 transition-transform">{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-pink-400/20 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
              <div className="text-white/60 text-sm font-[Manrope] text-left">
                © {new Date().getFullYear()} Invoice Pro. All rights reserved. Built with ❤️ for modern businesses.
              </div>
              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center space-x-2 text-white/60">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>All systems operational</span>
                </div>
                <a href="#" className="text-white/60 hover:text-white transition-colors">
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