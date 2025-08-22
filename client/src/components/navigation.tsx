import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useTheme } from "../hooks/use-theme";
import { Button } from "@/components/ui/button";
import modernLogo from '../assets/Professional_invoice_management_logo_16aa0397.png';
import classicLogo from '../assets/Classic_business_invoice_logo_d1656218.png';
import creativeLogo from '../assets/Creative_modern_invoice_logo_8ed122e0.png';

export default function Navigation() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  
  // Get theme from localStorage or default to 'classic'
  const getTheme = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('invoice-theme') || 'classic';
    }
    return 'classic';
  };
  
  const currentTheme = getTheme();
  
  const getLogoForTheme = (theme: string) => {
    switch (theme) {
      case 'modern':
      case 'elegant':
      case 'minimal':
        return modernLogo;
      case 'warm':
      case 'creative':
        return creativeLogo;
      case 'classic':
      default:
        return classicLogo;
    }
  };
  
  const currentLogo = getLogoForTheme(currentTheme);

  const navItems = [
    { path: "/create", label: "Create Invoice", icon: "fas fa-plus" },
    { path: "/history", label: "Invoice History", icon: "fas fa-history" },
  ];

  const isActive = (path: string) => {
    if (path === "/create") {
      return location === "/" || location === "/create" || location.startsWith("/edit");
    }
    return location === path;
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4 fade-in">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-3 hover:opacity-90 transition-all duration-300 group">
              <svg className="h-11 w-11 transition-transform duration-300 group-hover:scale-105" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="8" y="12" width="48" height="40" rx="4" fill="#10B981" stroke="#ffffff" strokeWidth="2"/>
                <rect x="12" y="16" width="40" height="32" rx="2" fill="#ffffff"/>
                <line x1="16" y1="22" x2="48" y2="22" stroke="#10B981" strokeWidth="2"/>
                <line x1="16" y1="26" x2="40" y2="26" stroke="#10B981" strokeWidth="1"/>
                <line x1="16" y1="30" x2="36" y2="30" stroke="#10B981" strokeWidth="1"/>
                <line x1="16" y1="34" x2="42" y2="34" stroke="#10B981" strokeWidth="1"/>
                <line x1="16" y1="38" x2="32" y2="38" stroke="#10B981" strokeWidth="1"/>
                <rect x="38" y="36" width="10" height="6" rx="1" fill="#10B981"/>
                <text x="43" y="41" fill="white" fontSize="4" textAnchor="middle">$</text>
              </svg>
              <div>
                <h1 className="text-2xl font-display font-bold text-foreground">
                  Invoice Pro
                </h1>
                <p className="text-xs text-muted-foreground font-medium font-body">Professional Invoicing</p>
              </div>
            </Link>
          </div>
          
          <nav className="hidden md:flex items-center space-x-3">
            {navItems.map((item, index) => (
              <Link
                key={item.path}
                href={item.path}
                className={`relative px-5 py-2.5 rounded-xl font-medium transition-all duration-300 font-body group ${
                  isActive(item.path)
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                }`}
              >
                <i className={`${item.icon} mr-2 transition-transform duration-300 group-hover:scale-110`}></i>
                {item.label}
              </Link>
            ))}
            
          </nav>
          
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-xl transition-all duration-300"
            >
              <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'} text-lg`}></i>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border/50 fade-in-up">
          <div className="px-4 py-3 space-y-2 bg-card/50 backdrop-blur-xl">
            {navItems.map((item, index) => (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-xl font-medium transition-all duration-300 font-body ${
                  isActive(item.path)
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                }`}
              >
                <i className={`${item.icon} mr-3`}></i>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
