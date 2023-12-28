export function formatIndianCurrency(amount) {
  const formattedAmount = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);

  return formattedAmount || "-";
}
