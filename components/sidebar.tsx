"use client"

import * as React from "react"
import { X } from "lucide-react"
import { ThemeToggle } from "./theme-toggle"

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Overlay */}
      <div
        className={`sidebar-overlay ${isOpen ? "active" : ""}`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <h2>Settings</h2>
          <button
            className="sidebar-close-button"
            onClick={onClose}
            title="Close sidebar"
          >
            <X className="h-[1.5rem] w-[1.5rem]" />
          </button>
        </div>

        <div className="sidebar-body">
          <div className="sidebar-section">
            <h3 className="sidebar-section-title">Appearance</h3>
            <div className="sidebar-item">
              <span className="sidebar-item-label">Theme</span>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
