export const StatCard = ({
  title,
  amount,
  count,
  color,
  currency = "$",
}: {
  title: string;
  amount: number;
  count: number;
  color: string;
  currency?: string;
}) => {
  const formatAmount = (num: number) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-200 p-2 py-8  w-full md:max-w-[246px] ">
      <div className="md:max-w-[185px] w-full md:mx-auto">
        <div className="mb-6">
          <img src="/overview.svg" alt="" className="w-9 h-9" />
        </div>
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-normal text-gray-100 uppercase tracking-wide">
              {title}
            </span>
          </div>
          <div
            className={`px-4 py-[11px] text-sm font-medium text-dark-gray rounded-3xl`}
            style={{ backgroundColor: color }}
          >
            {count.toString().padStart(2, "0")}
          </div>
        </div>
        <div className="text-[28px] font-medium text-black">
          {currency}
          {formatAmount(amount)}
        </div>
      </div>
    </div>
  );
};
