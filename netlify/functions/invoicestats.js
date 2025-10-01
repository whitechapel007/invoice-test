export async function handler() {
  const data = require("./db.json");
  const stats = data.invoicestats;

  return {
    statusCode: 200,
    body: JSON.stringify(stats),
  };
}
