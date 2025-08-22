import { type Invoice, type InsertInvoice, type UpdateInvoice, type LineItem, type InsertLineItem, type InvoiceWithLineItems, type CreateInvoiceRequest } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Invoice operations - now user-aware
  getInvoice(id: string, userId: string): Promise<InvoiceWithLineItems | undefined>;
  getAllInvoices(userId: string): Promise<InvoiceWithLineItems[]>;
  createInvoice(request: CreateInvoiceRequest, userId: string): Promise<InvoiceWithLineItems>;
  updateInvoice(id: string, invoice: UpdateInvoice, userId: string): Promise<InvoiceWithLineItems | undefined>;
  deleteInvoice(id: string, userId: string): Promise<boolean>;
  
  // Public invoice viewing (no user authentication)
  getInvoicePublic(id: string): Promise<InvoiceWithLineItems | undefined>;
  
  // Line item operations - now user-aware
  getLineItemsByInvoiceId(invoiceId: string, userId: string): Promise<LineItem[]>;
  addLineItem(invoiceId: string, lineItem: InsertLineItem, userId: string): Promise<LineItem>;
  updateLineItem(id: string, lineItem: Partial<LineItem>, userId: string): Promise<LineItem | undefined>;
  deleteLineItem(id: string, userId: string): Promise<boolean>;
  
  // Utility - now user-aware
  getInvoiceByNumber(invoiceNumber: string, userId: string): Promise<InvoiceWithLineItems | undefined>;
}

export class MemStorage implements IStorage {
  private userInvoices: Map<string, Map<string, Invoice>>;
  private userLineItems: Map<string, Map<string, LineItem>>;

  constructor() {
    this.userInvoices = new Map();
    this.userLineItems = new Map();
  }

  private getUserInvoices(userId: string): Map<string, Invoice> {
    if (!this.userInvoices.has(userId)) {
      this.userInvoices.set(userId, new Map());
      // Initialize with demo data for new users
      this.initializeDemoDataForUser(userId);
    }
    return this.userInvoices.get(userId)!;
  }

  private getUserLineItems(userId: string): Map<string, LineItem> {
    if (!this.userLineItems.has(userId)) {
      this.userLineItems.set(userId, new Map());
    }
    return this.userLineItems.get(userId)!;
  }

  private initializeDemoDataForUser(userId: string) {
    // No demo data - users start with clean slate
  }

  async getInvoice(id: string, userId: string): Promise<InvoiceWithLineItems | undefined> {
    const userInvoices = this.getUserInvoices(userId);
    const invoice = userInvoices.get(id);
    if (!invoice) return undefined;
    
    const lineItems = await this.getLineItemsByInvoiceId(id, userId);
    return { ...invoice, lineItems };
  }

