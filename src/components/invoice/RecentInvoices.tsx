import { useQuery } from "@tanstack/react-query";
import { Invoice } from "../../types/type";
import Button from "../common/Button";
import { fetchInvoices } from "../../services/api/queries";
import { useState } from "react";
import InvoiceModal from "../modal/InvoiceModal";

export const RecentInvoices = () => {
  const [openModal, setOpenModal] = useState(false);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = (status: Invoice["status"]) => {
    switch (status) {
      case "paid":
        return "bg-secondary-green text-darker-green border border-green-border";
      case "overdue":
        return "bg-red-100 text-red-200 border border-red-border";
      case "draft":
        return "bg-lightGray text-dark-gray border border-gray-border";
      case "pending":
        return "bg-yellow-100 text-yellow-200 border border-yellow-200";
      default:
        return "bg-gray-50 text-gray-700 border border-gray-200";
    }
  };

  const { data: invoices, isLoading } = useQuery({
    queryKey: ["invoices"],
    queryFn: fetchInvoices,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const onInvoiceClick = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setOpenModal(true);
  };

  const closeModal = () => {
    setOpenModal(false);
    setSelectedInvoice(null);
  };
  if (isLoading) {
    return <div>Loading...</div>;
  }
  // Group invoices by date
  const groupedInvoices =
    invoices &&
    invoices.reduce((acc, invoice) => {
      const date = invoice.createdAt || invoice.dueDate;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(invoice);
      return acc;
    }, {} as Record<string, Invoice[]>);

  return (
    <>
      <div className="bg-white rounded-3xl p-8 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-medium text-gray-900">Recent Invoices</h2>
          <Button className="px-6 py-3 text-xs font-semibold text-blue-50 bg-white border border-gray-200 rounded-full hover:bg-slate-100 transition-colors ">
            VIEW ALL INVOICES
          </Button>
        </div>

        <div className="space-y-8">
          {Object.entries(groupedInvoices || {}).map(([date, dateInvoices]) => (
            <div key={date}>
              <div className="mb-4">
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                  {date === new Date().toISOString().split("T")[0]
                    ? `TODAY - ${formatDate(date).toUpperCase()}`
                    : formatDate(date).toUpperCase()}
                </h3>
              </div>

              <div className="space-y-4">
                {dateInvoices.map((invoice) => (
                  <div
                    key={invoice.id}
                    className="grid grid-cols-3 items-center gap-4 py-4  rounded-lg cursor-pointer transition-colors px-2 hover:bg-slate-100"
                    onClick={() => onInvoiceClick(invoice)}
                  >
                    <div className="col-span-1">
                      <div className="text-sm font-medium text-dark-gray">
                        Invoice -
                      </div>
                      <div className="text-sm font-medium text-dark-gray">
                        {invoice.invoiceNumber}
                      </div>
                    </div>

                    <div className="col-span-1">
                      <div className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">
                        DUE DATE
                      </div>
                      <div className="text-sm text-gray-100">
                        {formatDate(invoice.dueDate)}
                      </div>
                    </div>

                    <div className="col-span-1 flex flex-col items-end justify-end gap-3">
                      <div className="text-base font-medium text-gray-900">
                        $
                        {invoice?.total?.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </div>
                      <span
                        className={`px-4 py-1.5 rounded-full text-[7.5px] font-semibold uppercase ${getStatusColor(
                          invoice.status
                        )}`}
                      >
                        {invoice.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <InvoiceModal
        invoice={selectedInvoice}
        openModal={openModal}
        onClose={closeModal}
      />
    </>
  );
};
