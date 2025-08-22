import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import InvoiceForm from "@/components/invoice-form";
import InvoicePreview from "@/components/invoice-preview";
import EmailModal from "@/components/email-modal";
import { PDFDownloadButton } from "@/lib/pdf-generator";
import { useInvoiceStorage } from "@/hooks/use-invoice-storage";
import { generateQRCode } from "@/lib/qr-generator";
import type { InvoiceFormData, LineItemFormData } from "@/types/invoice";
import type { InvoiceWithLineItems, CreateInvoiceRequest } from "@shared/schema";

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
  invoiceDate: new Date().toISOString().split('T')[0],
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
        description: error.message || "An error occurred while creating the invoice.",
        variant: "destructive",
      });
    },
  });

  // Update invoice mutation
  const updateInvoiceMutation = useMutation({
    mutationFn: async (data: Partial<InvoiceFormData>) => {
      const response = await apiRequest("PATCH", `/api/invoices/${params.id}`, data);
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
        description: error.message || "An error occurred while updating the invoice.",
        variant: "destructive",
      });
    },
  });

  // Check if user came from history page
  useEffect(() => {
    const fromHistory = localStorage.getItem('fromHistory');
    if (fromHistory === 'true') {
      setHasVisitedHistory(true);
      localStorage.removeItem('fromHistory');
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
        }))
      );
    }
  }, [existingInvoice]);

  // Generate QR code when hosting is enabled
  useEffect(() => {
    if (formData.isHosted && existingInvoice) {
      // Get the correct hosted URL from the API
      fetch(`/api/invoices/${existingInvoice.id}/hosted-url`)
        .then(res => res.json())
        .then(data => {
          if (data.hostedUrl) {
            return generateQRCode(data.hostedUrl);
          }
          throw new Error('No hosted URL received');
        })
        .then(setQRCodeDataURL)
        .catch((error) => {
          console.error('QR Code generation failed:', error);
          setQRCodeDataURL(null);
        });
    } else {
      setQRCodeDataURL(null);
    }
  }, [formData.isHosted, existingInvoice]);

  const handleFormChange = (field: keyof InvoiceFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!formData.companyName || !formData.companyEmail || !formData.clientName || !formData.clientEmail) {
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
      lineItems: lineItems.map(item => ({
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

    const taxAmount = (subtotal * parseFloat(formData.taxPercentage || "0")) / 100;
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
      tax: ((subtotal * parseFloat(formData.taxPercentage || "0")) / 100).toFixed(2),
      total: (subtotal + (subtotal * parseFloat(formData.taxPercentage || "0")) / 100 + parseFloat(formData.shippingCost || "0")).toFixed(2),
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
                      : "Fill in the details below to generate your professional invoice"
                    }
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row flex-wrap gap-3">
              <Button
                variant="outline"
                onClick={handleSaveDraft}
                disabled={createInvoiceMutation.isPending || updateInvoiceMutation.isPending}
                className="w-full sm:w-auto btn-animate bg-white/80 hover:bg-white border-white/20 hover:border-white/40 text-gray-700 hover:text-gray-900 shadow-lg"
              >
                <i className="fas fa-save mr-2"></i>Save Draft
              </Button>
              <Button
                onClick={handleSave}
                disabled={createInvoiceMutation.isPending || updateInvoiceMutation.isPending}
                className="w-full sm:w-auto btn-animate bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl border-0"
              >
                {createInvoiceMutation.isPending || updateInvoiceMutation.isPending ? (
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
          <InvoiceForm
            formData={formData}
            lineItems={lineItems}
            onFormChange={handleFormChange}
            onLineItemsChange={setLineItems}
          />
        </div>

        {/* Right Column - Preview & Actions */}
        <div className="space-y-6">
          {/* Mobile: Show preview in collapsed state */}
          <div className="lg:hidden">
            <Card className="glass border-0 shadow-premium">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Quick Preview</h3>
                  {formData.isHosted && qrCodeDataURL && (
                    <div className="w-12 h-12 glass rounded-xl flex items-center justify-center hover-lift">
                      <img src={qrCodeDataURL} alt="QR Code" className="w-10 h-10 object-contain" />
                    </div>
                  )}
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <div><strong>Invoice:</strong> {formData.invoiceNumber || "#INV-000"}</div>
                  <div><strong>Company:</strong> {formData.companyName || "Company Name"}</div>
                  <div><strong>Client:</strong> {formData.clientName || "Client Name"}</div>
                  <div><strong>Total:</strong> ${lineItems.reduce((sum, item) => sum + (parseFloat(item.rate || "0") * (item.quantity || 0)), 0).toFixed(2)}</div>
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

          {/* Action Buttons */}
          <Card>
            <CardContent className="p-4 lg:p-6">
              <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-4">Actions</h3>
              <div className="space-y-3">
                {/* Mobile: Create Invoice Button */}
                <div className="lg:hidden">
                  <Button
                    onClick={handleSave}
                    disabled={createInvoiceMutation.isPending || updateInvoiceMutation.isPending}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 font-medium shadow-lg hover:shadow-xl border-0 mb-3"
                  >
                    {createInvoiceMutation.isPending || updateInvoiceMutation.isPending ? (
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
                
                {currentInvoice && (
                  <PDFDownloadButton
                    invoice={currentInvoice}
                    qrCodeDataURL={qrCodeDataURL || undefined}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center text-sm lg:text-base shadow-md hover:shadow-lg"
                  >
                    <i className="fas fa-download mr-2"></i>Download PDF
                  </PDFDownloadButton>
                )}
                {!justCreatedInvoice && (
                  <Button
                    onClick={() => {
                      if (!currentInvoice) {
                        toast({
                          title: "No invoice to send",
                          description: "Please create an invoice first before sending an email.",
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
                {justCreatedInvoice && hasVisitedHistory && (
                  <Button
                    onClick={() => setIsEmailModalOpen(true)}
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
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">
                      ${lineItems.reduce((sum, item) => {
                        const rate = parseFloat(item.rate || "0");
                        const quantity = parseInt(item.quantity?.toString() || "0");
                        return sum + (rate * quantity);
                      }, 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax ({formData.taxPercentage || "0"}%):</span>
                    <span className="font-medium">
                      ${(() => {
                        const subtotal = lineItems.reduce((sum, item) => {
                          const rate = parseFloat(item.rate || "0");
                          const quantity = parseInt(item.quantity?.toString() || "0");
                          return sum + (rate * quantity);
                        }, 0);
                        const taxRate = parseFloat(formData.taxPercentage || "0") / 100;
                        return (subtotal * taxRate).toFixed(2);
                      })()}
                    </span>
                  </div>
                  {formData.shippingCost && parseFloat(formData.shippingCost) > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Shipping:</span>
                      <span className="font-medium">${formData.shippingCost}</span>
                    </div>
                  )}
                  <div className="border-t pt-2 flex justify-between">
                    <span className="text-lg font-semibold text-gray-900">Total:</span>
                    <span className="text-lg font-bold text-blue-600">
                      ${(() => {
                        const subtotal = lineItems.reduce((sum, item) => {
                          const rate = parseFloat(item.rate || "0");
                          const quantity = parseInt(item.quantity?.toString() || "0");
                          return sum + (rate * quantity);
                        }, 0);
                        const taxRate = parseFloat(formData.taxPercentage || "0") / 100;
                        const tax = subtotal * taxRate;
                        const shipping = parseFloat(formData.shippingCost || "0");
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
