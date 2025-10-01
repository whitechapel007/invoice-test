import { useState } from "react";
import { Invoice } from "../../types/type";
import Button from "../common/Button";
import { X } from "lucide-react";

interface InvoiceModalProps {
  invoice: Invoice | null;
  openModal: boolean;
  onClose: () => void;
}

const InvoiceModal = ({ invoice, openModal, onClose }: InvoiceModalProps) => {
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  if (!openModal || !invoice) return null;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const subtotal = invoice.subtotal || 0;
  const discount = invoice.discount || 0;
  const total = invoice.total || 0;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4">
      <button
        onClick={onClose}
        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors bg-white absolute top-2 md:right-5 2xl:right-42 right-0 p-2 z-50"
        aria-label="Close"
      >
        <X className="size-5" />
      </button>

      <div className="relative w-full max-w-7xl max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="md:flex items-center justify-between px-3 py-3 md:px-8 md:py-6 border-b border-gray-200">
          <div>
            <h1 className="md:text-3xl font-bold text-black">
              Invoice - {invoice.invoiceNumber}
            </h1>
            <p className="text-sm text-gray-100 mt-1">
              View the details and activity of this invoice
            </p>

            <Button className="text-blue-50 bg-gray-700 text-[10px] border border-blue-border md:mt-6 mt-2">
              {invoice.status === "pending"
                ? "PARTIAL PAYMENT"
                : invoice.status}
            </Button>
          </div>

          <div className="flex items-center gap-3 mt-4 md:mt-0">
            <Button className="md:px-6 py-2.5 text-sm font-medium text-blue-600 bg-white  hover:text-blue-700 transition-colors border border-stroke p-3">
              DOWNLOAD AS PDF
            </Button>
            <button className="md:px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-full transition-colors p-3">
              SEND INVOICE
            </button>
            <div className="relative">
              <Button
                onClick={() => setShowMoreMenu(!showMoreMenu)}
                className="px-4 py-2.5 text-sm font-semibold text-dark-gray  hover:bg-slate-100 rounded-full transition-colors border border-stroke bg-white"
              >
                MORE
              </Button>
              {showMoreMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl  border border-gray-200 py-2 z-10">
                  <Button className="w-full px-4 py-2 text-left text-sm text-dark-gray  hover:bg-slate-50 bg-white">
                    DUPLICATE INVOICE
                  </Button>
                  <Button className="w-full px-4 py-2 text-left text-sm text-dark-gray bg-white hover:bg-slate-50">
                    GET SHARABLE LINK
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className=" rounded-2xl p-4 md:flex items-center gap-4">
            <h3 className="text-xs font-semibold text-gray-400 uppercase my-3 md:my-0">
              REMINDERS
            </h3>
            <div className="flex flex-wrap gap-2">
              {[
                "14 days before due date",
                "7 days before due date",
                "3 days before due date",
                "24 hrs before due date",
                "On the due date",
              ].map((reminder, idx) => (
                <button
                  key={idx}
                  className={`px-3 py-2 text-sm font-medium rounded-3xl transition-colors ${
                    idx < 2
                      ? "bg-secondary-green text-dark-gray border border-green-300"
                      : "bg-white text-dark-gray border border-gray-200 hover:bg-slate-50"
                  }`}
                >
                  {reminder}
                  {idx < 2 && <span className="ml-2">✓</span>}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-4 md:p-6">
            {/* Left Column - Invoice Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Sender and Customer Info */}
              <div className="bg-fuscia rounded-2xl p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xs font-semibold text-gray-500 uppercase mb-4">
                      SENDER
                    </h3>
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                        <img src={invoice.sender.image} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-black">
                          {invoice.sender.name}
                        </h4>
                        <p className="text-sm text-gray-100 mt-1">
                          {invoice.sender.phone}
                        </p>
                        <p className="text-sm text-gray-100">
                          {invoice.sender.address}
                        </p>
                        <p className="text-sm text-gray-100">
                          {invoice.sender.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-semibold text-gray-500 uppercase mb-4">
                      CUSTOMER
                    </h3>
                    <div>
                      <h4 className="font-semibold text-black">
                        {invoice.customer.name}
                      </h4>
                      <p className="text-sm text-gray-100 mt-1">
                        {invoice.customer.phone}
                      </p>
                      <p className="text-sm text-gray-100">
                        {invoice.customer.email}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-pink-200">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase mb-4">
                    INVOICE DETAILS
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase">
                        Invoice No
                      </p>
                      <p className="font-semibold text-gray-900 mt-1 text-xs">
                        {invoice.invoiceNumber}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase">
                        Issue Date
                      </p>
                      <p className="font-semibold text-gray-900 mt-1 text-xs">
                        {formatDate(invoice.createdAt || invoice.dueDate)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase">
                        Due Date
                      </p>
                      <p className="font-semibold text-gray-900 mt-1 text-xs">
                        {formatDate(invoice.dueDate)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase">
                        Billing Currency
                      </p>
                      <p className="font-semibold text-gray-900 mt-1 text-xs">
                        {invoice.currency} ($)
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Items */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Items
                </h3>
                <div className="space-y-4">
                  {invoice.items &&
                    invoice.items.length > 0 &&
                    invoice.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="grid grid-cols-12 gap-4 py-4 border-b border-gray-200"
                      >
                        <div className=" col-span-5">
                          <p className="font-medium text-gray-900">
                            {item.description}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            {item?.details}
                          </p>
                        </div>
                        <div className="col-span-2 text-center">
                          <p className="text-gray-900">{item.quantity}</p>
                        </div>
                        <div className="col-span-2 text-right">
                          <p className="text-gray-900 text-sm">
                            {formatCurrency(item.price)}
                          </p>
                        </div>
                        <div className="col-span-3 text-right">
                          <p className="font-semibold text-gray-900 text-sm">
                            {formatCurrency(item.total)}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>

                <div className="mt-6 space-y-3 md:w-2/3 md:ml-auto">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 uppercase text-xs">
                      Subtotal
                    </span>
                    <span className="font-semibold text-gray-900 text-sm md:text-base">
                      {formatCurrency(subtotal)}
                    </span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 uppercase text-xs">
                        Discount (2.5%)
                      </span>
                      <span className="font-semibold text-gray-900">
                        {formatCurrency(discount)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                    <span className="text-base  md:text-sm font-semibold text-gray-900 uppercase">
                      Total Amount Due
                    </span>
                    <span className="text-xs md:text-2xl font-bold text-gray-900">
                      {formatCurrency(total)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-white rounded-2xl p-6 border border-stroke">
                <h3 className="text-xs font-semibold text-gray-500 uppercase mb-4">
                  PAYMENT INFORMATION
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <p className="text-xs text-gray-500 uppercase mb-1">
                      Account Name
                    </p>
                    <p className="font-semibold text-gray-900">
                      {" "}
                      {invoice.paymentInfo.accountName}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase mb-1">
                      Account Number
                    </p>
                    <p className="font-semibold text-gray-900">
                      {invoice.paymentInfo.accountNumber}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase mb-1">
                      ACH Routing No
                    </p>
                    <p className="font-semibold text-gray-900">
                      {invoice.paymentInfo.routingNumber}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase mb-1">
                      Bank Name
                    </p>
                    <p className="font-semibold text-gray-900">
                      {" "}
                      {invoice.paymentInfo.bankName}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase mb-1">
                      Bank Address
                    </p>
                    <p className="font-semibold text-gray-900">
                      {invoice.paymentInfo.bankAddress}
                    </p>
                  </div>
                </div>
              </div>

              {/* Note */}
              <div className="bg-gray-600 p-4 rounded-3xl ">
                <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">
                  NOTE
                </h3>
                <p className="text-sm text-gray-400">
                  Thank you for your patronage
                </p>
              </div>
            </div>

            {/* Right Column - Activity */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-6">
                <h3 className="text-lg font-medium text-gray-900 mb-6">
                  Invoice Activity
                </h3>
                <div className="space-y-6">
                  {invoice.activities &&
                    invoice.activities.length > 0 &&
                    invoice.activities.map((activity) => (
                      <div className="flex items-start gap-3" key={activity.id}>
                        <div className="w-12 h-12  rounded-full flex items-center justify-center">
                          <img src="/profilePic.svg" className="rounded-full" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">
                            {activity.clientName || "Olaniyi Ojo Adewale"}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            Today, 12:20 PM
                          </p>
                          <p className="text-sm bg-gray-600 mt-2 p-3 rounded-2xl">
                            Created invoice{" "}
                            <span className="font-semibold text-gray-900">
                              00239434/Olaniyi Ojo Adewale
                            </span>
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceModal;
