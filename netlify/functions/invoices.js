export async function handler(event, context) {
  // import your db.json
  const data = await import("../../db.json", { assert: { type: "json" } });
  const invoices = data.default.invoices; // assuming db.json has { "invoices": [...] }

  // optional: filter by id
  const { id } = event.queryStringParameters;
  if (id) {
    const invoice = invoices.find((inv) => String(inv.id) === id);
    return {
      statusCode: invoice ? 200 : 404,
      body: JSON.stringify(invoice || { error: "Not found" }),
    };
  }

  // return all
  return {
    statusCode: 200,
    body: JSON.stringify(invoices),
  };
}
