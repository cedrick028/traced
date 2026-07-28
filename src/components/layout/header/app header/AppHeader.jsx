/* eslint-disable react/prop-types */
import { Menu, User } from "lucide-react";
import Logo from "../../logo/Logo";

export default function AppHeader({ openNav }) {
  return (
    <div className="centerX justify-between px-4 py-2 border-b">
      <Menu onClick={openNav} />
      <Logo />
      <User />
    </div>
  )
}