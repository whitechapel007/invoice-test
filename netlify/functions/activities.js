export async function handler(event, context) {
  const data = await import("../../db.json", { assert: { type: "json" } });
  const activities = data.default.activities;

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
