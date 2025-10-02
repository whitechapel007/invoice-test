const { readFileSync, writeFileSync } = require("fs");
const { join } = require("path");
const { existsSync } = require("fs");

exports.handler = async function (event) {
  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
      headers: { "Content-Type": "application/json" },
    };
  }

  try {
    // Parse the request body
    const invoiceData = JSON.parse(event.body);

    // Validate required fields
    if (
      !invoiceData.customer ||
      !invoiceData.items ||
      invoiceData.items.length === 0
    ) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Missing required fields: customer and items are required",
        }),
        headers: { "Content-Type": "application/json" },
      };
    }

    // Find the correct path to db.json

    // Try local development path first
    const dbPath = join(__dirname, "db.json");

    // Read current db.json
    const data = JSON.parse(readFileSync(dbPath, "utf-8"));

    // Generate new invoice ID and number
    const newId = String(data.invoices.length + 1);
    const invoiceNumber = `${1023494 + data.invoices.length} - ${new Date()
      .getFullYear()
      .toString()
      .slice(-2)}${String(new Date().getMonth() + 1).padStart(2, "0")}`;

    // Calculate totals
    const subtotal = invoiceData.items.reduce((sum, item) => {
      return sum + item.quantity * item.price;
    }, 0);
    const discount = invoiceData.discount || 0;
    const total = subtotal - discount;

    // Get current timestamp
    const now = new Date().toISOString();
    const createdAt = now.split("T")[0];

    // Create the new invoice
    const newInvoice = {
      id: newId,
      invoiceNumber,
      status: invoiceData.status || "pending",
      dueDate:
        invoiceData.dueDate ||
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
      createdAt,
      total,
      currency: invoiceData.currency || "$",
      subtotal,
      discount,
      activities: [
        {
          id: `act-${Date.now()}`,
          type: "invoice_created",
          message: `Created invoice ${invoiceNumber} / ${invoiceData.customer.name}`,
          timestamp: now,
          invoiceId: invoiceNumber,
          user: invoiceData.createdBy || {
            id: "user-1",
            name: "Admin User",
            email: "admin@example.com",
            avatar: "/avatars/user-1.jpg",
          },
        },
      ],
      customer: {
        id: invoiceData.customer.id || `cust-${Date.now()}`,
        name: invoiceData.customer.name,
        email: invoiceData.customer.email,
        phone: invoiceData.customer.phone || "",
        address: invoiceData.customer.address || "",
      },
      sender: invoiceData.sender || {
        name: "Fabulous Enterprise",
        email: "info@fabulousenterprise.co",
        phone: "+386 989 271 3115",
        address: "1331 Hart Ridge Road 48436 Gaines, MI",
        image: "/sender.svg",
      },
      paymentInfo: invoiceData.paymentInfo || {
        accountName: "Fabulous Enterprise",
        accountNumber: "1234567890",
        routingNumber: "987654321",
        bankName: "Fabulous Bank",
        bankAddress: "123 Bank St, Finance City, FC 12345",
      },
      items: invoiceData.items.map((item, index) => ({
        id: item.id || `item-${Date.now()}-${index}`,
        description: item.description,
        details: item.details || "",
        quantity: item.quantity,
        price: item.price,
        total: item.quantity * item.price,
      })),
    };

    // Add to invoices array
    data.invoices.push(newInvoice);

    // Update invoice stats
    if (data.invoicestats) {
      data.invoicestats.total = data.invoices.length;

      const statusCounts = data.invoices.reduce((acc, inv) => {
        acc[inv.status] = (acc[inv.status] || 0) + 1;
        return acc;
      }, {});

      data.invoicestats.paid = statusCounts.paid || 0;
      data.invoicestats.pending = statusCounts.pending || 0;
      data.invoicestats.overdue = statusCounts.overdue || 0;
    }

    // Create activity entry
    const newActivity = {
      id: `act-${Date.now()}-global`,
      type: "invoice_created",
      message: `Created invoice ${invoiceNumber} / ${invoiceData.customer.name}`,
      timestamp: now,
      invoiceId: invoiceNumber,
      user: invoiceData.createdBy || {
        id: "user-1",
        name: "Admin User",
        email: "admin@example.com",
        avatar: "/avatars/user-1.jpg",
      },
    };

    if (data.activities) {
      data.activities.unshift(newActivity);
    }

    // Write back to db.json
    writeFileSync(dbPath, JSON.stringify(data, null, 2), "utf-8");

    return {
      statusCode: 201,
      body: JSON.stringify({
        message: "Invoice created successfully",
        invoice: newInvoice,
      }),
      headers: { "Content-Type": "application/json" },
    };
  } catch (error) {
    console.error("Error creating invoice:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Failed to create invoice",
        details: error.message,
      }),
      headers: { "Content-Type": "application/json" },
    };
  }
};
