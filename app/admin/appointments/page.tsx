"use client"

import { useState, useEffect } from "react"
import AdminSidebar from "@/Components/Admin/AdminSidebar"
import { supabase } from "@/lib/supabaseClient"
import { AppointmentsTable } from "@/Components/Admin/AppointmentsTable"
import { Search, Filter, Plus, RefreshCw, AlertCircle } from "lucide-react"
import {AddAppointmentModal} from "@/Components/Admin/AddAppointmentModal"
import {filteredAndSortedAppointments, getAllBarbers, handleSort, handleAppointmentUpdate, handleAppointmentDelete, getAppointmentStatus, getAppointmentsAndStores} from "@/utils/appointmentsAdminUtils"

type SortField = "date" | "time" | "customer_name" | "store_name" | "service_name" | "barber" | "created_at"
type SortOrder = "asc" | "desc"

interface Filters {
  search: string
  status: string
  store: string
  barber: string
  dateFrom: string
  dateTo: string 
}
interface Appointment {
  id: string
  customer_name: string
  customer_email: string
  customer_phone: string
  store_name?: string
  service_name: string
  barber: string
  store_id: string
  date: string
  created_at: string
  // ...any other fields
}

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [stores, setStores] = useState<Store[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [sortField, setSortField] = useState<SortField>("created_at")
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc")
  const [filters, setFilters] = useState<Filters>({
    search: "",
    status: "all",
    store: "all",
    barber: "all",
    dateFrom: "",
    dateTo: "",
  })

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const { appointments, stores } = await getAppointmentsAndStores()
      console.log("Fetched appointments:", appointments, "Fetched stores:", stores)
      setAppointments(appointments)
      setStores(stores)
    } catch (err) {
      console.error(err)
      setError("Failed to load.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
  fetchData()
}, [])


  const filteredAppointments = filteredAndSortedAppointments(appointments, filters, sortField, sortOrder)
  const activeFiltersCount = Object.values(filters).filter((value) => value && value !== "all").length

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      <h1>heeeeeeeeey</h1>
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-10 w-64">
        <AdminSidebar active={"appointments"} />
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-40 p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">Appointments Management</h1>
            <p className="text-gray-400 text-sm md:text-lg">View, edit, and manage all appointments</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchData}
              className="border border-gray-700 text-gray-300 hover:bg-gray-800 px-3 py-2 rounded text-sm"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-4 py-2 rounded flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Add Appointment</span>
              <span className="sm:hidden">Add</span>
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-900/20 border border-red-800 text-red-400 px-4 py-3 mb-6 rounded flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}

        {/* Filters */}
        <div className="bg-gray-900 border border-gray-800 rounded mb-6">
          <div className="p-4 border-b border-gray-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-yellow-400 font-semibold flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </h2>
            {activeFiltersCount > 0 && (
              <div className="flex items-center gap-2">
                <span className="bg-yellow-400/10 text-yellow-400 px-2 py-1 text-sm rounded">
                  {activeFiltersCount} active
                </span>
                <button
                  onClick={clearFilters}
                  className="border border-gray-700 text-gray-300 hover:bg-gray-800 px-3 py-2 text-sm rounded"
                >
                  Clear All
                </button>
              </div>
            )}
          </div>
          <div className="p-4  flex grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {/* Search */}
            <div className=" relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search appointments..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="pl-10 py-2 rounded bg-gray-800 border border-gray-700 text-white placeholder-gray-400 "
              />
            </div>

            {/* Status Filter */}
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              className="bg-gray-800 border border-gray-700 text-white rounded px-3 py-2"
            >
              <option value="all">All Status</option>
              <option value="upcoming">Upcoming</option>
              <option value="today">Today</option>
              <option value="completed">Completed</option>
            </select>

            {/* Store Filter */}
            <select
              value={filters.store}
              onChange={(e) => handleFilterChange("store", e.target.value)}
              className="bg-gray-800 border border-gray-700 text-white rounded px-3 py-2"
            >
              <option value="all">All Stores</option>
              {stores.map((store) => (
                <option key={store.id} value={store.id}>
                  {store.title}
                </option>
              ))}
            </select>

            {/* Barber Filter */}
            <select
              value={filters.barber}
              onChange={(e) => handleFilterChange("barber", e.target.value)}
              className="bg-gray-800 border border-gray-700 text-white rounded px-3 py-2"
            >
              <option value="all">All Barbers</option>
              {getAllBarbers(stores).map((barber:any) => (
                <option key={barber} value={barber}>
                  {barber}
                </option>
              ))}
            </select>

            {/* Date Range */}
            <div className="flex gap-2">
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
                className="bg-gray-800 border border-gray-700 text-white rounded px-3 py-2"
              />
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => handleFilterChange("dateTo", e.target.value)}
                className="bg-gray-800 border border-gray-700 text-white rounded px-3 py-2"
              />
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
          <div className="flex items-center gap-4">
            <span className="bg-yellow-400/10 text-yellow-400 px-2 py-1 text-sm rounded">
              {filteredAppointments.length} appointments
            </span>
            {loading && (
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <div className="w-4 h-4 border-2 border-gray-600 border-t-yellow-400 rounded-full animate-spin" />
                Loading...
              </div>
            )}
          </div>
          <div className="text-sm text-gray-400">
            Sorted by {sortField.replace("_", " ")} ({sortOrder === "asc" ? "ascending" : "descending"})
          </div>
        </div>

        {/* Appointments Table */}
         <AppointmentsTable
        //  appointments={filteredAppointments}
          appointments={appointments}
          stores={stores}
          loading={loading}
          sortField={sortField}
          sortOrder={sortOrder}
          onSort={handleSort}
          onUpdate={handleAppointmentUpdate}
          onDelete={handleAppointmentDelete}
          getAppointmentStatus={getAppointmentStatus}
        /> 

        {/* Add Appointment Modal
        <AddAppointmentModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          stores={stores}
          onAdd={handleAppointmentAdd}
        /> */}
      </div>
    </div>
  )
}