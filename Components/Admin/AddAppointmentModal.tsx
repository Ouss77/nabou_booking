"use client"

import type React from "react"

import { useState } from "react"
import { supabase } from "@/lib/supabaseClient"

import { CalendarIcon, Loader2, AlertCircle } from "lucide-react"

interface AddAppointmentModalProps {
  isOpen: boolean
  onClose: () => void
  stores: Store[]
  onAdd: (appointment: Appointment) => void
}

interface FormData {
  store_id: string
  service_name: string
  service_price: number
  barber: string
  date: Date | undefined
  time: string
  customer_name: string
  customer_email: string
  customer_phone: string
}

interface FormErrors {
  [key: string]: string
}

const timeSlots = Array.from({ length: 24 }, (_, i) => {
  const hour = i.toString().padStart(2, "0")
  return [`${hour}:00`, `${hour}:30`]
}).flat()

const servicePrices: Record<string, number> = {
  "Classic Haircut": 25,
  "Beard Trim": 15,
  "Hot Towel Shave": 30,
  "Hair Wash": 10,
  "Fade Cut": 30,
  "Beard Styling": 20,
  "Mustache Trim": 12,
  "Scalp Treatment": 35,
  "Traditional Shave": 40,
  "Pompadour Cut": 35,
  "Beard Oil Treatment": 25,
  "Straight Razor Shave": 45,
}

