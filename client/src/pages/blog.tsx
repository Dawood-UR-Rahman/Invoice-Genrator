import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const blogPosts = [
  {
    id: "freelance-writer-invoice-template",
    title: "Freelance Writer Invoice Template: Free, Customizable & Professional",
    excerpt: "As a freelance writer, one of the biggest challenges isn't crafting the perfect article or blog post—it's managing invoices. Discover how a well-designed invoice template can save time and ensure you get paid on time.",
    date: "January 2025",
    readTime: "5 min read",
    category: "Freelance",
    image: "/src/assets/Professional_invoice_dashboard_hero_83e6a056.png"
  },
  {
    id: "billing-format-for-client",
    title: "Billing Format for Client: Easy, Professional & Ready-to-Use Templates",
    excerpt: "Creating a clear and professional billing format is essential for any business or freelancer who wants to get paid on time and maintain strong client relationships. Learn the key components of effective billing.",
    date: "January 2025", 
    readTime: "4 min read",
    category: "Business",
    image: "/src/assets/Invoice_business_features_showcase_00ba884b.png"
  },
  {
    id: "invoice-vs-receipt",
    title: "Invoice vs Receipt: Key Differences, Uses & Examples Explained",
    excerpt: "Understanding the difference between an invoice and a receipt is crucial for business owners, freelancers, and anyone handling payments. Learn when to use each document and why both are important.",
    date: "January 2025",
    readTime: "6 min read", 
    category: "Education",
    image: "/src/assets/Invoice_workflow_process_diagram_8ee2c762.png"
  },
  {
    id: "cleaning-invoice-template",
    title: "Cleaning Invoice Template: Free, Editable & Professional Format",
    excerpt: "Running a cleaning business means more than just providing quality service. Getting paid on time and keeping your finances organized is just as important. Discover professional invoicing for cleaning services.",
    date: "January 2025",
    readTime: "5 min read",
    category: "Industry",
    image: "/src/assets/Professional_invoice_dashboard_hero_83e6a056.png"
  }
];

export default function Blog() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/20 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Invoice <span className="gradient-text">Insights</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Expert tips, guides, and best practices for professional invoicing, billing, and business management.
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {blogPosts.map((post) => (
            <Card key={post.id} className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 glass border-0 shadow-lg overflow-hidden">
              <div className="relative">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                    {post.category}
                  </span>
                </div>
              </div>
              
              <CardContent className="p-6">
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                  <span>{post.date}</span>
                  <span>•</span>
                  <span>{post.readTime}</span>
                </div>
                
                <h2 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                  {post.title}
                </h2>
                
                <p className="text-muted-foreground mb-6 line-clamp-3">
                  {post.excerpt}
                </p>
                
                <Link to={`/blog/${post.id}`}>
                  <Button className="w-full group-hover:bg-primary/90 transition-colors duration-300">
                    Read More
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}