/* eslint-disable react/prop-types */
export default function SectionHeader({ sectionTitle }) {
  return (
    <div className="centerX justify-between">
      <p className="font-bold">{ sectionTitle }</p>
      <p className="text-muted">View all</p>
    </div>
  )
}