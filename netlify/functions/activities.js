export async function handler(event) {
  const data = require("../../db.json");

  const activities = data.activities;

  const { id } = event.queryStringParameters;

  if (id) {
    const activity = activities.find((a) => String(a.id) === id);
    return {
      statusCode: activity ? 200 : 404,
      body: JSON.stringify(activity || { error: "Activity not found" }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(activities),
  };
}
