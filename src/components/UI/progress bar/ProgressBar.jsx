/* eslint-disable react/prop-types */
export default function ProgressBar({ variant, value = 0 }) {
  const barVariant = {
    light: ["bg-progress-light", "bg-primary"],
    dark: ["bg-progress-dark", "bg-white"]
  }

  const normalizedValue = Math.min(100, Math.max(0, Number(value) || 0));

  return (
    <div className={`w-full h-2.5 centerX rounded-lg mt-2 overflow-hidden ${barVariant[variant?.toLowerCase()][0]}`}>
      <div
        className={`h-full rounded-lg ${barVariant[variant?.toLowerCase()][1]}`}
        style={{ width: `${normalizedValue}%` }}
      ></div>
    </div>
  )
}