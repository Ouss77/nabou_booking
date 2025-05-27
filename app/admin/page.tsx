import React from 'react'
import AdminSidebar from '@/Components/Admin/AdminSidebar'
import { PlusIcon, StoreIcon, UsersIcon, ScissorsIcon } from 'lucide-react'
import Link from 'next/link'

export default function AdminDashboard() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <AdminSidebar active="Dashboard" />

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 bg-gray-900">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-gray-400 mt-1">
              Manage your barbershop stores and services
            </p>
          </div>

          <Link
            href="/admin/stores/new"
            className="mt-4 md:mt-0 flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-gray-900 font-medium py-2 px-4 rounded-lg transition-colors"
          >
            <PlusIcon className="w-5 h-5" />
            Add Store
          </Link>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gray-800 p-6 rounded-xl shadow-md flex items-center gap-4 border border-gray-700 hover:border-amber-500 transition-colors">
            <div className="p-2 bg-gray-700 rounded-lg">
              <StoreIcon className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-300">Total Stores</h3>
              <p className="text-2xl font-bold text-white">12</p>
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl shadow-md flex items-center gap-4 border border-gray-700 hover:border-amber-500 transition-colors">
            <div className="p-2 bg-gray-700 rounded-lg">
              <UsersIcon className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-300">Total Customers</h3>
              <p className="text-2xl font-bold text-white">340</p>
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl shadow-md flex items-center gap-4 border border-gray-700 hover:border-amber-500 transition-colors">
            <div className="p-2 bg-gray-700 rounded-lg">
              <ScissorsIcon className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-300">Total Barbers</h3>
              <p className="text-2xl font-bold text-white">27</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
