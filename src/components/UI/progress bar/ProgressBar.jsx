/* eslint-disable react/prop-types */
export default function ProgressBar({ variant, value = 0 }) {
  const barVariant = {
    light: ["bg-progress-light", "bg-primary"],
    dark: ["bg-progress-dark", "bg-white"]
  }

  const numericValue = Math.min(100, Math.max(0, Number(value) || 0));
  const normalizedValue = numericValue > 0 && numericValue < 1 ? 1.5 : numericValue;

  return (
    <div className={`w-full h-2.5 centerX rounded-lg mt-2 overflow-hidden ${barVariant[variant?.toLowerCase()][0]}`}>
      <div
        className={`h-full rounded-lg ${barVariant[variant?.toLowerCase()][1]}`}
        style={{ width: `${normalizedValue}%` }}
      ></div>
    </div>
  )
}