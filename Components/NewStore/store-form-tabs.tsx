"use client"

import type React from "react"

import { FaStore, FaUpload, FaUsers, FaCut } from "react-icons/fa"

interface TabItem {
  id: string
  label: string
  icon: React.ReactNode
}

interface StoreFormTabsProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export default function StoreFormTabs({ activeTab, setActiveTab }: StoreFormTabsProps) {
  const tabs: TabItem[] = [
    { id: "basic", label: "Basic Info", icon: <FaStore /> },
    { id: "images", label: "Images", icon: <FaUpload /> },
    { id: "team", label: "Team", icon: <FaUsers /> },
    { id: "services", label: "Services", icon: <FaCut /> },
  ]

  return (
    <div className="grid grid-cols-4 mb-8 border border-zinc-800 rounded-lg overflow-hidden">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className={`py-3 px-2 text-center flex flex-col sm:flex-row items-center justify-center sm:justify-start sm:space-x-2 transition-colors ${
            activeTab === tab.id
              ? "bg-amber-500 text-zinc-950 font-medium"
              : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
          }`}
          onClick={() => setActiveTab(tab.id)}
          aria-selected={activeTab === tab.id}
          role="tab"
        >
          <span className="text-[1rem] sm:text-base">{tab.icon}</span>
          <span className="text-xs sm:text-sm mt-1 sm:mt-0">{tab.label}</span>
        </button>
      ))}
    </div>
  )
}
