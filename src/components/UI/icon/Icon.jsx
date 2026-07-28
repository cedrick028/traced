/* eslint-disable react/prop-types */
export default function Icon({ icon: Icon, variant }) {
  const iconVariant = {
    primary: "bg-surface",
    light: "bg-white",
    dark: "bg-primary text-white"
  }

  return (
    <div className={`w-9 h-9 centerXY rounded-lg ${iconVariant[variant?.toLowerCase()]}`}>
      <Icon size={22} />
    </div>
  )
}