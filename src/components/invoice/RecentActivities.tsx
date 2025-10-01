import { useQuery } from "@tanstack/react-query";
import Button from "../common/Button";
import { fetchActivities } from "../../services/api/queries";

export const RecentActivities = () => {
  const { data: activities, isLoading } = useQuery({
    queryKey: ["activities"],
    queryFn: fetchActivities,
  });

  const formatDateTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);

    const isToday = date.toDateString() === now.toDateString();
    const isYesterday = date.toDateString() === yesterday.toDateString();

    const time = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    if (isToday) {
      return `Today, ${time}`;
    } else if (isYesterday) {
      return `Yesterday, ${time}`;
    } else {
      return `${date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })}, ${time}`;
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-medium text-black">Recent Activities</h2>
        <Button className="px-6 py-3 text-xs font-semibold text-blue-50 bg-white border border-gray-200 rounded-full hover:bg-slate-100 transition-colors">
          VIEW ALL
        </Button>
      </div>

      <div className="space-y-6">
        {activities?.map((activity) => (
          <div key={activity.id} className="flex items-start gap-4">
            <div className="w-12 h-12  rounded-full flex items-center justify-center">
              <img src="/profilePic.svg" className="rounded-full" />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-medium text-black">
                {activity.type === "invoice_created"
                  ? "Invoice creation"
                  : activity.type === "payment_confirmed"
                  ? "Payment Confirmed"
                  : activity.type === "invoice_sent"
                  ? "Invoice Sent"
                  : "Activity"}
              </h3>

              <p className="text-sm text-gray-500 mb-1">
                {formatDateTime(activity.timestamp)}
              </p>

              <div className="bg-gray-600 rounded-2xl p-4">
                <p className="text-sm text-gray-100">
                  {activity.message || (
                    <>
                      Created invoice{" "}
                      <span className="font-semibold text-black">
                        {activity.invoiceNumber || "00239434"}
                      </span>
                      {activity.clientName && (
                        <>
                          /
                          <span className="font-semibold  text-black">
                            {activity.clientName}
                          </span>
                        </>
                      )}
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
