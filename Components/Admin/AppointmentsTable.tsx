"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import {
  ChevronUp,
  ChevronDown,
  Edit,
  Trash2,
  Check,
  X,
  Calendar,
  Clock,
  User,
  StoreIcon,
  Scissors,
  Phone,
  Mail,
} from "lucide-react"

interface AppointmentsTableProps {
  appointments: Appointment[]
  stores: Store[]
  loading: boolean
  sortField: string
  sortOrder: "asc" | "desc"
  onSort: (field: any) => void
  onUpdate: (appointment: Appointment) => void
  onDelete: (id: string) => void
  getAppointmentStatus: (date: string) => string
}

interface EditingAppointment {
  id: string
  field: string
  value: string
}

export function AppointmentsTable({
  appointments,
  stores,
  loading,
  sortField,
  sortOrder,
  onSort,
  onUpdate,
  onDelete,
  getAppointmentStatus,
}: AppointmentsTableProps) {
  const [editing, setEditing] = useState<EditingAppointment | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)
 
  console.log("Apppointments are", appointments)

  const handleEdit = (id: string, field: string, currentValue: string) => {
    setEditing({ id, field, value: currentValue })
  }

  const handleSave = async () => {
    if (!editing) return

    try {
      const { data, error } = await supabase
        .from("appointments")
        .update({ [editing.field]: editing.value })
        .eq("id", editing.id)
        .select()
        .single()

      if (error) throw error

      onUpdate(data)
      setEditing(null)
    } catch (error) {
      console.error("Error updating appointment:", error)
      alert("Failed to update appointment")
    }
  }

  const handleCancel = () => {
    setEditing(null)
  }

  const handleDelete = async (id: string) => {
    setDeleting(id)
    try {
      const { error } = await supabase.from("appointments").delete().eq("id", id)

      if (error) throw error

      onDelete(id)
    } catch (error) {
      console.error("Error deleting appointment:", error)
      alert("Failed to delete appointment")
    } finally {
      setDeleting(null)
    }
  }