  async getAllInvoices(userId: string): Promise<InvoiceWithLineItems[]> {
    const userInvoices = this.getUserInvoices(userId);
    const invoices = Array.from(userInvoices.values());
    const invoicesWithLineItems = await Promise.all(
      invoices.map(async (invoice) => {
        const lineItems = await this.getLineItemsByInvoiceId(invoice.id, userId);
        return { ...invoice, lineItems };
      })
    );
    
    return invoicesWithLineItems.sort((a, b) => 
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  async createInvoice(request: CreateInvoiceRequest, userId: string): Promise<InvoiceWithLineItems> {
    const id = randomUUID();
    const now = new Date();
    
    // Calculate totals
    const subtotal = request.lineItems.reduce((sum, item) => {
      const amount = parseFloat(item.rate) * (item.quantity || 1);
      return sum + amount;
    }, 0);
    
    const taxPercentage = parseFloat(request.invoice.taxPercentage || "0");
    const shippingCost = parseFloat(request.invoice.shippingCost || "0");
    const taxAmount = (subtotal * taxPercentage) / 100;
    const total = subtotal + taxAmount + shippingCost;
    
    const invoice: Invoice = {
      id,
      invoiceNumber: request.invoice.invoiceNumber,
      status: request.invoice.status || 'draft',
      companyName: request.invoice.companyName,
      companyEmail: request.invoice.companyEmail,
      companyPhone: request.invoice.companyPhone || null,
      companyWebsite: request.invoice.companyWebsite || null,
      companyAddress: request.invoice.companyAddress || null,
      companyLogo: request.invoice.companyLogo || null,
      clientName: request.invoice.clientName,
      clientEmail: request.invoice.clientEmail,
      clientCompany: request.invoice.clientCompany || null,
      clientPhone: request.invoice.clientPhone || null,
      clientAddress: request.invoice.clientAddress || null,
      invoiceDate: request.invoice.invoiceDate,
      dueDate: request.invoice.dueDate || null,
      notes: request.invoice.notes || null,
      textInformation: request.invoice.textInformation || null,
      shippingCode: request.invoice.shippingCode || null,
      currency: request.invoice.currency || "USD",
      subtotal: subtotal.toFixed(2),
      taxPercentage: request.invoice.taxPercentage || "0",
      tax: taxAmount.toFixed(2),
      shippingCost: request.invoice.shippingCost || "0",
      total: total.toFixed(2),
      template: request.invoice.template || "classic",
      documentType: request.invoice.documentType || "invoice",
      primaryColor: request.invoice.primaryColor || "#2563eb",
      secondaryColor: request.invoice.secondaryColor || "#64748b",
      fontFamily: request.invoice.fontFamily || "Inter",
      isHosted: request.invoice.isHosted || false,
      isPasswordProtected: request.invoice.isPasswordProtected || false,
      password: request.invoice.password || null,
      hostedUrl: null, // Will be set by route handler if hosted
      createdAt: now,
      updatedAt: now,
    };
    
    const userInvoices = this.getUserInvoices(userId);
    const userLineItems = this.getUserLineItems(userId);
    userInvoices.set(id, invoice);
    
    // Create line items
    const lineItems: LineItem[] = [];
    for (const item of request.lineItems) {
      const lineItemId = randomUUID();
      const lineItem: LineItem = {
        id: lineItemId,
        invoiceId: id,
        description: item.description,
        quantity: item.quantity || 1,
        rate: item.rate,
        amount: (parseFloat(item.rate) * (item.quantity || 1)).toFixed(2),
      };
      userLineItems.set(lineItemId, lineItem);
      lineItems.push(lineItem);
    }
    
    return { ...invoice, lineItems };
  }

  async updateInvoice(id: string, updateData: UpdateInvoice, userId: string): Promise<InvoiceWithLineItems | undefined> {
    const userInvoices = this.getUserInvoices(userId);
    const invoice = userInvoices.get(id);
    if (!invoice) return undefined;
    
    const updatedInvoice: Invoice = {
      ...invoice,
      ...updateData,
      companyPhone: updateData.companyPhone || invoice.companyPhone,
      companyWebsite: updateData.companyWebsite || invoice.companyWebsite,
      companyAddress: updateData.companyAddress || invoice.companyAddress,
      clientCompany: updateData.clientCompany || invoice.clientCompany,
      clientPhone: updateData.clientPhone || invoice.clientPhone,
      clientAddress: updateData.clientAddress || invoice.clientAddress,
      dueDate: updateData.dueDate || invoice.dueDate,
      notes: updateData.notes || invoice.notes,
      password: updateData.password || invoice.password,
      updatedAt: new Date(),
    };
    
    userInvoices.set(id, updatedInvoice);
    const lineItems = await this.getLineItemsByInvoiceId(id, userId);
    return { ...updatedInvoice, lineItems };
  }

  async deleteInvoice(id: string, userId: string): Promise<boolean> {
    const userInvoices = this.getUserInvoices(userId);
    const userLineItems = this.getUserLineItems(userId);
    
    // Delete associated line items first
    const lineItems = await this.getLineItemsByInvoiceId(id, userId);
    lineItems.forEach(item => userLineItems.delete(item.id));
    
    return userInvoices.delete(id);
  }

  async getLineItemsByInvoiceId(invoiceId: string, userId: string): Promise<LineItem[]> {
    const userLineItems = this.getUserLineItems(userId);
    return Array.from(userLineItems.values()).filter(
      item => item.invoiceId === invoiceId
    );
  }

  async addLineItem(invoiceId: string, lineItem: InsertLineItem, userId: string): Promise<LineItem> {
    const id = randomUUID();
    const newLineItem: LineItem = {
      id,
      invoiceId: invoiceId,
      description: lineItem.description,
      quantity: lineItem.quantity || 1,
      rate: lineItem.rate,
      amount: (parseFloat(lineItem.rate) * (lineItem.quantity || 1)).toFixed(2),
    };
    
    const userLineItems = this.getUserLineItems(userId);
    userLineItems.set(id, newLineItem);
    return newLineItem;
  }

  async updateLineItem(id: string, updateData: Partial<LineItem>, userId: string): Promise<LineItem | undefined> {
    const userLineItems = this.getUserLineItems(userId);
    const lineItem = userLineItems.get(id);
    if (!lineItem) return undefined;
    
    const updatedLineItem: LineItem = {
      ...lineItem,
      ...updateData,
    };
    
    // Recalculate amount if rate or quantity changed
    if (updateData.rate || updateData.quantity) {
      const rate = updateData.rate || lineItem.rate;
      const quantity = updateData.quantity || lineItem.quantity;
      updatedLineItem.amount = (parseFloat(rate) * quantity).toFixed(2);
    }
    
    userLineItems.set(id, updatedLineItem);
    return updatedLineItem;
  }

  async deleteLineItem(id: string, userId: string): Promise<boolean> {
    const userLineItems = this.getUserLineItems(userId);
    return userLineItems.delete(id);
  }

  async getInvoiceByNumber(invoiceNumber: string, userId: string): Promise<InvoiceWithLineItems | undefined> {
    const userInvoices = this.getUserInvoices(userId);
    const invoice = Array.from(userInvoices.values()).find(
      inv => inv.invoiceNumber === invoiceNumber
    );
    
    if (!invoice) return undefined;
    
    const lineItems = await this.getLineItemsByInvoiceId(invoice.id, userId);
    return { ...invoice, lineItems };
  }

  async getInvoicePublic(id: string): Promise<InvoiceWithLineItems | undefined> {
    // Search through all users' invoices for a public hosted invoice
    const userEntries = Array.from(this.userInvoices.entries());
    for (const [userId, userInvoices] of userEntries) {
      const invoice = userInvoices.get(id);
      if (invoice && invoice.isHosted) {
        // Get line items for this invoice
        const lineItems = await this.getLineItemsByInvoiceId(id, userId);
        return { ...invoice, lineItems };
      }
    }
    return undefined;
  }
}

export const storage = new MemStorage();
