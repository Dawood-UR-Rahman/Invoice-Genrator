import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Search } from "lucide-react";

const blogPosts = [
  {
    id: "best-invoice-generator-2025",
    title: "Best Invoice Generator 2025: Free, Fast, and Professional Online Invoices",
    excerpt: "In the digital era, where businesses are moving towards automation and efficiency, one of the most important tools for freelancers, entrepreneurs, and companies is an invoice generator. Discover the best options in 2025.",
    content: "In the digital era, where businesses are moving towards automation and efficiency, one of the most important tools for freelancers, entrepreneurs, and companies is an invoice generator. Invoices are more than just payment requests. They represent your professionalism, record-keeping, and client relationships. In 2025, the demand for free, fast, and professional online invoice generators is higher than ever before.",
    date: "January 2025",
    readTime: "8 min read",
    category: "Technology",
    author: "invoicedetail",
    image: "/assets/Invoice_generator_dashboard_interface_e5cf93eb.png"
  },
  {
    id: "invoicedetail-create-professional-invoices",
    title: "Create Professional Invoices Instantly with Invoicedetail.com",
    excerpt: "Invoicedetail.com making invoices effortless. Whether you're a freelancer, small business owner, or entrepreneur, our online invoice generator helps you create professional invoices in minutes.",
    content: "Invoicedetail.com making invoices effortless. Whether you're a freelancer, small business owner, or entrepreneur, our online invoice generator helps you create professional invoices in minutes. No complicated software. No manual calculations. Just accurate, polished invoices ready to send.",
    date: "January 2025",
    readTime: "5 min read",
    category: "Productivity",
    author: "invoicedetail",
    image: "/assets/Invoicedetail.com_website_mockup_design_6fc2c057.png"
  },
  {
    id: "freelance-writer-invoice-template",
    title: "Freelance Writer Invoice Template: Free, Customizable & Professional",
    excerpt: "As a freelance writer, one of the biggest challenges isn't crafting the perfect article or blog post—it's managing invoices. With the right template, you can create professional invoices quickly.",
    content: "As a freelance writer, one of the biggest challenges isn't crafting the perfect article or blog post—it's managing invoices. Keeping track of projects, deadlines, and payments can become overwhelming without the right tools. That's where a freelance writer invoice template comes in.",
    date: "January 2025",
    readTime: "6 min read",
    category: "Design Tips",
    author: "invoicedetail",
    image: "/assets/Freelance_writer_invoice_workspace_c92483a6.png"
  },
  {
    id: "billing-format-for-client",
    title: "Billing Format for Client: Easy, Professional & Ready-to-Use Templates",
    excerpt: "Creating a clear and professional billing format is essential for any business or freelancer who wants to get paid on time and maintain strong client relationships.",
    content: "Creating a clear and professional billing format is essential for any business or freelancer who wants to get paid on time and maintain strong client relationships. Whether you are a small business owner, freelancer, or service provider, using a standardized billing format ensures transparency.",
    date: "January 2025",
    readTime: "5 min read",
    category: "Design Tips",
    author: "invoicedetail",
    image: "/assets/Professional_billing_format_templates_63ac009f.png"
  },
  {
    id: "invoice-vs-receipt",
    title: "Invoice vs Receipt: Key Differences, Uses & Examples Explained",
    excerpt: "Understanding the difference between an invoice and a receipt is crucial for business owners, freelancers, and anyone handling payments. Learn when to use each document.",
    content: "Understanding the difference between an invoice and a receipt is crucial for business owners, freelancers, and anyone handling payments. While these two documents may seem similar, they serve very different purposes in financial management.",
    date: "January 2025",
    readTime: "7 min read",
    category: "E-commerce",
    author: "invoicedetail",
    image: "/assets/Invoice_vs_receipt_comparison_01011345.png"
  },
  {
    id: "cleaning-invoice-template",
    title: "Cleaning Invoice Template: Free, Editable & Professional Format",
    excerpt: "Running a cleaning business means more than just providing quality service. Getting paid on time and keeping your finances organized is just as important.",
    content: "Running a cleaning business—whether residential, commercial, or specialized—means more than just providing quality service. Getting paid on time and keeping your finances organized is just as important. That's where a cleaning invoice template comes in.",
    date: "January 2025",
    readTime: "6 min read",
    category: "Design Tips",
    author: "invoicedetail",
    image: "/assets/Cleaning_business_invoice_template_1ecf2d18.png"
  },
  {
    id: "best-invoice-generator-apps",
    title: "Best Invoice Generator Apps for iPhone & Android (2025 Review)",
    excerpt: "Getting paid quickly and professionally is essential for freelancers, consultants, and small business owners. Discover the best invoice generator apps for mobile devices in 2025.",
    content: "Getting paid quickly and professionally is essential for freelancers, consultants, and small business owners. In 2025, there are many invoice generator apps for iPhone and Android, but the fastest, simplest, and most versatile option is Invoicedetail.com.",
    date: "January 2025",
    readTime: "5 min read",
    category: "Technology",
    author: "invoicedetail",
    image: "/assets/Invoice_generator_mobile_apps_49ee5b55.png"
  },
  {
    id: "invoice-generator-vs-excel",
    title: "Invoice Generator vs Excel: Which Works Best for Small Businesses in 2025?",
    excerpt: "For small business owners, freelancers, and consultants, creating professional invoices is essential. Should you stick to Excel invoice templates, or use an invoice generator?",
    content: "For small business owners, freelancers, and consultants, creating professional invoices is essential. But there's often a question: should you stick to Excel invoice templates, or use an invoice generator? In 2025, the right choice can save you hours, reduce errors, and even help you get paid faster.",
    date: "January 2025",
    readTime: "6 min read",
    category: "Productivity",
    author: "invoicedetail",
    image: "/assets/Excel_vs_invoice_generator_comparison_b43a7d16.png"
  },
  {
    id: "social-media-invoice-promotion",
    title: "How to Promote Your Invoice Services on Social Media: 2025 Marketing Guide",
    excerpt: "Social media platforms offer powerful opportunities for invoice service providers and freelancers to showcase their professionalism and attract new clients through strategic content marketing.",
    content: "Social media platforms offer powerful opportunities for invoice service providers and freelancers to showcase their professionalism and attract new clients through strategic content marketing. Learn how to leverage platforms like LinkedIn, Twitter, and Instagram to grow your business.",
    date: "January 2025",
    readTime: "4 min read",
    category: "Social Media",
    author: "invoicedetail",
    image: "/assets/Invoice_generator_dashboard_interface_e5cf93eb.png"
  },
  {
    id: "photography-invoice-portfolio",
    title: "Photography Invoice Templates: Showcase Your Work with Professional Billing",
    excerpt: "Professional photographers need invoices that reflect their artistic brand while maintaining business professionalism. Discover how to create stunning invoice designs that complement your portfolio.",
    content: "Professional photographers need invoices that reflect their artistic brand while maintaining business professionalism. Your invoice is often the final touchpoint with clients, making it crucial to maintain the same level of quality and attention to detail that you bring to your photography work.",
    date: "January 2025",
    readTime: "5 min read",
    category: "Photography",
    author: "invoicedetail",
    image: "/assets/Professional_invoice_management_logo_16aa0397.png"
  }
];

const categories = ['All', 'Design Tips', 'E-commerce', 'Technology', 'Social Media', 'Photography', 'Productivity'];

export default function Blog() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-white pt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Invoice Generator Blog
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Expert tips, tutorials, and insights on invoice generation, billing practices, and business management
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input 
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Filter Tags */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                selectedCategory === category
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <Card key={post.id} className="overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300 bg-white">
              <div className="relative">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-3 left-3">
                  <Badge className="bg-blue-500 text-white px-2 py-1 text-xs font-medium rounded">
                    {post.category}
                  </Badge>
                </div>
              </div>
              
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                  {post.title}
                </h2>
                
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-2">
                    <span>{post.author}</span>
                    <span>•</span>
                    <span>{post.date}</span>
                  </div>
                  <span>{post.readTime}</span>
                </div>
                
                <Link to={`/blog/${post.id}`}>
                  <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                    Read More
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No articles found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}