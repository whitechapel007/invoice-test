export async function handler(event) {
  // import your db.json
  const data = require("./db.json");
  const invoices = data.invoices;

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
