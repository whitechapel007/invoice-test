// netlify/functions/getInvoiceStats.js
import { MongoClient } from "mongodb";

let cachedClient = null;

export async function handler() {
  try {
    // Connect to MongoDB (reuse cached client if available)
    if (!cachedClient) {
      cachedClient = new MongoClient(process.env.VITE_MONGO_URI);
      await cachedClient.connect();
    }

    const db = cachedClient.db("invoice_test"); // change to your DB name
    const statsCol = db.collection("invoicestats");

    // We store stats as a single document, so just grab the first one
    const stats = await statsCol.findOne({});

    return {
      statusCode: 200,
      body: JSON.stringify(
        stats || {
          totalPaid: 1289,
          totalOverdue: 3000,
          totalDraft: 1500,
          totalUnpaid: 4500,
          countPaid: 1289,
          countOverdue: 6,
          countDraft: 3,
          countUnpaid: 9,
          total: 4,
          paid: 1,
          pending: 2,
          overdue: 0,
        }
      ),
      headers: { "Content-Type": "application/json" },
    };
  } catch (error) {
    console.error("Error fetching invoice stats:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Failed to fetch invoice stats",
        details: error.message,
      }),
      headers: { "Content-Type": "application/json" },
    };
  }
}
