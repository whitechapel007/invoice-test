import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X, Plus, Trash2 } from "lucide-react";
import Button from "../common/Button";
import apiClient from "../../services/api/axios";

interface CreateInvoiceModalProps {
  openModal: boolean;
  onClose: () => void;
}

interface InvoiceItem {
  description: string;
  details: string;
  quantity: number;
  price: number;
}

interface InvoiceFormData {
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

const CreateInvoiceModal = ({
  openModal,
  onClose,
}: CreateInvoiceModalProps) => {
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<InvoiceFormData>({
    customer: {
      name: "",
      email: "",
      phone: "",
      address: "",
    },
    items: [
      {
        description: "",
        details: "",
        quantity: 1,
        price: 0,
      },
    ],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    status: "pending",
    currency: "$",
    discount: 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Mutation for creating invoice
  const createInvoiceMutation = useMutation({
    mutationFn: async (invoiceData: InvoiceFormData) => {
      const response = await apiClient.post("/createInvoice", invoiceData);

      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch invoices
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["invoicestats"] });
      queryClient.invalidateQueries({ queryKey: ["activities"] });

      // Reset form and close modal
      resetForm();
      onClose();
    },
    onError: (error: Error) => {
      setErrors({ submit: error.message });
    },
  });

  const resetForm = () => {
    setFormData({
      customer: {
        name: "",
        email: "",
        phone: "",
        address: "",
      },
      items: [
        {
          description: "",
          details: "",
          quantity: 1,
          price: 0,
        },
      ],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      status: "pending",
      currency: "$",
      discount: 0,
    });
    setErrors({});
  };

  const handleCustomerChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      customer: {
        ...prev.customer,
        [field]: value,
      },
    }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleItemChange = (
    index: number,
    field: string,
    value: string | number
  ) => {
    const newItems = [...formData.items];
    newItems[index] = {
      ...newItems[index],
      [field]: value,
    };
    setFormData((prev) => ({ ...prev, items: newItems }));
  };

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          description: "",
          details: "",
          quantity: 1,
          price: 0,
        },
      ],
    }));
  };

  const removeItem = (index: number) => {
    if (formData.items.length > 1) {
      setFormData((prev) => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index),
      }));
    }
  };

  const calculateSubtotal = () => {
    return formData.items.reduce((sum, item) => {
      return sum + item.quantity * item.price;
    }, 0);
  };

  const calculateTotal = () => {
    return calculateSubtotal() - formData.discount;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.customer.name.trim()) {
      newErrors.name = "Customer name is required";
    }
    if (!formData.customer.email.trim()) {
      newErrors.email = "Customer email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customer.email)) {
      newErrors.email = "Invalid email format";
    }

    formData.items.forEach((item, index) => {
      if (!item.description.trim()) {
        newErrors[`item_${index}_description`] = "Description is required";
      }
      if (item.quantity <= 0) {
        newErrors[`item_${index}_quantity`] = "Quantity must be greater than 0";
      }
      if (item.price <= 0) {
        newErrors[`item_${index}_price`] = "Price must be greater than 0";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      createInvoiceMutation.mutate(formData);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  if (!openModal) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4">
      <button
        onClick={onClose}
        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors bg-white absolute top-2 md:right-5 2xl:right-42 right-0 p-2 z-50"
        aria-label="Close"
      >
        <X className="size-5" />
      </button>

      <div className="relative w-full max-w-6xl max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-3 py-3 md:px-8 md:py-6 border-b border-gray-200">
          <div>
            <h1 className="md:text-3xl font-bold text-black">
              Create New Invoice
            </h1>
            <p className="text-sm text-gray-100 mt-1">
              Fill in the details to generate a new invoice
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-6 space-y-6">
            {/* Customer Information */}
            <div className=" rounded-2xl p-6">
              <h3 className="text-xs font-semibold text-black/50 uppercase mb-4 ">
                CUSTOMER INFORMATION
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-black/50 mb-2">
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    value={formData.customer.name}
                    onChange={(e) =>
                      handleCustomerChange("name", e.target.value)
                    }
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.name ? "border-red-500" : "border-gray-100"
                    }`}
                    placeholder="Enter customer name"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-black/50 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={formData.customer.email}
                    onChange={(e) =>
                      handleCustomerChange("email", e.target.value)
                    }
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.email ? "border-red-500" : "border-gray-100"
                    }`}
                    placeholder="customer@example.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-black/50 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.customer.phone}
                    onChange={(e) =>
                      handleCustomerChange("phone", e.target.value)
                    }
                    className="w-full px-4 py-2.5 border border-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+1 234 567 8900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black/50 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    value={formData.customer.address}
                    onChange={(e) =>
                      handleCustomerChange("address", e.target.value)
                    }
                    className="w-full px-4 py-2.5 border border-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Customer address"
                  />
                </div>
              </div>
            </div>

            {/* Invoice Details */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-stroke">
              <h3 className="text-xs font-semibold text-gray-500 uppercase mb-4">
                INVOICE DETAILS
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-black/50 mb-2">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        dueDate: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2.5 border border-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black/50 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        status: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2.5 border border-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="overdue">Overdue</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black/50 mb-2">
                    Discount ($)
                  </label>
                  <input
                    type="number"
                    value={formData.discount}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        discount: parseFloat(e.target.value) || 0,
                      }))
                    }
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2.5 border border-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>

            {/* Items */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Items</h3>
                <Button
                  type="button"
                  onClick={addItem}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                >
                  <Plus className="size-4" />
                  Add Item
                </Button>
              </div>

              <div className="space-y-4">
                {formData.items.map((item, index) => (
                  <div
                    key={index}
                    className="bg-slate-50 rounded-xl p-4 border border-gray-200"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <h4 className="font-medium text-black/50">
                        Item {index + 1}
                      </h4>
                      {formData.items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-black/50 mb-2">
                          Description *
                        </label>
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) =>
                            handleItemChange(
                              index,
                              "description",
                              e.target.value
                            )
                          }
                          className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors[`item_${index}_description`]
                              ? "border-red-500"
                              : "border-gray-100"
                          }`}
                          placeholder="e.g., Website Design"
                        />
                        {errors[`item_${index}_description`] && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors[`item_${index}_description`]}
                          </p>
                        )}
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-black/50 mb-2">
                          Details
                        </label>
                        <textarea
                          value={item.details}
                          onChange={(e) =>
                            handleItemChange(index, "details", e.target.value)
                          }
                          rows={2}
                          className="w-full px-4 py-2.5 border border-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Additional details about the item"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-black/50 mb-2">
                          Quantity *
                        </label>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            handleItemChange(
                              index,
                              "quantity",
                              parseInt(e.target.value) || 0
                            )
                          }
                          min="1"
                          className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors[`item_${index}_quantity`]
                              ? "border-red-500"
                              : "border-gray-100"
                          }`}
                        />
                        {errors[`item_${index}_quantity`] && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors[`item_${index}_quantity`]}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-black/50 mb-2">
                          Price ($) *
                        </label>
                        <input
                          type="number"
                          value={item.price}
                          onChange={(e) =>
                            handleItemChange(
                              index,
                              "price",
                              parseFloat(e.target.value) || 0
                            )
                          }
                          min="0"
                          step="0.01"
                          className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors[`item_${index}_price`]
                              ? "border-red-500"
                              : "border-gray-100"
                          }`}
                        />
                        {errors[`item_${index}_price`] && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors[`item_${index}_price`]}
                          </p>
                        )}
                      </div>

                      <div className="md:col-span-2 flex justify-between items-center pt-2 border-t border-gray-300">
                        <span className="text-sm font-medium text-black/50">
                          Item Total
                        </span>
                        <span className="text-lg font-bold text-gray-900">
                          {formatCurrency(item.quantity * item.price)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="mt-6 bg-slate-100 rounded-xl p-6 border border-stroke md:w-2/3 md:ml-auto">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 uppercase text-xs">
                      Subtotal
                    </span>
                    <span className="font-semibold text-gray-900 text-sm md:text-base">
                      {formatCurrency(calculateSubtotal())}
                    </span>
                  </div>
                  {formData.discount > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 uppercase text-xs">
                        Discount
                      </span>
                      <span className="font-semibold text-gray-900">
                        {formatCurrency(formData.discount)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                    <span className="text-base md:text-sm font-semibold text-gray-900 uppercase">
                      Total Amount Due
                    </span>
                    <span className="text-xl md:text-2xl font-bold text-gray-900">
                      {formatCurrency(calculateTotal())}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600 text-sm">{errors.submit}</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 md:px-8 py-4 border-t border-gray-200 flex justify-end gap-3 bg-slate-50">
            <Button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-sm font-medium text-black/70 bg-white border border-stroke hover:bg-gray-50 rounded-full transition-colors"
            >
              Cancel
            </Button>
            <button
              type="submit"
              disabled={createInvoiceMutation.isPending}
              className="px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createInvoiceMutation.isPending
                ? "Creating..."
                : "Create Invoice"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateInvoiceModal;
