import { useState } from "react";

export default function useNav() {
  const [isNavOpen, setIsNavOpen] = useState(false)

  const openNav = () => {
    setIsNavOpen(true)
  }

  const closeNav = () => {
    setIsNavOpen(false)
  }

  return {
    isNavOpen,
    openNav,
    closeNav
  }
}