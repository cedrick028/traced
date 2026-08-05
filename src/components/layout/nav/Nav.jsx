/* eslint-disable react/prop-types */
import { ChevronRight, X } from "lucide-react";
import { navConfig } from "../../../config/navConfig";
import { NavLink, useNavigate } from "react-router-dom";
import Button from "../../UI/button/Button";
import useAuth from "../../../hooks/useAuth";

export default function Nav({ closeNav }) {
  const { signOut, isSignOutLoading } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    closeNav();
    navigate("/", { replace: true });
  }

  return (
    <div className="inset-0 fixed bg-gray-200/50 backdrop-blur-[2px]" onClick={closeNav}>
      <div className="w-8/12 h-screen flex flex-col justify-between bg-white p-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex flex-col gap-6">
          <X onClick={closeNav} />
          <div className="border rounded-xl divide-y mt-2">
            {
              navConfig.map((nav) => (
                <NavLink to={nav.to} key={nav.id} className="centerX justify-between p-4" onClick={closeNav}>
                  <div className="centerX gap-3">
                    <nav.icon size={16} />
                    <p className="text-[13px] mt-0.5">{ nav.label }</p>
                  </div>
                  <ChevronRight size={16} />
                </NavLink>
              ))
            }
          </div>
        </div>
        
        <Button
          label={isSignOutLoading ? "Signing Out..." : "Sign Out"}
          variant="secondary"
          onClick={handleSignOut}
          loading={isSignOutLoading}
        />
      </div>
    </div>
  )
}