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
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <img 
                src={currentLogo} 
                alt="Invoice Generator Logo" 
                className="h-10 w-auto object-contain"
              />
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Invoice Pro
                </h1>
                <p className="text-xs text-muted-foreground font-medium">Professional Invoicing</p>
              </div>
            </Link>
          </div>
          
          <nav className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`relative px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                  isActive(item.path)
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                <i className={`${item.icon} mr-2`}></i>
                {item.label}
              </Link>
            ))}
            
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="ml-2"
            >
              {theme === "light" ? (
                <i className="fas fa-moon h-4 w-4"></i>
              ) : (
                <i className="fas fa-sun h-4 w-4"></i>
              )}
            </Button>
          </nav>
          
          <div className="md:hidden flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            >
              {theme === "light" ? (
                <i className="fas fa-moon h-4 w-4"></i>
              ) : (
                <i className="fas fa-sun h-4 w-4"></i>
              )}
            </Button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
            >
              <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'} text-lg`}></i>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t">
          <div className="px-4 py-2 space-y-1 bg-background">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-md font-medium transition-all duration-200 ${
                  isActive(item.path)
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
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
