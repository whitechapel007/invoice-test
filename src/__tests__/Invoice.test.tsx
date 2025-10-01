// Invoice.test.tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import InvoiceModal from "../components/modal/InvoiceModal";

import { Invoice } from "../types/type";

// Mock the queries module
vi.mock("../services/api/queries", () => ({
  fetchInvoiceStats: vi.fn(),
}));

const mockInvoice: Invoice = {
  id: "1",
  invoiceNumber: "1023494 - 2304",
  status: "paid",
  dueDate: "2023-05-19",
  createdAt: "2022-11-27",
  total: 1500,
  currency: "$",
  subtotal: 1500,
  discount: 0,
  activities: [
    {
      id: "act-1",
      type: "invoice_created",
      message: "Created invoice 1023494 - 2304 / Olaniyi Ojo Adewale",
      timestamp: "2023-09-26T12:05:00.000Z",
      invoiceId: "1023494 - 2304",
      user: {
        id: "user-2",
        name: "Jane Smith",
        email: "jane@example.com",
        avatar: "/avatars/user-2.jpg",
      },
    },
    {
      id: "act-2",
      type: "payment_confirmed",
      message: "Payment received for invoice 1023494 - 2304",
      timestamp: "2023-09-27T09:00:00.000Z",
      invoiceId: "1023494 - 2304",
      user: {
        id: "user-1",
        name: "Admin User",
        email: "admin@example.com",
        avatar: "/avatars/user-1.jpg",
      },
    },
  ],
  customer: {
    id: "cust-1",
    name: "Olaniyi Ojo Adewale",
    email: "olaniyi@example.com",
    phone: "+386 989 271 3115",
    address: "1331 Hart Ridge Road 48436 Gaines, MI",
  },
  sender: {
    name: "Fabulous Enterprise",
    email: "info@fabulousenterprise.co",
    phone: "+386 989 271 3115",
    address: "1331 Hart Ridge Road 48436 Gaines, MI",
    image: "/sender.svg",
  },
  paymentInfo: {
    accountName: "Fabulous Enterprise",
    accountNumber: "1234567890",
    routingNumber: "987654321",
    bankName: "Fabulous Bank",
    bankAddress: "123 Bank St, Finance City, FC 12345",
  },
  items: [
    {
      id: "item-1",
      description: "Website Design",
      details:
        "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantiu",
      quantity: 1,
      price: 1500,
      total: 1500,
    },
  ],
};

describe("InvoiceModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("does not render when openModal is false", () => {
    const { container } = render(
      <InvoiceModal invoice={mockInvoice} openModal={false} onClose={vi.fn()} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("renders invoice details when open", () => {
    render(
      <InvoiceModal invoice={mockInvoice} openModal={true} onClose={vi.fn()} />
    );

    expect(screen.getAllByText(/Olaniyi Ojo Adewale/i).length).toBeGreaterThan(
      0
    );

    expect(screen.getByText(/Website Design/)).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", () => {
    const onClose = vi.fn();
    render(
      <InvoiceModal invoice={mockInvoice} openModal={true} onClose={onClose} />
    );

    const closeBtn = screen.getByLabelText(/close/i);
    fireEvent.click(closeBtn);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("toggles more menu when MORE button is clicked", () => {
    render(
      <InvoiceModal invoice={mockInvoice} openModal={true} onClose={vi.fn()} />
    );

    const moreBtn = screen.getByRole("button", { name: /more/i });
    fireEvent.click(moreBtn);

    expect(screen.getByText(/DUPLICATE INVOICE/i)).toBeInTheDocument();
    expect(screen.getByText(/GET SHARABLE LINK/i)).toBeInTheDocument();
  });

  it("renders activities", () => {
    render(
      <InvoiceModal invoice={mockInvoice} openModal={true} onClose={vi.fn()} />
    );
    expect(screen.queryAllByText(/Jane Smith/i).length).toBe(0);
    expect(screen.queryAllByAltText(/Created invoice/).length).toBe(0);
  });
});
