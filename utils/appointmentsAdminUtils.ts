// Define or import these types accordingly
import { supabase } from "@/lib/supabaseClient"

export interface Store {
  id: string
  title: string
  barbers?: string[]
}

export interface Appointment {
  id: string
  customer_name: string
  customer_email: string
  customer_phone: string
  store_name?: string
  service_name: string
  barber: string
  store_id: string
  date: string
  time?: string
  created_at: string
}

export type SortField = keyof Pick<Appointment, "date" | "time" | "customer_name" | "store_name" | "service_name" | "barber" | "created_at">

export interface Filters {
  search: string
  status: string
  store: string
  barber: string
  dateFrom: string
  dateTo: string
}

export function getAllBarbers(stores: Store[]): string[] {
  const barbers = new Set<string>()
  stores.forEach((store) => {
    store.barbers?.forEach((barber) => barbers.add(barber))
  })
  return Array.from(barbers).sort()
}

export function filteredAndSortedAppointments(
  appointments: Appointment[],
  filters: Filters,
  sortField: SortField,
  sortOrder: "asc" | "desc"
): Appointment[] {
    const filtered = appointments.filter((appointment) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        const matchesSearch =
          appointment.customer_name.toLowerCase().includes(searchLower) ||
          appointment.customer_email.toLowerCase().includes(searchLower) ||
          appointment.customer_phone.toLowerCase().includes(searchLower) ||
          appointment.store_name?.toLowerCase().includes(searchLower) ||
          appointment.service_name.toLowerCase().includes(searchLower) ||
          appointment.barber.toLowerCase().includes(searchLower)

        if (!matchesSearch) return false
      }

      // Status filter
      if (filters.status !== "all") {
        const status = getAppointmentStatus(appointment.date!)
        if (status !== filters.status) return false
      }

      // Store filter
      if (filters.store !== "all" && appointment.store_id !== filters.store) {
        return false
      }

      // Barber filter
      if (filters.barber !== "all" && appointment.barber !== filters.barber) {
        return false
      }

      // Date range filter
      if (filters.dateFrom && appointment.date! < filters.dateFrom) {
        return false
      }
      if (filters.dateTo && appointment.date! > filters.dateTo) {
        return false
      }

      return true
    })

  // Apply sorting logic
  filtered.sort((a, b) => {
    let aValue: any = a[sortField]
    let bValue: any = b[sortField]

    if (sortField === "date" || sortField === "created_at") {
      aValue = new Date(aValue).getTime()
      bValue = new Date(bValue).getTime()
    } else if (typeof aValue === "string") {
      aValue = aValue.toLowerCase()
      bValue = bValue.toLowerCase()
    }

    if (aValue < bValue) return sortOrder === "asc" ? -1 : 1
    if (aValue > bValue) return sortOrder === "asc" ? 1 : -1
    return 0
  })

  return filtered
}

export async function getAppointmentsAndStores() {
  const [appointmentsResponse, storesResponse] = await Promise.all([
    supabase.from("appointments").select("*").order("created_at", { ascending: false }),
    supabase.from("stores").select("*"),
  ])
  if (appointmentsResponse.error) throw appointmentsResponse.error
  if (storesResponse.error) throw storesResponse.error

  return {
    appointments: appointmentsResponse.data || [],
    stores: storesResponse.data || [],
  }
}

export function getAppointmentStatus(date: string) {
  const appointmentDate = new Date(date)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  if (appointmentDate < today) return "completed"
  if (appointmentDate.toDateString() === today.toDateString()) return "today"
  return "upcoming"
}

export function handleAppointmentUpdate(appointment: Appointment, appointments: Appointment[], setAppointments: (appointments: Appointment[]) => void) {
  setAppointments(appointments.map((apt) => (apt.id === appointment.id ? appointment : apt)))
}

export function handleAppointmentDelete(id: string, appointments: Appointment[], setAppointments: (appointments: Appointment[]) => void) {
  setAppointments(appointments.filter((apt) => apt.id !== id))
}

const handleAppointmentAdd = (newAppointment: Appointment) => {
  setAppointments((prev) => [newAppointment, ...prev])
}
