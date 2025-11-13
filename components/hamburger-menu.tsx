"use client"

import * as React from "react"
import { Menu } from "lucide-react"

interface HamburgerMenuProps {
  onClick: () => void
}

export const HamburgerMenu = React.memo(function HamburgerMenu({ onClick }: HamburgerMenuProps) {
  return (
    <button
      className="icon-button hamburger-button"
      onClick={onClick}
      title="Open menu"
    >
      <Menu className="h-[1.5rem] w-[1.5rem]" />
    </button>
  )
})
