export async function handler(event, context) {
  const data = await import("../../db.json", { assert: { type: "json" } });
  const stats = data.default.invoicestats;

  return {
    statusCode: 200,
    body: JSON.stringify(stats),
  };
}
