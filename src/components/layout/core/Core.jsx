import { Outlet } from "react-router-dom";
import AppHeader from "../header/app header/AppHeader";
import useNav from "../../../hooks/useNav";
import Nav from "../nav/Nav";

export default function Core() {
  const { isNavOpen, closeNav, openNav } = useNav();

  return(
    <div>
      {
        isNavOpen && (
          <Nav closeNav={closeNav} />
        )
      }
      <AppHeader openNav={openNav} />
      <Outlet />
    </div>
  )
}