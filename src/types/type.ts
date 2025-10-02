// Types
export interface Invoice {
  id: string;
  invoiceNumber: string;
  dueDate: string;
  total: number;
  currency: string;
  status: "paid" | "overdue" | "draft" | "unpaid" | "pending";
  createdAt: string;
  phoneNo?: string;
  address?: string;
  sender: Sender;
  customer: Customer;
  items: InvoiceItem[];
  paymentInfo: PaymentInfo;
  subtotal: number;
  discount: number;
  activities: Activity[];
}

export interface Sender {
  name: string;
  email: string;
  phone: string;
  address: string;
  image?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
  total: number;
  details: string;
}

export interface PaymentInfo {
  accountName: string;
  accountNumber: string;
  routingNumber: string;
  bankName: string;
  bankAddress?: string;
}

export interface InvoiceStats {
  totalPaid: number;
  totalOverdue: number;
  totalDraft: number;
  totalUnpaid: number;
  paid: number;
  overdue: number;
  draft: number;
  unpaid: number;
}

export interface Activity {
  id: string;
  type: "invoice_created" | "payment_confirmed" | "invoice_sent";
  message: string;
  timestamp: string;
  invoiceId?: string;
  user: any | null;
  invoiceNumber?: string;
  clientName?: string;
}

export interface InvoiceFormData {
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  items: InvoiceItem[];
  dueDate: string;
  status: string;
  currency: string;
  discount: number;
}
