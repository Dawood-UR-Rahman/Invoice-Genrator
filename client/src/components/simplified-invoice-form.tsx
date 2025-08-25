import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Palette } from "lucide-react";
import { INVOICE_TEMPLATES, CURRENCIES, FONT_FAMILIES, DOCUMENT_TYPES, getTemplateById } from "@/lib/invoice-templates";
import type { InvoiceFormData, LineItemFormData } from "@/types/invoice";

interface SimplifiedInvoiceFormProps {
  formData: InvoiceFormData;
  lineItems: LineItemFormData[];
  onFormChange: (field: keyof InvoiceFormData, value: any) => void;
  onLineItemsChange: (items: LineItemFormData[]) => void;
}

export default function SimplifiedInvoiceForm({
  formData,
  lineItems,
  onFormChange,
  onLineItemsChange,
}: SimplifiedInvoiceFormProps) {
  return (
    <div className="space-y-6">
      {/* Invoice Details */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Invoice Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="invoiceNumber">Invoice Number *</Label>
              <Input
                id="invoiceNumber"
                value={formData.invoiceNumber}
                onChange={(e) => onFormChange("invoiceNumber", e.target.value)}
                placeholder="INV-001"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="invoiceDate">Invoice Date *</Label>
              <Input
                id="invoiceDate"
                type="date"
                value={formData.invoiceDate}
                onChange={(e) => onFormChange("invoiceDate", e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => onFormChange("dueDate", e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
          <div className="mt-4">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => onFormChange("notes", e.target.value)}
              rows={3}
              placeholder="Thank you for your business!"
              className="mt-1"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
            <div>
              <Label htmlFor="documentType">Document Type</Label>
              <Select value={formData.documentType} onValueChange={(value) => onFormChange("documentType", value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {DOCUMENT_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.icon} {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="currency">Currency</Label>
              <Select value={formData.currency} onValueChange={(value) => onFormChange("currency", value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      {currency.symbol} {currency.code} - {currency.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="taxPercentage">Tax Percentage (%)</Label>
              <Input
                id="taxPercentage"
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={formData.taxPercentage}
                onChange={(e) => onFormChange("taxPercentage", e.target.value)}
                placeholder="8.25"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="shippingCost">Shipping Cost</Label>
              <Input
                id="shippingCost"
                type="number"
                min="0"
                step="0.01"
                value={formData.shippingCost}
                onChange={(e) => onFormChange("shippingCost", e.target.value)}
                placeholder="15.00"
                className="mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Template & Design */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Template & Design
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="template">Invoice Template</Label>
            <Select value={formData.template} onValueChange={(value) => {
              const template = getTemplateById(value);
              onFormChange("template", value);
              onFormChange("primaryColor", template.primaryColor);
              onFormChange("secondaryColor", template.secondaryColor);
              onFormChange("fontFamily", template.fontFamily);
            }}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select template" />
              </SelectTrigger>
              <SelectContent>
                {INVOICE_TEMPLATES.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.preview} {template.name} - {template.description}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="primaryColor">Primary Color</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="primaryColor"
                  type="color"
                  value={formData.primaryColor}
                  onChange={(e) => onFormChange("primaryColor", e.target.value)}
                  className="w-12 h-10 p-1 border-2"
                />
                <Input
                  type="text"
                  value={formData.primaryColor}
                  onChange={(e) => onFormChange("primaryColor", e.target.value)}
                  placeholder="#2563eb"
                  className="flex-1"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="secondaryColor">Secondary Color</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="secondaryColor"
                  type="color"
                  value={formData.secondaryColor}
                  onChange={(e) => onFormChange("secondaryColor", e.target.value)}
                  className="w-12 h-10 p-1 border-2"
                />
                <Input
                  type="text"
                  value={formData.secondaryColor}
                  onChange={(e) => onFormChange("secondaryColor", e.target.value)}
                  placeholder="#64748b"
                  className="flex-1"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="fontFamily">Font Family</Label>
              <Select value={formData.fontFamily} onValueChange={(value) => onFormChange("fontFamily", value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select font" />
                </SelectTrigger>
                <SelectContent>
                  {FONT_FAMILIES.map((font) => (
                    <SelectItem key={font.value} value={font.value}>
                      {font.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}