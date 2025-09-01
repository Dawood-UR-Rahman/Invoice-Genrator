import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/hooks/use-theme";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import CreateInvoice from "@/pages/create-invoice";
import InvoiceHistory from "@/pages/invoice-history";
import InvoiceView from "@/pages/invoice-view";
import About from "@/pages/about";
import Contact from "@/pages/contact";
import Privacy from "@/pages/privacy";
import Terms from "@/pages/terms";
import Blog from "@/pages/blog";
import BlogPost from "@/pages/blog-post";

function Router() {
  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Modern background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-accent/30"></div>
        <div className="absolute top-0 left-0 w-full h-full opacity-30">
          <div className="absolute top-20 right-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        </div>
      </div>
      
      <Navigation />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full fade-in-up">
          <Switch>
            <Route path="/" component={CreateInvoice} />
            <Route path="/create" component={CreateInvoice} />
            <Route path="/history" component={InvoiceHistory} />
            <Route path="/edit/:id" component={CreateInvoice} />
            <Route path="/view/:id" component={InvoiceView} />
            <Route path="/about" component={About} />
            <Route path="/contact" component={Contact} />
            <Route path="/privacy" component={Privacy} />
            <Route path="/terms" component={Terms} />
            <Route path="/blog" component={Blog} />
            <Route path="/blog/:slug" component={BlogPost} />
          </Switch>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="invoice-pro-theme">
        <TooltipProvider>
          <div className="transition-all duration-500 ease-in-out">
            <Toaster />
            <Router />
          </div>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
