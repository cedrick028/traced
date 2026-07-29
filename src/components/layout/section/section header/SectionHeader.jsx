import { Link } from "react-router-dom";

/* eslint-disable react/prop-types */
export default function SectionHeader({ sectionTitle, path }) {
  return (
    <div className="centerX justify-between">
      <p className="font-bold">{ sectionTitle }</p>
      <Link to={path} className="text-muted">View all</Link>
    </div>
  )
}