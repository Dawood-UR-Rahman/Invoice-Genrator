import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import SimplifiedInvoiceForm from "@/components/simplified-invoice-form";
import InvoicePreview from "@/components/invoice-preview";
import EmailModal from "@/components/email-modal";
import LogoUpload from "@/components/logo-upload";
import { PDFDownloadButton } from "@/lib/pdf-generator";
import { useInvoiceStorage } from "@/hooks/use-invoice-storage";
import { generateQRCode } from "@/lib/qr-generator";
import type { InvoiceFormData, LineItemFormData } from "@/types/invoice";
import type {
  InvoiceWithLineItems,
  CreateInvoiceRequest,
} from "@shared/schema";

const defaultFormData: InvoiceFormData = {
  companyName: "",
  companyEmail: "",
  companyPhone: "",
  companyWebsite: "",
  companyAddress: "",
  companyLogo: null,
  clientName: "",
  clientEmail: "",
  clientCompany: "",
  clientPhone: "",
  clientAddress: "",
  invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
  invoiceDate: new Date().toISOString().split("T")[0],
  dueDate: "",
  notes: "",
  currency: "USD",
  taxPercentage: "0",
  shippingCost: "0",
  template: "classic",
  documentType: "invoice",
  primaryColor: "#2563eb",
  secondaryColor: "#64748b",
  fontFamily: "Inter",
  status: "draft",
  isHosted: false,
  isPasswordProtected: false,
  password: "",
};

