import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertInvoiceSchema, insertLineItemSchema, updateInvoiceSchema, sendEmailSchema, type CreateInvoiceRequest } from "@shared/schema";
import { z } from "zod";
import nodemailer from "nodemailer";
import multer from "multer";
import { addUserIdentifier } from "./user-identifier";

// Configure multer for file uploads
const upload = multer({
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
  fileFilter: (req: any, file: any, cb: any) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Configure nodemailer
const transporter = nodemailer.createTransport({
  host: 'mail.jetourmultan.com',
  port: 465,
  secure: true,
  auth: {
    user: 'accounts@jetourmultan.com',
    pass: 'Dawood@1',
  },
});

const createInvoiceRequestSchema = z.object({
  invoice: insertInvoiceSchema,
  lineItems: z.array(insertLineItemSchema),
});

export async function registerRoutes(app: Express): Promise<Server> {
  console.log('Registering routes...');
  
  // Add user identification middleware to all API routes
  app.use('/api', addUserIdentifier);
  
  // Simple test route to verify routing works
  app.get("/api/test", (req, res) => {
    console.log('Test route accessed');
    res.json({ message: "Routes are working!", timestamp: new Date().toISOString() });
  });
  
  console.log('All API routes registered successfully');
  
  // Add a catch-all route for debugging (this should only catch non-API routes)
  app.use('*', (req, res, next) => {
    if (req.originalUrl.startsWith('/api/')) {
      console.log('API route not matched:', req.method, req.originalUrl);
    }
    console.log('Unmatched route:', req.method, req.originalUrl);
    next();
  });
  
  console.log('Setting up /api/invoices route...');
  // Get all invoices for current user
  app.get("/api/invoices", async (req: any, res) => {
    console.log('GET /api/invoices route hit for user:', req.userId);
    try {
      const invoices = await storage.getAllInvoices(req.userId);
      console.log('Total invoices in storage for user:', invoices.length);
      res.json(invoices);
    } catch (error) {
      console.error('Error in /api/invoices:', error);
      res.status(500).json({ message: "Failed to fetch invoices" });
    }
  });

  // Get single invoice for current user
  app.get("/api/invoices/:id", async (req: any, res) => {
    try {
      const invoice = await storage.getInvoice(req.params.id, req.userId);
      if (!invoice) {
        return res.status(404).json({ message: "Invoice not found" });
      }
      res.json(invoice);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch invoice" });
    }
  });

  // Create new invoice for current user
  app.post("/api/invoices", async (req: any, res) => {
    try {
      const validatedData = createInvoiceRequestSchema.parse(req.body);
      const invoice = await storage.createInvoice(validatedData, req.userId);
      res.status(201).json(invoice);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create invoice" });
    }
  });

  // Update invoice for current user
  app.patch("/api/invoices/:id", async (req: any, res) => {
    try {
      const validatedData = updateInvoiceSchema.parse(req.body);
      const invoice = await storage.updateInvoice(req.params.id, validatedData, req.userId);
      if (!invoice) {
        return res.status(404).json({ message: "Invoice not found" });
      }
      res.json(invoice);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update invoice" });
    }
  });

  // Delete invoice for current user
  app.delete("/api/invoices/:id", async (req: any, res) => {
    try {
      const success = await storage.deleteInvoice(req.params.id, req.userId);
      if (!success) {
        return res.status(404).json({ message: "Invoice not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete invoice" });
    }
  });

  // Upload logo
  app.post("/api/upload-logo", upload.single('logo'), async (req: any, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // Convert to base64
      const base64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
      
      res.json({ logo: base64 });
    } catch (error) {
      res.status(500).json({ message: "Failed to upload logo" });
    }
  });

  // Get hosted URL for an invoice (for QR code generation)
  app.get("/api/invoices/:id/hosted-url", async (req: any, res) => {
    try {
      const invoice = await storage.getInvoice(req.params.id, req.userId);
      if (!invoice) {
        return res.status(404).json({ message: "Invoice not found" });
      }

      // Get the correct domain from environment variables
      const replitDomain = process.env.REPLIT_DEV_DOMAIN || process.env.REPLIT_DOMAINS || 'localhost:5000';
      const baseUrl = replitDomain.includes('localhost') ? `http://${replitDomain}` : `https://${replitDomain}`;
      const hostedUrl = `${baseUrl}/view/${invoice.id}`;

      // Update the invoice with the correct hosted URL if it's different
      if (invoice.hostedUrl !== hostedUrl) {
        await storage.updateInvoice(req.params.id, { hostedUrl, isHosted: true }, req.userId);
      }

      res.json({ hostedUrl });
    } catch (error) {
      res.status(500).json({ message: "Failed to get hosted URL" });
    }
  });

  // Send invoice via email
  app.post("/api/invoices/:id/send-email", async (req: any, res) => {
    try {
      const validatedData = sendEmailSchema.parse(req.body);
      const invoice = await storage.getInvoice(req.params.id, req.userId);
      
      if (!invoice) {
        return res.status(404).json({ message: "Invoice not found" });
      }

      // Get the correct domain from environment variables
      const replitDomain = process.env.REPLIT_DEV_DOMAIN || process.env.REPLIT_DOMAINS || 'localhost:5000';
      const baseUrl = replitDomain.includes('localhost') ? `http://${replitDomain}` : `https://${replitDomain}`;
      const invoiceViewUrl = invoice.hostedUrl || `${baseUrl}/view/${invoice.id}`;
      
      const mailOptions = {
        from: 'accounts@jetourmultan.com',
        to: validatedData.to,
        subject: validatedData.subject || `Invoice ${invoice.invoiceNumber}`,
        text: validatedData.message || `Please find your invoice details below.\n\nView Online: ${invoiceViewUrl}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h2 style="color: #333; margin: 0;">Invoice ${invoice.invoiceNumber}</h2>
              <p style="color: #666; margin: 5px 0 0 0;">from ${invoice.companyName}</p>
            </div>
            
            <p>Dear ${invoice.clientName},</p>
            <p>${validatedData.message || 'Please find your invoice details below.'}</p>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 6px; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">Invoice Details:</h3>
              <ul style="list-style: none; padding: 0; margin: 0;">
                <li style="padding: 8px 0; border-bottom: 1px solid #e0e0e0;"><strong>Invoice Number:</strong> ${invoice.invoiceNumber}</li>
                <li style="padding: 8px 0; border-bottom: 1px solid #e0e0e0;"><strong>Date:</strong> ${new Date(invoice.invoiceDate).toLocaleDateString()}</li>
                <li style="padding: 8px 0; border-bottom: 1px solid #e0e0e0;"><strong>Total Amount:</strong> <span style="color: #28a745; font-size: 1.2em;">$${invoice.total}</span></li>
                ${invoice.dueDate ? `<li style="padding: 8px 0;"><strong>Due Date:</strong> ${new Date(invoice.dueDate).toLocaleDateString()}</li>` : ''}
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${invoiceViewUrl}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">📄 View Invoice Online</a>
            </div>
            
            <p style="font-size: 14px; color: #666; margin-top: 30px;">You can view and download your invoice anytime by clicking the link above.</p>
            
            <hr style="border: none; height: 1px; background-color: #e0e0e0; margin: 30px 0;">
            
            <p>Thank you for your business!</p>
            <p style="margin: 0;">Best regards,<br><strong>${invoice.companyName}</strong></p>
            ${invoice.companyEmail ? `<p style="margin: 5px 0 0 0; color: #666;">📧 ${invoice.companyEmail}</p>` : ''}
            ${invoice.companyPhone ? `<p style="margin: 5px 0 0 0; color: #666;">📞 ${invoice.companyPhone}</p>` : ''}
          </div>
        `
      };

      await transporter.sendMail(mailOptions);
      
      // Update invoice status to sent and ensure hosted URL is set if hosting enabled
      const updateData: any = { status: "sent" };
      if (invoice.isHosted && !invoice.hostedUrl) {
        // Get the correct domain from environment variables
        const replitDomain = process.env.REPLIT_DEV_DOMAIN || process.env.REPLIT_DOMAINS || 'localhost:5000';
        const baseUrl = replitDomain.includes('localhost') ? `http://${replitDomain}` : `https://${replitDomain}`;
        updateData.hostedUrl = `${baseUrl}/view/${invoice.id}`;
      }
      await storage.updateInvoice(req.params.id, updateData, req.userId);
      
      res.json({ message: "Email sent successfully" });
    } catch (error) {
      console.error('Email sending failed:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to send email" });
    }
  });

  // Public invoice viewing route (no authentication required)
  app.get("/api/public/invoices/:id", async (req, res) => {
    try {
      const invoice = await storage.getInvoicePublic(req.params.id);
      if (!invoice) {
        return res.status(404).json({ message: "Invoice not found" });
      }
      res.json(invoice);
    } catch (error) {
      console.error('Error in /api/public/invoices/:id:', error);
      res.status(500).json({ message: "Failed to fetch invoice" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
