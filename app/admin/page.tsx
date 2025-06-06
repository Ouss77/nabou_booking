"use client"
import React, { useState } from 'react'
import AdminSidebar from '@/Components/Admin/AdminSidebar'
import { PlusIcon, StoreIcon, UsersIcon, ScissorsIcon, MenuIcon, XIcon } from 'lucide-react'
import Link from 'next/link'

export default function AdminDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen relative">
      {/* Mobile Sidebar Toggle */}
      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700"
      >
        {isSidebarOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:relative z-40 transition-transform duration-300 ease-in-out`}>
        <AdminSidebar active="Dashboard" />
      </div>

      {/* Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-10 bg-gray-900 min-h-screen">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 mt-12 lg:mt-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-sm sm:text-base text-gray-400 mt-1">
              Manage your barbershop stores and services
            </p>
          </div>

          <Link
            href="/admin/stores/new"
            className="mt-4 sm:mt-0 w-full sm:w-auto flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-gray-900 font-medium py-2 px-4 rounded-lg transition-colors"
          >
            <PlusIcon className="w-5 h-5" />
            Add Store
          </Link>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-gray-800 p-4 sm:p-6 rounded-xl shadow-md flex items-center gap-3 sm:gap-4 border border-gray-700 hover:border-amber-500 transition-colors">
            <div className="p-2 bg-gray-700 rounded-lg shrink-0">
              <StoreIcon className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-300">Total Stores</h3>
              <p className="text-xl sm:text-2xl font-bold text-white">12</p>
            </div>
          </div>

          <div className="bg-gray-800 p-4 sm:p-6 rounded-xl shadow-md flex items-center gap-3 sm:gap-4 border border-gray-700 hover:border-amber-500 transition-colors">
            <div className="p-2 bg-gray-700 rounded-lg shrink-0">
              <UsersIcon className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-300">Total Customers</h3>
              <p className="text-xl sm:text-2xl font-bold text-white">340</p>
            </div>
          </div>

          <div className="bg-gray-800 p-4 sm:p-6 rounded-xl shadow-md flex items-center gap-3 sm:gap-4 border border-gray-700 hover:border-amber-500 transition-colors">
            <div className="p-2 bg-gray-700 rounded-lg shrink-0">
              <ScissorsIcon className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-300">Total Barbers</h3>
              <p className="text-xl sm:text-2xl font-bold text-white">27</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}