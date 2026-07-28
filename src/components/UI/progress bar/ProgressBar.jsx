/* eslint-disable react/prop-types */
export default function ProgressBar({ variant }) {
  const barVariant = {
    light: ["bg-progress-light", "bg-primary"],
    dark: ["bg-progress-dark", "bg-white"]
  }
  return (
    <div className={`w-full h-2.5 centerX rounded-lg mt-2 overflow-hidden ${barVariant[variant?.toLowerCase()][0]}`}>
      <div className={`w-40 h-full rounded-lg ${barVariant[variant?.toLowerCase()][1]}`}></div>
    </div>
  )
}