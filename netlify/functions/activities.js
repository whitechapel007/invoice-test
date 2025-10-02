// netlify/functions/getActivities.js
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
    const activitiesCol = db.collection("activities");

    const { id } = event.queryStringParameters || {};

    if (id) {
      // Try to find by ObjectId OR by string id (since your old db.json had custom IDs)
      let query = { id: id }; // match custom id field
      if (ObjectId.isValid(id)) {
        query = { $or: [{ id: id }, { _id: new ObjectId(id) }] };
      }

      const activity = await activitiesCol.findOne(query);

      return {
        statusCode: activity ? 200 : 404,
        body: JSON.stringify(activity || { error: "Activity not found" }),
        headers: { "Content-Type": "application/json" },
      };
    }

    // No id → return all activities (you can add pagination later)
    const activities = await activitiesCol
      .find()
      .sort({ timestamp: -1 })
      .toArray();

    return {
      statusCode: 200,
      body: JSON.stringify(activities),
      headers: { "Content-Type": "application/json" },
    };
  } catch (error) {
    console.error("Error fetching activities:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Failed to fetch activities",
        details: error.message,
      }),
      headers: { "Content-Type": "application/json" },
    };
  }
}
