// netlify/functions/createInvoice.js
import { MongoClient } from "mongodb";

let cachedClient = null;

export async function handler(event) {
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

    // Connect to MongoDB (reusing cached connection for performance)
    if (!cachedClient) {
      cachedClient = new MongoClient(process.env.VITE_MONGO_URI);
      await cachedClient.connect();
    }

    const db = cachedClient.db("invoice_test");
    const invoicesCol = db.collection("invoices");
    const statsCol = db.collection("invoicestats");
    const activitiesCol = db.collection("activities");

    // Get invoice count for ID & number generation
    const invoiceCount = await invoicesCol.countDocuments();

    const newId = String(invoiceCount + 1);
    const invoiceNumber = `${1023494 + invoiceCount} - ${new Date()
      .getFullYear()
      .toString()
      .slice(-2)}${String(new Date().getMonth() + 1).padStart(2, "0")}`;

    // Calculate totals
    const subtotal = invoiceData.items.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );
    const discount = invoiceData.discount || 0;
    const total = subtotal - discount;

    // Get current timestamp
    const now = new Date().toISOString();
    const createdAt = now.split("T")[0];

    // Create invoice object
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

    // Save invoice to MongoDB
    await invoicesCol.insertOne(newInvoice);

    // Update invoice stats (single document that tracks counts)
    const statusCounts = await invoicesCol
      .aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }])
      .toArray();

    const statsUpdate = {
      total: invoiceCount + 1,
      paid: statusCounts.find((s) => s._id === "paid")?.count || 0,
      pending: statusCounts.find((s) => s._id === "pending")?.count || 0,
      overdue: statusCounts.find((s) => s._id === "overdue")?.count || 0,
    };

    await statsCol.updateOne({}, { $set: statsUpdate }, { upsert: true });

    // Add global activity
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

    await activitiesCol.insertOne(newActivity);

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
}
