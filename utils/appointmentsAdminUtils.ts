 // Define or import these types accordingly$
import { supabase } from "@/lib/supabaseClient" // Adjust the import based on your project structure
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

interface Filters {
  search?: string
  status?: string
  store?: string
  barber?: string
  dateFrom?: string
  dateTo?: string
}

export  function getAllBarbers ( stores: Store[]): Promise<string[]> {
    const barbers = new Set<string>()
    stores.forEach((store) => {
      store.barbers?.forEach((barber:any) => barbers.add(barber))
    })
    return Array.from(barbers).sort()
  }
export  function filteredAndSortedAppointments(
  appointments: Appointment[],
  filters: Filters,
  sortField: keyof Appointment,
  sortOrder: "asc" | "desc"
): Appointment[] {
  const filtered = appointments.filter((appointment) => {
    // Apply filters like in your original logic...
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

  export function getAppointmentStatus (date: string) {
    const appointmentDate = new Date(date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (appointmentDate < today) return "completed"
    if (appointmentDate.toDateString() === today.toDateString()) return "today"
    return "upcoming"
  }


  export function handleSort  (field: SortField)  {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortOrder("asc")
    }
  }

  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({
      search: "",
      status: "all",
      store: "all",
      barber: "all",
      dateFrom: "",
      dateTo: "",
    })
  }

  export function handleAppointmentUpdate (updatedAppointment: Appointment)  {
    setAppointments((prev) => prev.map((apt) => (apt.id === updatedAppointment.id ? updatedAppointment : apt)))
  }

  export function handleAppointmentDelete  (deletedId: string)  {
    setAppointments((prev) => prev.filter((apt) => apt.id !== deletedId))
  }

  const handleAppointmentAdd = (newAppointment: Appointment) => {
    setAppointments((prev) => [newAppointment, ...prev])
  }
