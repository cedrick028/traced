export const formatCurrency = (value) => {
  const normalizedValue = Number(value ?? 0);

  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(Number.isFinite(normalizedValue) ? normalizedValue : 0);
}
