// netlify/functions/getInvoices.js
import { MongoClient, ObjectId } from "mongodb";

let cachedClient = null;

export async function handler(event) {
  try {
    // Connect to MongoDB (reuse cached client if available)
    if (!cachedClient) {
      cachedClient = new MongoClient(process.env.VITE_MONGO_URI);
      await cachedClient.connect();
    }

    const db = cachedClient.db("invoice_test"); // change to your DB name
    const invoicesCol = db.collection("invoices");

    const { id } = event.queryStringParameters || {};

    if (id) {
      // Try to match by your custom invoice.id OR MongoDB _id
      let query = { id: id };
      if (ObjectId.isValid(id)) {
        query = { $or: [{ id: id }, { _id: new ObjectId(id) }] };
      }

      const invoice = await invoicesCol.findOne(query);

      return {
        statusCode: invoice ? 200 : 404,
        body: JSON.stringify(invoice || { error: "Not found" }),
        headers: { "Content-Type": "application/json" },
      };
    }

    // No id → return all invoices
    const invoices = await invoicesCol.find().sort({ createdAt: -1 }).toArray();

    return {
      statusCode: 200,
      body: JSON.stringify(invoices),
      headers: { "Content-Type": "application/json" },
    };
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Failed to fetch invoices",
        details: error.message,
      }),
      headers: { "Content-Type": "application/json" },
    };
  }
}