const getStatusBadge = (date: string) => {
  const status = getAppointmentStatus(date)

  const baseClasses = "px-2 py-1 rounded-full text-xs font-medium"

  switch (status) {
    case "completed":
      return <span className={`${baseClasses} bg-green-100 text-green-600`}>Completed</span>
    case "today":
      return <span className={`${baseClasses} bg-blue-100 text-blue-600`}>Today</span>
    case "upcoming":
      return <span className={`${baseClasses} bg-yellow-100 text-yellow-600`}>Upcoming</span>
    default:
      return <span className={`${baseClasses} bg-gray-200 text-gray-600`}>Unknown</span>
  }
}

  const getSortIcon = (field: string) => {
    if (sortField !== field) return null
    return sortOrder === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
  }

  const renderEditableCell = (appointment: Appointment, field: keyof Appointment, value: any) => {
    const isEditing = editing?.id === appointment.id && editing?.field === field

 if (isEditing) {
  const commonButtonClass =     "h-6 w-6 p-0 rounded flex items-center justify-center text-white text-xs";

   if (field === "date") {
    return (
      <div className="flex items-center gap-2">
        <input
          type="date"
          value={editing.value}
          onChange={(e) => setEditing({ ...editing, value: e.target.value })}
          className="bg-gray-800 border border-gray-700 text-white text-xs h-8 px-2 rounded"
        />
        <button
          onClick={handleSave}
          className={`${commonButtonClass} bg-green-600 hover:bg-green-700`}
        >
          ✔
        </button>
        <button
          onClick={handleCancel}
          className={`${commonButtonClass} bg-red-600 hover:bg-red-700`}
        >
          ✖
        </button>
      </div>
    );
  }

  if (field === "time") {
    const times = Array.from({ length: 24 }, (_, i) => {
      const hour = i.toString().padStart(2, "0");
      return [`${hour}:00`, `${hour}:30`];
    }).flat();

    return (
      <div className="flex items-center gap-2">
        <select
          value={editing.value}
          onChange={(e) => setEditing({ ...editing, value: e.target.value })}
          className="bg-gray-800 border border-gray-700 text-white text-xs h-8 w-20 rounded"
        >
          {times.map((time) => (
            <option key={time} value={time}>
              {time}
            </option>
          ))}
        </select>
        <button
          onClick={handleSave}
          className={`${commonButtonClass} bg-green-600 hover:bg-green-700`}
        >
          ✔
        </button>
        <button
          onClick={handleCancel}
          className={`${commonButtonClass} bg-red-600 hover:bg-red-700`}
        >
          ✖
        </button>
      </div>
    );
  }

  if (field === "barber") {
    const store = stores.find((s) => s.id === appointment.store_id);

    return (
      <div className="flex items-center gap-2">
        <select
          value={editing.value}
          onChange={(e) => setEditing({ ...editing, value: e.target.value })}
          className="bg-gray-800 border border-gray-700 text-white text-xs h-8 w-32 rounded"
        >
          {store?.barbers?.map((barber) => (
            <option key={barber} value={barber}>
              {barber}
            </option>
          ))}
        </select>
        <button
          onClick={handleSave}
          className={`${commonButtonClass} bg-green-600 hover:bg-green-700`}
        >
          ✔
        </button>
        <button
          onClick={handleCancel}
          className={`${commonButtonClass} bg-red-600 hover:bg-red-700`}
        >
          ✖
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <input
        value={editing.value}
        onChange={(e) => setEditing({ ...editing, value: e.target.value })}
        className="bg-gray-800 border border-gray-700 text-white text-xs h-8 px-2 rounded"
      />
      <button
        onClick={handleSave}
        className={`${commonButtonClass} bg-green-600 hover:bg-green-700`}
      >
        ✔
      </button>
      <button
        onClick={handleCancel}
        className={`${commonButtonClass} bg-red-600 hover:bg-red-700`}
      >
        ✖
      </button>
    </div>
  );
}

    return (
      <div
        className="cursor-pointer hover:bg-gray-800/50 p-1 rounded text-xs"
        onClick={() => handleEdit(appointment.id!, field, String(value))}
      >
        {value}
      </div>
    )
  }

if (loading) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg shadow-md">
      <div className="p-8 text-center">
        <div className="flex items-center justify-center gap-3">
          <div className="w-6 h-6 border-2 border-gray-600 border-t-yellow-400 rounded-full animate-spin" />
          <span className="text-gray-400">Loading appointments...</span>
        </div>
      </div>
    </div>
  );
}


  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
      {/* Desktop View */}
      <div className="hidden md:block">
        <div className="overflow-x-auto">
          <div className="min-w-full">
            {/* Table Header */}
            <div className="border-b border-gray-800">
              <div className="flex bg-gray-900 hover:bg-gray-800/50 text-sm font-medium text-gray-300">
                <div className="w-40 px-4 py-3 flex items-center gap-2 cursor-pointer hover:text-yellow-400" onClick={() => onSort("customer_name")}>
                  <User className="h-4 w-4" />
                  Customer
                  {getSortIcon("customer_name")}
                </div>
                <div className="w-32 px-4 py-3 cursor-pointer flex items-center gap-2 hover:text-yellow-400" onClick={() => onSort("store_name")}>
                  <StoreIcon className="h-4 w-4" />
                  Store
                  {getSortIcon("store_name")}
                </div>
                <div className="w-32 px-4 py-3 cursor-pointer flex items-center gap-2 hover:text-yellow-400" onClick={() => onSort("service_name")}>
                  <Scissors className="h-4 w-4" />
                  Service
                  {getSortIcon("service_name")}
                </div>
                <div className="w-28 px-4 py-3 flex items-center gap-2 cursor-pointer hover:text-yellow-400" onClick={() => onSort("barber")}>
                  <User className="h-4 w-4" />
                  Barber
                  {getSortIcon("barber")}
                </div>
                <div className="w-32 px-4 py-3 flex items-center gap-2 cursor-pointer hover:text-yellow-400" onClick={() => onSort("date")}>
                  <Calendar className="h-4 w-4" />
                  Date
                  {getSortIcon("date")}
                </div>
                <div className="w-24 px-4 py-3 flex items-center gap-2 cursor-pointer hover:text-yellow-400" onClick={() => onSort("time")}>
                  <Clock className="h-4 w-4" />
                  Time
                  {getSortIcon("time")}
                </div>
                <div className="w-20 px-4 py-3">Price</div>
                <div className="w-24 px-4 py-3">Status</div>
                <div className="w-40 px-4 py-3">Contact</div>
                <div className="w-28 px-4 py-3">Actions</div>
              </div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-800">
              {appointments.length === 0 ? (
                <div className="flex">
                  <div className="py-8 text-gray-400 text-center col-span-10">
                    No appointments found
                  </div>
                </div>
              ) : (
                appointments.map((appointment) => (
                  <div key={appointment.id} className="flex hover:bg-gray-800/30 text-sm text-gray-300">
                    <div className="w-40 px-4 py-3 text-white">{renderEditableCell(appointment, "customer_name", appointment.customer_name)}</div>
                    <div className="w-32 px-4 py-3 text-xs">{appointment.store_name}</div>
                    <div className="w-32 px-4 py-3 text-xs">{appointment.service_name}</div>
                    <div className="w-28 px-4 py-3">{renderEditableCell(appointment, "barber", appointment.barber)}</div>
                    <div className="w-32 px-4 py-3">{renderEditableCell(appointment, "date", appointment.date)}</div>
                    <div className="w-24 px-4 py-3">{renderEditableCell(appointment, "time", appointment.time)}</div>
                    <div className="w-20 px-4 py-3 text-xs">€{appointment.service_price}</div>
                    <div className="w-24 px-4 py-3">{getStatusBadge(appointment.date!)}</div>
                    <div className="w-40 px-4 py-3 space-y-1">
                      <div className="flex items-center gap-1 text-xs"><Mail className="h-3 w-3" /><span className="truncate max-w-24">{appointment.customer_email}</span></div>
                      <div className="flex items-center gap-1 text-xs"><Phone className="h-3 w-3" /><span>{appointment.customer_phone}</span></div>
                    </div>
                    <div className="w-28 px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => handleEdit(appointment.id!, "customer_name", appointment.customer_name)} className="h-7 w-7 p-0 border border-gray-700 text-gray-300 hover:bg-gray-800 rounded flex items-center justify-center">
                          <Edit className="h-3 w-3" />
                        </button>
                        <button 
                          onClick={() => handleDelete(appointment.id!)}
                          className="h-7 w-7 p-0 border border-red-700 text-red-400 hover:bg-red-900/20 rounded flex items-center justify-center"
                          disabled={deleting === appointment.id}
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile View */}
      <div className="md:hidden">
        <div className="divide-y divide-gray-800">
          {appointments.length === 0 ? (
            <div className="p-4 text-gray-400 text-center">
              No appointments found
            </div>
          ) : (
            appointments.map((appointment) => (
              <div key={appointment.id} className="p-4 space-y-4">
                {/* Header with Status and Actions */}
                <div className="flex items-center justify-between">
                  <div>{getStatusBadge(appointment.date!)}</div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleEdit(appointment.id!, "customer_name", appointment.customer_name)} 
                      className="h-8 w-8 border border-gray-700 text-gray-300 hover:bg-gray-800 rounded flex items-center justify-center"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(appointment.id!)}
                      className="h-8 w-8 border border-red-700 text-red-400 hover:bg-red-900/20 rounded flex items-center justify-center"
                      disabled={deleting === appointment.id}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-white">
                    <User className="h-4 w-4 text-gray-400" />
                    <div className="font-medium">{renderEditableCell(appointment, "customer_name", appointment.customer_name)}</div>
                  </div>
                  <div className="flex flex-col gap-1 text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                      <Mail className="h-3 w-3" />
                      <span className="truncate">{appointment.customer_email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-3 w-3" />
                      <span>{appointment.customer_phone}</span>
                    </div>
                  </div>
                </div>

                {/* Appointment Details */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="space-y-1">
                    <div className="text-gray-400 flex items-center gap-1">
                      <StoreIcon className="h-3 w-3" />
                      Store
                    </div>
                    <div>{appointment.store_name}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-gray-400 flex items-center gap-1">
                      <Scissors className="h-3 w-3" />
                      Service
                    </div>
                    <div>{appointment.service_name}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-gray-400 flex items-center gap-1">
                      <User className="h-3 w-3" />
                      Barber
                    </div>
                    <div>{renderEditableCell(appointment, "barber", appointment.barber)}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-gray-400">Price</div>
                    <div>€{appointment.service_price}</div>
                  </div>
                </div>

                {/* Date and Time */}
                <div className="flex items-center justify-between text-sm pt-2 border-t border-gray-800">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <div>{renderEditableCell(appointment, "date", appointment.date)}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <div>{renderEditableCell(appointment, "time", appointment.time)}</div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