export default function CreateInvoice() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { saveDraft } = useInvoiceStorage();

  const [formData, setFormData] = useState<InvoiceFormData>(defaultFormData);
  const [lineItems, setLineItems] = useState<LineItemFormData[]>([]);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [qrCodeDataURL, setQRCodeDataURL] = useState<string | null>(null);
  const [hasVisitedHistory, setHasVisitedHistory] = useState(false);
  const [justCreatedInvoice, setJustCreatedInvoice] = useState(false);

  const handleLineItemChange = (
    index: number,
    field: keyof LineItemFormData,
    value: string | number,
  ) => {
    const updatedItems = [...lineItems];
    updatedItems[index] = { ...updatedItems[index], [field]: value };

    // Calculate amount when rate or quantity changes
    if (field === "rate" || field === "quantity") {
      const rate =
        field === "rate"
          ? parseFloat(value.toString())
          : parseFloat(updatedItems[index].rate);
      const quantity =
        field === "quantity" ? Number(value) : updatedItems[index].quantity;
      updatedItems[index].amount = ((rate || 0) * (quantity || 0)).toFixed(2);
    }

    setLineItems(updatedItems);
  };

  const addLineItem = () => {
    setLineItems([
      ...lineItems,
      { description: "", quantity: 1, rate: "0.00", amount: "0.00" },
    ]);
  };

  const removeLineItem = (index: number) => {
    const updatedItems = lineItems.filter((_, i) => i !== index);
    setLineItems(updatedItems);
  };

  // Initialize with one line item if empty
  useEffect(() => {
    if (lineItems.length === 0) {
      setLineItems([
        { description: "", quantity: 1, rate: "0.00", amount: "0.00" },
      ]);
    }
  }, [lineItems.length]);

  const isEditing = !!params.id;

  // Fetch invoice for editing
  const { data: existingInvoice, isLoading } = useQuery<InvoiceWithLineItems>({
    queryKey: ["/api/invoices", params.id],
    enabled: isEditing,
  });

  // Create invoice mutation
  const createInvoiceMutation = useMutation({
    mutationFn: async (data: CreateInvoiceRequest) => {
      const response = await apiRequest("POST", "/api/invoices", data);
      return response.json();
    },
    onSuccess: (invoice: InvoiceWithLineItems) => {
      toast({
        title: "Invoice created successfully!",
        description: `Invoice ${invoice.invoiceNumber} has been created.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/invoices"] });
      setJustCreatedInvoice(true);
      // Update the URL to editing mode without redirecting
      setLocation(`/edit/${invoice.id}`);
    },
    onError: (error: any) => {
      toast({
        title: "Failed to create invoice",
        description:
          error.message || "An error occurred while creating the invoice.",
        variant: "destructive",
      });
    },
  });

  // Update invoice mutation
  const updateInvoiceMutation = useMutation({
    mutationFn: async (data: Partial<InvoiceFormData>) => {
      const response = await apiRequest(
        "PATCH",
        `/api/invoices/${params.id}`,
        data,
      );
      return response.json();
    },
    onSuccess: (invoice: InvoiceWithLineItems) => {
      toast({
        title: "Invoice updated successfully!",
        description: `Invoice ${invoice.invoiceNumber} has been updated.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/invoices"] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to update invoice",
        description:
          error.message || "An error occurred while updating the invoice.",
        variant: "destructive",
      });
    },
  });

  // Check if user came from history page
  useEffect(() => {
    const fromHistory = localStorage.getItem("fromHistory");
    if (fromHistory === "true") {
      setHasVisitedHistory(true);
      localStorage.removeItem("fromHistory");
    }
  }, []);

  // Reset justCreatedInvoice flag when user navigates away or refreshes
  useEffect(() => {
    // On mount, check if this is a fresh page load (not just created)
    if (!isEditing) {
      setJustCreatedInvoice(false);
    }
    return () => {
      setJustCreatedInvoice(false);
    };
  }, [isEditing]);

  // Load existing invoice data when editing
  useEffect(() => {
    if (existingInvoice) {
      setFormData({
        companyName: existingInvoice.companyName,
        companyEmail: existingInvoice.companyEmail,
        companyPhone: existingInvoice.companyPhone || "",
        companyWebsite: existingInvoice.companyWebsite || "",
        companyAddress: existingInvoice.companyAddress || "",
        companyLogo: existingInvoice.companyLogo,
        clientName: existingInvoice.clientName,
        clientEmail: existingInvoice.clientEmail,
        clientCompany: existingInvoice.clientCompany || "",
        clientPhone: existingInvoice.clientPhone || "",
        clientAddress: existingInvoice.clientAddress || "",
        invoiceNumber: existingInvoice.invoiceNumber,
        invoiceDate: existingInvoice.invoiceDate,
        dueDate: existingInvoice.dueDate || "",
        notes: existingInvoice.notes || "",
        currency: existingInvoice.currency || "USD",
        taxPercentage: existingInvoice.taxPercentage || "0",
        shippingCost: existingInvoice.shippingCost || "0",
        template: existingInvoice.template || "classic",
        documentType: existingInvoice.documentType || "invoice",
        primaryColor: existingInvoice.primaryColor || "#2563eb",
        secondaryColor: existingInvoice.secondaryColor || "#64748b",
        fontFamily: existingInvoice.fontFamily || "Inter",
        status: existingInvoice.status,
        isHosted: existingInvoice.isHosted || false,
        isPasswordProtected: existingInvoice.isPasswordProtected || false,
        password: existingInvoice.password || "",
      });

      setLineItems(
        existingInvoice.lineItems.map((item) => ({
          description: item.description,
          quantity: item.quantity,
          rate: item.rate,
          amount: item.amount,
        })),
      );
    }
  }, [existingInvoice]);

  // Generate QR code when hosting is enabled
  useEffect(() => {
    if (formData.isHosted && existingInvoice) {
      // Get the correct hosted URL from the API
      fetch(`/api/invoices/${existingInvoice.id}/hosted-url`)
        .then((res) => res.json())
        .then((data) => {
          if (data.hostedUrl) {
            return generateQRCode(data.hostedUrl);
          }
          throw new Error("No hosted URL received");
        })
        .then(setQRCodeDataURL)
        .catch((error) => {
          console.error("QR Code generation failed:", error);
          setQRCodeDataURL(null);
        });
    } else {
      setQRCodeDataURL(null);
    }
  }, [formData.isHosted, existingInvoice]);

  const handleFormChange = (field: keyof InvoiceFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (
      !formData.companyName ||
      !formData.companyEmail ||
      !formData.clientName ||
      !formData.clientEmail
    ) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields before saving.",
        variant: "destructive",
      });
      return;
    }

    if (lineItems.length === 0 || !lineItems[0].description) {
      toast({
        title: "No line items",
        description: "Please add at least one line item before saving.",
        variant: "destructive",
      });
      return;
    }

    const invoiceData: CreateInvoiceRequest = {
      invoice: {
        ...formData,
        subtotal: "0", // Will be calculated on backend
        tax: "0",
        total: "0",
      },
      lineItems: lineItems.map((item) => ({
        description: item.description,
        quantity: item.quantity,
        rate: item.rate,
        amount: item.amount,
      })),
    };

    if (isEditing) {
      updateInvoiceMutation.mutate(formData);
    } else {
      createInvoiceMutation.mutate(invoiceData);
    }
  };

  const handleSaveDraft = () => {
    const subtotal = lineItems.reduce((sum, item) => {
      const amount = parseFloat(item.rate || "0") * (item.quantity || 0);
      return sum + amount;
    }, 0);

    const taxAmount =
      (subtotal * parseFloat(formData.taxPercentage || "0")) / 100;
    const shippingAmount = parseFloat(formData.shippingCost || "0");
    const finalTotal = subtotal + taxAmount + shippingAmount;

    const draftInvoice: InvoiceWithLineItems = {
      id: `draft-${Date.now()}`,
      ...formData,
      textInformation: null,
      shippingCode: null,
      documentType: formData.documentType || "invoice",
      subtotal: subtotal.toFixed(2),
      tax: taxAmount.toFixed(2),
      total: finalTotal.toFixed(2),
      hostedUrl: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      lineItems: lineItems.map((item, index) => ({
        id: `draft-line-${index}`,
        invoiceId: `draft-${Date.now()}`,
        description: item.description,
        quantity: item.quantity,
        rate: item.rate,
        amount: item.amount,
      })),
    };

    saveDraft(draftInvoice);
    toast({
      title: "Draft saved",
      description: "Your invoice has been saved as a draft locally.",
    });
  };

  const getCurrentInvoice = (): InvoiceWithLineItems | null => {
    if (existingInvoice) return existingInvoice;

    const subtotal = lineItems.reduce((sum, item) => {
      const amount = parseFloat(item.rate || "0") * (item.quantity || 0);
      return sum + amount;
    }, 0);

    return {
      id: "preview",
      invoiceNumber: formData.invoiceNumber,
      status: formData.status,
      companyName: formData.companyName,
      companyEmail: formData.companyEmail,
      companyPhone: formData.companyPhone || null,
      companyWebsite: formData.companyWebsite || null,
      companyAddress: formData.companyAddress || null,
      companyLogo: formData.companyLogo,
      clientName: formData.clientName,
      clientEmail: formData.clientEmail,
      clientCompany: formData.clientCompany || null,
      clientPhone: formData.clientPhone || null,
      clientAddress: formData.clientAddress || null,
      invoiceDate: formData.invoiceDate,
      dueDate: formData.dueDate || null,
      notes: formData.notes || null,
      textInformation: null,
      shippingCode: null,
      currency: formData.currency || "USD",
      taxPercentage: formData.taxPercentage || "0",
      shippingCost: formData.shippingCost || "0",
      template: formData.template || "classic",
      documentType: formData.documentType || "invoice",
      primaryColor: formData.primaryColor || "#2563eb",
      secondaryColor: formData.secondaryColor || "#64748b",
      fontFamily: formData.fontFamily || "Inter",
      subtotal: subtotal.toFixed(2),
      tax: (
        (subtotal * parseFloat(formData.taxPercentage || "0")) /
        100
      ).toFixed(2),
      total: (
        subtotal +
        (subtotal * parseFloat(formData.taxPercentage || "0")) / 100 +
        parseFloat(formData.shippingCost || "0")
      ).toFixed(2),
      isHosted: formData.isHosted || false,
      isPasswordProtected: formData.isPasswordProtected || false,
      password: formData.password || null,
      hostedUrl: null, // Will be set by the server after creation
      createdAt: new Date(),
      updatedAt: new Date(),
      lineItems: lineItems.map((item, index) => ({
        id: `preview-${index}`,
        invoiceId: "preview",
        description: item.description,
        quantity: item.quantity,
        rate: item.rate,
        amount: item.amount,
      })),
    };
  };

  if (isEditing && isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <i className="fas fa-spinner fa-spin text-2xl text-primary"></i>
      </div>
    );
  }

  const currentInvoice = getCurrentInvoice();

  return (
    <div className="space-y-8">
      {/* Header */}
      <Card className="glass hover-lift shadow-premium border-0">
        <CardContent className="p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <i className="fas fa-receipt text-white text-xl"></i>
                </div>
                <div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    {isEditing ? "Edit Invoice" : "Create New Invoice"}
                  </h2>
                  <p className="text-gray-600 font-medium">
                    {isEditing
                      ? "Update the details of your invoice"
                      : "Fill in the details below to generate your professional invoice"}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row flex-wrap gap-3">
              <Button
                variant="outline"
                onClick={handleSaveDraft}
                disabled={
                  createInvoiceMutation.isPending ||
                  updateInvoiceMutation.isPending
                }
                className="w-full sm:w-auto btn-animate bg-white/80 hover:bg-white border-white/20 hover:border-white/40 text-gray-700 hover:text-gray-900 shadow-lg"
              >
                <i className="fas fa-save mr-2"></i>Save Draft
              </Button>
              <Button
                onClick={handleSave}
                disabled={
                  createInvoiceMutation.isPending ||
                  updateInvoiceMutation.isPending
                }
                className="w-full sm:w-auto btn-animate bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl border-0"
              >
                {createInvoiceMutation.isPending ||
                updateInvoiceMutation.isPending ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>Saving...
                  </>
                ) : (
                  <>
                    <i className="fas fa-check mr-2"></i>
                    {isEditing ? "Update Invoice" : "Create Invoice"}
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Left Column - Form */}
        <div className="lg:col-span-2">
          {/* Company Information and Bill To - Two Columns */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* First Column - Company Details */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Company Information
                  </h3>
                  <div className="space-y-4">
                    <div className="col-span-full">
                      <LogoUpload
                        onLogoChange={(logo) =>
                          handleFormChange("companyLogo", logo)
                        }
                        currentLogo={formData.companyLogo}
                      />
                    </div>
                    <div>
                      <Label htmlFor="companyName">Company Name *</Label>
                      <Input
                        id="companyName"
                        value={formData.companyName}
                        onChange={(e) =>
                          handleFormChange("companyName", e.target.value)
                        }
                        placeholder="Acme Corporation"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="companyEmail">Email Address *</Label>
                      <Input
                        id="companyEmail"
                        type="email"
                        value={formData.companyEmail}
                        onChange={(e) =>
                          handleFormChange("companyEmail", e.target.value)
                        }
                        placeholder="hello@acmecorp.com"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="companyPhone">Phone Number</Label>
                      <Input
                        id="companyPhone"
                        type="tel"
                        value={formData.companyPhone}
                        onChange={(e) =>
                          handleFormChange("companyPhone", e.target.value)
                        }
                        placeholder="+1 (555) 123-4567"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="companyWebsite">Website</Label>
                      <Input
                        id="companyWebsite"
                        type="url"
                        value={formData.companyWebsite}
                        onChange={(e) =>
                          handleFormChange("companyWebsite", e.target.value)
                        }
                        placeholder="www.acmecorp.com"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="companyAddress">Address</Label>
                      <Textarea
                        id="companyAddress"
                        value={formData.companyAddress}
                        onChange={(e) =>
                          handleFormChange("companyAddress", e.target.value)
                        }
                        rows={3}
                        placeholder="123 Business St, Suite 100&#10;New York, NY 10001"
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>

                {/* Second Column - Bill To */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Bill To
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="clientName">Client Name *</Label>
                      <Input
                        id="clientName"
                        value={formData.clientName}
                        onChange={(e) =>
                          handleFormChange("clientName", e.target.value)
                        }
                        placeholder="John Smith"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="clientEmail">Client Email *</Label>
                      <Input
                        id="clientEmail"
                        type="email"
                        value={formData.clientEmail}
                        onChange={(e) =>
                          handleFormChange("clientEmail", e.target.value)
                        }
                        placeholder="john@example.com"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="clientCompany">Company</Label>
                      <Input
                        id="clientCompany"
                        value={formData.clientCompany}
                        onChange={(e) =>
                          handleFormChange("clientCompany", e.target.value)
                        }
                        placeholder="Client Company Inc"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="clientPhone">Phone</Label>
                      <Input
                        id="clientPhone"
                        type="tel"
                        value={formData.clientPhone}
                        onChange={(e) =>
                          handleFormChange("clientPhone", e.target.value)
                        }
                        placeholder="+1 (555) 987-6543"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="clientAddress">Billing Address</Label>
                      <Textarea
                        id="clientAddress"
                        value={formData.clientAddress}
                        onChange={(e) =>
                          handleFormChange("clientAddress", e.target.value)
                        }
                        rows={3}
                        placeholder="456 Client Ave&#10;Los Angeles, CA 90210"
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Line Items Section */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Line Items
              </h3>
              <div className="space-y-4">
                {lineItems.map((item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="md:col-span-5">
                      <Label htmlFor={`description-${index}`}>
                        Description
                      </Label>
                      <Input
                        id={`description-${index}`}
                        value={item.description}
                        onChange={(e) =>
                          handleLineItemChange(
                            index,
                            "description",
                            e.target.value,
                          )
                        }
                        placeholder="Service or product description"
                        className="mt-1"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor={`quantity-${index}`}>Qty</Label>
                      <Input
                        id={`quantity-${index}`}
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          handleLineItemChange(
                            index,
                            "quantity",
                            parseInt(e.target.value) || 0,
                          )
                        }
                        placeholder="1"
                        className="mt-1"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor={`rate-${index}`}>Rate</Label>
                      <Input
                        id={`rate-${index}`}
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.rate}
                        onChange={(e) =>
                          handleLineItemChange(index, "rate", e.target.value)
                        }
                        placeholder="0.00"
                        className="mt-1"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label>Amount</Label>
                      <div className="mt-1 p-2 bg-gray-50 rounded border text-right font-medium">
                        ${item.amount}
                      </div>
                    </div>
                    <div className="md:col-span-1 flex items-end">
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeLineItem(index)}
                        className="w-full"
                      >
                        <i className="fas fa-trash text-xs"></i>
                      </Button>
                    </div>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addLineItem}
                  className="w-full border-dashed border-2 py-8 text-gray-500 hover:text-gray-700 hover:border-gray-400"
                >
                  <i className="fas fa-plus mr-2"></i>Add Line Item
                </Button>
              </div>
            </CardContent>
          </Card>

          <SimplifiedInvoiceForm
            formData={formData}
            lineItems={lineItems}
            onFormChange={handleFormChange}
            onLineItemsChange={setLineItems}
          />
        </div>

        {/* Right Column - Preview */}
        <div className="space-y-6">
          {/* Mobile: Show preview in collapsed state */}
          <div className="lg:hidden">
            <Card className="glass border-0 shadow-premium">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    Quick Preview
                  </h3>
                  {formData.isHosted && qrCodeDataURL && (
                    <div className="w-12 h-12 glass rounded-xl flex items-center justify-center hover-lift">
                      <img
                        src={qrCodeDataURL}
                        alt="QR Code"
                        className="w-10 h-10 object-contain"
                      />
                    </div>
                  )}
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>
                    <strong>Invoice:</strong>{" "}
                    {formData.invoiceNumber || "#INV-000"}
                  </div>
                  <div>
                    <strong>Company:</strong>{" "}
                    {formData.companyName || "Company Name"}
                  </div>
                  <div>
                    <strong>Client:</strong>{" "}
                    {formData.clientName || "Client Name"}
                  </div>
                  <div>
                    <strong>Total:</strong> $
                    {lineItems
                      .reduce(
                        (sum, item) =>
                          sum +
                          parseFloat(item.rate || "0") * (item.quantity || 0),
                        0,
                      )
                      .toFixed(2)}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Desktop: Full preview */}
          <div className="hidden lg:block">
            <InvoicePreview
              formData={formData}
              lineItems={lineItems}
              onFormChange={handleFormChange}
            />
          </div>
          {/* Actions Container with Create Invoice Button */}
          <Card className="mb-6">
            <CardContent className="p-4 lg:p-6">
              <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-4">
                Actions
              </h3>
              <div className="space-y-3">
                {/* Create Invoice Button - Always visible at top */}
                <Button
                  onClick={handleSave}
                  disabled={
                    createInvoiceMutation.isPending ||
                    updateInvoiceMutation.isPending
                  }
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 font-medium shadow-lg hover:shadow-xl border-0"
                >
                  {createInvoiceMutation.isPending ||
                  updateInvoiceMutation.isPending ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>Saving...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-check mr-2"></i>
                      {isEditing ? "Update Invoice" : "Create Invoice"}
                    </>
                  )}
                </Button>

                {currentInvoice && (
                  <PDFDownloadButton
                    invoice={currentInvoice}
                    qrCodeDataURL={qrCodeDataURL || undefined}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center text-sm lg:text-base shadow-md hover:shadow-lg"
                  >
                    <i className="fas fa-download mr-2"></i>Download PDF
                  </PDFDownloadButton>
                )}

                {((!justCreatedInvoice && currentInvoice) ||
                  (justCreatedInvoice && hasVisitedHistory)) && (
                  <Button
                    onClick={() => {
                      if (!currentInvoice) {
                        toast({
                          title: "No invoice to send",
                          description:
                            "Please create an invoice first before sending an email.",
                          variant: "destructive",
                        });
                        return;
                      }
                      setIsEmailModalOpen(true);
                    }}
                    className="w-full bg-green-600 hover:bg-green-700 py-3 text-sm lg:text-base"
                  >
                    <i className="fas fa-envelope mr-2"></i>Send Email
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
          {/* Summary */}
          {lineItems.length > 0 && (
            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Summary
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">
                      $
                      {lineItems
                        .reduce((sum, item) => {
                          const rate = parseFloat(item.rate || "0");
                          const quantity = parseInt(
                            item.quantity?.toString() || "0",
                          );
                          return sum + rate * quantity;
                        }, 0)
                        .toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      Tax ({formData.taxPercentage || "0"}%):
                    </span>
                    <span className="font-medium">
                      $
                      {(() => {
                        const subtotal = lineItems.reduce((sum, item) => {
                          const rate = parseFloat(item.rate || "0");
                          const quantity = parseInt(
                            item.quantity?.toString() || "0",
                          );
                          return sum + rate * quantity;
                        }, 0);
                        const taxRate =
                          parseFloat(formData.taxPercentage || "0") / 100;
                        return (subtotal * taxRate).toFixed(2);
                      })()}
                    </span>
                  </div>
                  {formData.shippingCost &&
                    parseFloat(formData.shippingCost) > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Shipping:</span>
                        <span className="font-medium">
                          ${formData.shippingCost}
                        </span>
                      </div>
                    )}
                  <div className="border-t pt-2 flex justify-between">
                    <span className="text-lg font-semibold text-gray-900">
                      Total:
                    </span>
                    <span className="text-lg font-bold text-blue-600">
                      $
                      {(() => {
                        const subtotal = lineItems.reduce((sum, item) => {
                          const rate = parseFloat(item.rate || "0");
                          const quantity = parseInt(
                            item.quantity?.toString() || "0",
                          );
                          return sum + rate * quantity;
                        }, 0);
                        const taxRate =
                          parseFloat(formData.taxPercentage || "0") / 100;
                        const tax = subtotal * taxRate;
                        const shipping = parseFloat(
                          formData.shippingCost || "0",
                        );
                        return (subtotal + tax + shipping).toFixed(2);
                      })()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Email Modal */}
      {currentInvoice && (
        <EmailModal
          isOpen={isEmailModalOpen}
          onClose={() => setIsEmailModalOpen(false)}
          invoiceId={currentInvoice.id}
          invoiceNumber={currentInvoice.invoiceNumber}
          companyName={currentInvoice.companyName}
          clientEmail={currentInvoice.clientEmail}
        />
      )}
    </div>
  );
}
