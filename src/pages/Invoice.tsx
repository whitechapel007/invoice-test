import { useQuery } from "@tanstack/react-query";
import Button from "../components/common/Button";
import { InvoiceActions } from "../components/invoice/InvoiceActions";
import { RecentActivities } from "../components/invoice/RecentActivities";
import { RecentInvoices } from "../components/invoice/RecentInvoices";
import { StatCard } from "../components/invoice/StatCard";

import { fetchInvoiceStats } from "../services/api/queries";
import Spinner from "../components/common/Spinner";
import { useState } from "react";
import CreateInvoiceModal from "../components/modal/CreateInvoiceModal";

const InvoicePage = () => {
  const [createInvoice, setCreateInvoice] = useState(false);

  const { data: stats, isLoading } = useQuery({
    queryKey: ["recent-activities"],
    queryFn: fetchInvoiceStats,
  });

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      <div className="space-y-8 p-4 lg:p-0">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-10">
          <span className="text-3xl font-semibold">Invoice</span>
          <div className="flex gap-4">
            <Button
              variant="secondary"
              className="text-gray-100 border border-stroke font-medium  text-sm  rounded-full py-5 hover:bg-gray-800 hover:text-white md:min-w-[222px] uppercase tracking-wide"
            >
              see what’s new
            </Button>
            <Button
              className=" rounded-full py-5 min-w-[150px] md:min-w-[210px] uppercase font-medium text-base"
              variant="primary"
              onClick={() => setCreateInvoice(true)}
            >
              Create
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2  md:grid-cols-3 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Paid"
            amount={stats?.totalPaid || 0}
            count={stats?.countPaid || 0}
            color="#B6FDD3"
          />
          <StatCard
            title="Total Overdue"
            amount={stats?.totalOverdue || 0}
            count={stats?.countOverdue || 0}
            color="#FFB7BD"
          />
          <StatCard
            title="Total Draft"
            amount={stats?.totalDraft || 0}
            count={stats?.countDraft || 0}
            color="#D9D9E0"
          />
          <StatCard
            title="Total Unpaid"
            amount={stats?.totalUnpaid || 0}
            count={stats?.countUnpaid || 0}
            color="#F8E39B"
          />
        </div>

        {/* Action Cards */}
        <InvoiceActions />

        {/* Recent Invoices and Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_431px] gap-8">
          <RecentInvoices />
          <RecentActivities />
        </div>
      </div>
      <CreateInvoiceModal
        openModal={createInvoice}
        onClose={() => setCreateInvoice(false)}
      />
    </>
  );
};

export default InvoicePage;
