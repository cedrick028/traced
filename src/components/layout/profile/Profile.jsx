import { User } from "lucide-react";
import useAuth from "../../../hooks/useAuth";

export default function Profile() {
  const { displayName } = useAuth();
  return (
    <div className="centerX gap-3">
      <div className="w-14 h-14 centerXY rounded-full bg-surface">
        <User size={30} />
      </div>
      <div>
        <p>{ displayName }</p>
        <p className="text-xs text-muted">View profile</p>
      </div>
    </div>
  )
}