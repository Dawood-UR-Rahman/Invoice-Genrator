import { Document, Page, Text, View, StyleSheet, Image, PDFDownloadLink } from '@react-pdf/renderer';
import { InvoiceWithLineItems } from '@shared/schema';
import { getCurrencySymbol } from './invoice-templates';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 40,
    fontSize: 12,
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  logo: {
    width: 100,
    height: 60,
    objectFit: 'contain',
  },
  companyInfo: {
    flexDirection: 'column',
  },
  invoiceInfo: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  text: {
    fontSize: 12,
    marginBottom: 3,
  },
  billTo: {
    marginBottom: 30,
  },
  table: {
    marginBottom: 30,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    padding: 10,
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    padding: 10,
  },
  tableColDescription: {
    width: '50%',
  },
  tableColQty: {
    width: '15%',
    textAlign: 'center',
  },
  tableColRate: {
    width: '17.5%',
    textAlign: 'right',
  },
  tableColAmount: {
    width: '17.5%',
    textAlign: 'right',
  },
  totals: {
    alignItems: 'flex-end',
    marginBottom: 30,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 200,
    marginBottom: 5,
  },
  totalLabel: {
    fontSize: 12,
  },
  totalValue: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  grandTotal: {
    fontSize: 14,
    fontWeight: 'bold',
    borderTopWidth: 1,
    borderTopColor: '#000000',
    paddingTop: 5,
  },
  notes: {
    marginTop: 30,
  },
  qrCode: {
    width: 60,
    height: 60,
    marginTop: 10,
  },
});

interface PDFInvoiceProps {
  invoice: InvoiceWithLineItems;
  qrCodeDataURL?: string;
}

export function PDFInvoice({ invoice, qrCodeDataURL }: PDFInvoiceProps) {
  // Generate QR code URL if invoice is hosted and no QR code provided
  const invoiceQRCode = qrCodeDataURL || (invoice.isHosted && invoice.hostedUrl ? 
    `https://api.qrserver.com/v1/create-qr-code/?size=200x200&format=png&data=${encodeURIComponent(invoice.hostedUrl)}` : null);
  
  const currencySymbol = getCurrencySymbol(invoice.currency || "USD");
  const primaryColor = invoice.primaryColor || "#2563eb";
  
  // Create dynamic styles based on invoice template
  const dynamicStyles = StyleSheet.create({
    titleColored: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 10,
      color: primaryColor,
    },
    tableHeaderColored: {
      flexDirection: 'row',
      backgroundColor: primaryColor,
      padding: 10,
      fontWeight: 'bold',
      color: '#ffffff',
    },
    grandTotalColored: {
      fontSize: 14,
      fontWeight: 'bold',
      borderTopWidth: 1,
      borderTopColor: primaryColor,
      paddingTop: 5,
      color: primaryColor,
    },
  });
  
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.companyInfo}>
            {invoice.companyLogo && (
              <Image src={invoice.companyLogo} style={styles.logo} />
            )}
            <Text style={styles.subtitle}>{invoice.companyName}</Text>
            <Text style={styles.text}>{invoice.companyEmail}</Text>
            {invoice.companyPhone && <Text style={styles.text}>{invoice.companyPhone}</Text>}
            {invoice.companyWebsite && <Text style={styles.text}>{invoice.companyWebsite}</Text>}
            {invoice.companyAddress && (
              <Text style={styles.text}>{invoice.companyAddress}</Text>
            )}
          </View>
          <View style={styles.invoiceInfo}>
            <Text style={dynamicStyles.titleColored}>
              {invoice.documentType === "credit-note" ? "CREDIT NOTE" :
               invoice.documentType === "quote" ? "QUOTE" :
               invoice.documentType === "purchase-order" ? "PURCHASE ORDER" :
               "INVOICE"}
            </Text>
            <Text style={styles.text}>#{invoice.invoiceNumber}</Text>
            <Text style={styles.text}>Date: {new Date(invoice.invoiceDate).toLocaleDateString()}</Text>
            {invoice.dueDate && (
              <Text style={styles.text}>Due: {new Date(invoice.dueDate).toLocaleDateString()}</Text>
            )}
            {/* QR Code positioned below invoice info */}
            {invoiceQRCode && (
              <Image src={invoiceQRCode} style={styles.qrCode} />
            )}
          </View>
        </View>

        {/* Bill To */}
        <View style={styles.billTo}>
          <Text style={styles.subtitle}>Bill To:</Text>
          <Text style={styles.text}>{invoice.clientName}</Text>
          {invoice.clientCompany && <Text style={styles.text}>{invoice.clientCompany}</Text>}
          <Text style={styles.text}>{invoice.clientEmail}</Text>
          {invoice.clientPhone && <Text style={styles.text}>{invoice.clientPhone}</Text>}
          {invoice.clientAddress && <Text style={styles.text}>{invoice.clientAddress}</Text>}
        </View>

        {/* Line Items Table */}
        <View style={styles.table}>
          <View style={dynamicStyles.tableHeaderColored}>
            <Text style={styles.tableColDescription}>Description</Text>
            <Text style={styles.tableColQty}>Qty</Text>
            <Text style={styles.tableColRate}>Rate</Text>
            <Text style={styles.tableColAmount}>Amount</Text>
          </View>
          {invoice.lineItems.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableColDescription}>{item.description}</Text>
              <Text style={styles.tableColQty}>{item.quantity}</Text>
              <Text style={styles.tableColRate}>{currencySymbol}{item.rate}</Text>
              <Text style={styles.tableColAmount}>{currencySymbol}{item.amount}</Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.totals}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal:</Text>
            <Text style={styles.totalValue}>{currencySymbol}{invoice.subtotal}</Text>
          </View>
          {parseFloat(invoice.taxPercentage || "0") > 0 && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Tax ({invoice.taxPercentage}%):</Text>
              <Text style={styles.totalValue}>{currencySymbol}{invoice.tax}</Text>
            </View>
          )}
          {parseFloat(invoice.shippingCost || "0") > 0 && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Shipping Cost:</Text>
              <Text style={styles.totalValue}>{currencySymbol}{invoice.shippingCost}</Text>
            </View>
          )}
          <View style={[styles.totalRow, dynamicStyles.grandTotalColored]}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalValue}>{currencySymbol}{invoice.total}</Text>
          </View>
        </View>

        {/* Notes */}
        {invoice.notes && (
          <View style={styles.notes}>
            <Text style={styles.subtitle}>Notes:</Text>
            <Text style={styles.text}>{invoice.notes}</Text>
          </View>
        )}
      </Page>
    </Document>
  );
}

interface PDFDownloadButtonProps {
  invoice: InvoiceWithLineItems;
  qrCodeDataURL?: string;
  children: React.ReactNode;
  className?: string;
}

export function PDFDownloadButton({ invoice, qrCodeDataURL, children, className }: PDFDownloadButtonProps) {
  return (
    <PDFDownloadLink
      document={<PDFInvoice invoice={invoice} qrCodeDataURL={qrCodeDataURL} />}
      fileName={`invoice-${invoice.invoiceNumber}.pdf`}
      className={className}
    >
      {children}
    </PDFDownloadLink>
  );
}