export function AddAppointmentModal({ isOpen, onClose, stores, onAdd }: AddAppointmentModalProps) {
  const [formData, setFormData] = useState<FormData>({
    store_id: "",
    service_name: "",
    service_price: 0,
    barber: "",
    date: undefined,
    time: "",
    customer_name: "",
    customer_email: "",
    customer_phone: "",
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)

  const selectedStore = stores.find((store) => store.id === formData.store_id)

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.store_id) newErrors.store_id = "Store is required"
    if (!formData.service_name) newErrors.service_name = "Service is required"
    if (!formData.barber) newErrors.barber = "Barber is required"
    if (!formData.date) newErrors.date = "Date is required"
    if (!formData.time) newErrors.time = "Time is required"
    if (!formData.customer_name.trim()) newErrors.customer_name = "Customer name is required"
    if (!formData.customer_email.trim()) newErrors.customer_email = "Email is required"
    if (!formData.customer_phone.trim()) newErrors.customer_phone = "Phone is required"

    // Email validation
    if (formData.customer_email && !/\S+@\S+\.\S+/.test(formData.customer_email)) {
      newErrors.customer_email = "Invalid email format"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const checkDoubleBooking = async (): Promise<boolean> => {
    if (!formData.date || !formData.time || !formData.barber || !formData.store_id) return false

    const dateStr = format(formData.date, "yyyy-MM-dd")

    const { data, error } = await supabase
      .from("appointments")
      .select("id")
      .eq("store_id", formData.store_id)
      .eq("barber", formData.barber)
      .eq("date", dateStr)
      .eq("time", formData.time)

    if (error) {
      console.error("Error checking double booking:", error)
      return false
    }

    return data.length > 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    if (!validateForm()) return

    setLoading(true)
    try {
      // Check for double booking
      const isDoubleBooked = await checkDoubleBooking()
      if (isDoubleBooked) {
        setErrors({ general: "This time slot is already booked with the selected barber" })
        setLoading(false)
        return
      }

      const appointmentData = {
        store_id: formData.store_id,
        store_name: selectedStore?.title,
        service_name: formData.service_name,
        service_price: formData.service_price,
        barber: formData.barber,
        date: format(formData.date!, "yyyy-MM-dd"),
        time: formData.time,
        customer_name: formData.customer_name.trim(),
        customer_email: formData.customer_email.trim(),
        customer_phone: formData.customer_phone.trim(),
      }

      const { data, error } = await supabase.from("appointments").insert([appointmentData]).select().single()

      if (error) throw error

      onAdd(data)
      onClose()
      resetForm()
    } catch (error: any) {
      console.error("Error creating appointment:", error)
      setErrors({ general: error.message || "Failed to create appointment" })
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      store_id: "",
      service_name: "",
      service_price: 0,
      barber: "",
      date: undefined,
      time: "",
      customer_name: "",
      customer_email: "",
      customer_phone: "",
    })
    setErrors({})
  }

  const handleStoreChange = (storeId: string) => {
    setFormData((prev) => ({
      ...prev,
      store_id: storeId,
      barber: "", // Reset barber when store changes
    }))
  }

  const handleServiceChange = (serviceName: string) => {
    setFormData((prev) => ({
      ...prev,
      service_name: serviceName,
      service_price: servicePrices[serviceName] || 25,
    }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-yellow-400">Add New Appointment</DialogTitle>
          <DialogDescription className="text-gray-400">Create a new appointment for a customer</DialogDescription>
        </DialogHeader>

        {errors.general && (
          <Alert className="bg-red-900/20 border-red-800">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-red-400">{errors.general}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Store Selection */}
            <div>
              <Label htmlFor="store" className="text-white">
                Store *
              </Label>
              <Select value={formData.store_id} onValueChange={handleStoreChange}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Select a store" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {stores.map((store) => (
                    <SelectItem key={store.id} value={store.id}>
                      {store.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.store_id && <p className="text-red-400 text-sm mt-1">{errors.store_id}</p>}
            </div>

            {/* Service Selection */}
            <div>
              <Label htmlFor="service" className="text-white">
                Service *
              </Label>
              <Select value={formData.service_name} onValueChange={handleServiceChange}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Select a service" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {selectedStore?.services?.map((service) => (
                    <SelectItem key={service} value={service}>
                      {service} - €{servicePrices[service] || 25}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.service_name && <p className="text-red-400 text-sm mt-1">{errors.service_name}</p>}
            </div>

            {/* Barber Selection */}
            <div>
              <Label htmlFor="barber" className="text-white">
                Barber *
              </Label>
              <Select
                value={formData.barber}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, barber: value }))}
              >
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Select a barber" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {selectedStore?.barbers?.map((barber) => (
                    <SelectItem key={barber} value={barber}>
                      {barber}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.barber && <p className="text-red-400 text-sm mt-1">{errors.barber}</p>}
            </div>

            {/* Date Selection */}
            <div>
              <Label className="text-white">Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.date ? format(formData.date, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-700">
                  <Calendar
                    mode="single"
                    selected={formData.date}
                    onSelect={(date) => setFormData((prev) => ({ ...prev, date }))}
                    disabled={(date) => date < new Date() || date.getDay() === 0}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors.date && <p className="text-red-400 text-sm mt-1">{errors.date}</p>}
            </div>

            {/* Time Selection */}
            <div>
              <Label htmlFor="time" className="text-white">
                Time *
              </Label>
              <Select
                value={formData.time}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, time: value }))}
              >
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.time && <p className="text-red-400 text-sm mt-1">{errors.time}</p>}
            </div>

            {/* Customer Name */}
            <div>
              <Label htmlFor="customer_name" className="text-white">
                Customer Name *
              </Label>
              <Input
                id="customer_name"
                value={formData.customer_name}
                onChange={(e) => setFormData((prev) => ({ ...prev, customer_name: e.target.value }))}
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                placeholder="Enter customer name"
              />
              {errors.customer_name && <p className="text-red-400 text-sm mt-1">{errors.customer_name}</p>}
            </div>

            {/* Customer Email */}
            <div>
              <Label htmlFor="customer_email" className="text-white">
                Email *
              </Label>
              <Input
                id="customer_email"
                type="email"
                value={formData.customer_email}
                onChange={(e) => setFormData((prev) => ({ ...prev, customer_email: e.target.value }))}
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                placeholder="Enter email"
              />
              {errors.customer_email && <p className="text-red-400 text-sm mt-1">{errors.customer_email}</p>}
            </div>

            {/* Customer Phone */}
            <div>
              <Label htmlFor="customer_phone" className="text-white">
                Phone *
              </Label>
              <Input
                id="customer_phone"
                type="tel"
                value={formData.customer_phone}
                onChange={(e) => setFormData((prev) => ({ ...prev, customer_phone: e.target.value }))}
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                placeholder="Enter phone number"
              />
              {errors.customer_phone && <p className="text-red-400 text-sm mt-1">{errors.customer_phone}</p>}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Appointment"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
