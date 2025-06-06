'use client'
import React from 'react'
import Link from 'next/link'
import {
  CalendarIcon,
  LayoutDashboardIcon, 
  ScissorsIcon,
  SettingsIcon,
  StoreIcon, 
  UsersIcon
} from 'lucide-react'

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboardIcon },
  { label: 'Stores', href: '/admin/stores', icon: StoreIcon },
  { label: 'Appointments', href: '/admin/appointments', icon: CalendarIcon },
  { label: 'Barbers', href: '/barbers', icon: UsersIcon },
  { label: 'Services', href: '/services', icon: ScissorsIcon },
  { label: 'Settings', href: '/settings', icon: SettingsIcon },
]

export default function AdminSidebar({ active }: { active: string }) {
  return (
    <aside className="w-64 bg-black text-white min-h-screen py-6 px-4">
      <div className="flex items-center gap-2 mb-8 px-2">
        <div className="p-2 bg-amber-500 rounded-full">
          <ScissorsIcon className="w-5 h-5 text-black" />
        </div>
        <span className="text-lg font-semibold">Admin Panel</span>
      </div>

      <nav className="text-sm">
        <p className="text-gray-400 uppercase text-xs mb-3 px-2">Navigation</p>
        <ul className="space-y-1">
          {navItems.map(({ label, href, icon: Icon }) => (
            <li key={label}>
              <Link
                href={href}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  active === label
                    ? 'bg-amber-500 text-black'
                    : 'hover:bg-gray-800 text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}
