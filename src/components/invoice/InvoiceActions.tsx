export const InvoiceActions = () => {
  return (
    <>
      <span className="text-xl font-medium mb-4 block">Invoice Actions</span>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-50 rounded-3xl px-10 text-white cursor-pointer hover:bg-blue-700 transition-colors py-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="">
              <img
                src="/money.svg"
                alt=""
                className="min-w-[80px] min-h-[80px]"
              />
            </div>
          </div>
          <h3 className="text-xl font-semibold mb-2">Create New Invoice</h3>
          <p className="text-white text-sm  tracking-wide">
            Create new invoices easily
          </p>
        </div>

        <div className="bg-white rounded-3xl px-10 cursor-pointer  transition-colors py-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="">
              <img
                src="/settings.svg"
                alt=""
                className="min-w-[80px] min-h-[80px]"
              />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Change Invoice settings
          </h3>
          <p className="text-gray-600  text-sm tracking-wide">
            Customize your invoices
          </p>
        </div>

        <div className="bg-white rounded-3xl px-10 cursor-pointer transition-colors py-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="">
              <img
                src="/beneficiary.svg"
                alt=""
                className="min-w-[80px] min-h-[80px]"
              />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Manage Customer list
          </h3>
          <p className="text-gray-600 text-sm tracking-wide">
            Add and remove customers
          </p>
        </div>
      </div>
    </>
  );
};
