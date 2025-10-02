import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.VITE_MONGO_URI);

export async function handler() {
  try {
    await client.connect();
    const db = client.db("invoice_test");
    const invoices = db.collection("invoices");

    // Fetch all invoices
    const allInvoices = await invoices.find().toArray();

    // Calculate totals
    let totalPaid = 0,
      totalOverdue = 0,
      totalDraft = 0,
      totalUnpaid = 0;
    let countPaid = 0,
      countOverdue = 0,
      countDraft = 0,
      countUnpaid = 0;

    allInvoices.forEach((inv) => {
      switch (inv.status) {
        case "paid":
          totalPaid += inv.amount;
          countPaid++;
          break;
        case "overdue":
          totalOverdue += inv.amount;
          countOverdue++;
          break;
        case "draft":
          totalDraft += inv.amount;
          countDraft++;
          break;
        case "unpaid":
          totalUnpaid += inv.amount;
          countUnpaid++;
          break;
      }
    });

    const stats = {
      totalPaid,
      totalOverdue,
      totalDraft,
      totalUnpaid,
      countPaid,
      countOverdue,
      countDraft,
      countUnpaid,
      total: allInvoices.length,
      paid: countPaid,
      pending: countDraft + countUnpaid, // or however you define pending
      overdue: countOverdue,
    };

    return {
      statusCode: 200,
      body: JSON.stringify(stats),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  } finally {
    await client.close();
  }
}
