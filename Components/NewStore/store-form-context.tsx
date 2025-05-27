"use client"

import type React from "react"

import { createContext, useContext, useState, type ReactNode } from "react"

export interface StoreFormData {
  title: string
  address: string
  images: any[]
  barbers: string[]
  services: string[]
  description: string
}

interface StoreFormContextType {
  formData: StoreFormData
  updateFormData: (updates: Partial<StoreFormData>) => void
    handleSubmit: (e: React.FormEvent) => void

  handleServiceToggle: (id: string) => void
  addBarber: () => void
  removeBarber: (index: number) => void
  updateBarber: (index: number, value: string) => void
  addImages: (files: File[]) => void
  removeImage: (index: number) => void
}

const StoreFormContext = createContext<StoreFormContextType | undefined>(undefined)

interface StoreFormProviderProps {
  children: ReactNode
  initialData: StoreFormData
  onSubmit: (e: React.FormEvent) => void
}

export function StoreFormProvider({ children, initialData, onSubmit }: StoreFormProviderProps) {
  const [formData, setFormData] = useState<StoreFormData>(initialData)

  const updateFormData = (updates: Partial<StoreFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }))
  }

  const handleServiceToggle = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.includes(id) ? prev.services.filter((s) => s !== id) : [...prev.services, id],
    }))
  }

  const addBarber = () => {
    setFormData((prev) => ({
      ...prev,
      barbers: [...prev.barbers, ""],
    }))
  }

  const removeBarber = (index: number) => {
    if (formData.barbers.length <= 1) return
    setFormData((prev) => ({
      ...prev,
      barbers: prev.barbers.filter((_, i) => i !== index),
    }))
  }

  const updateBarber = (index: number, value: string) => {
    const updated = [...formData.barbers]
    updated[index] = value
    setFormData((prev) => ({
      ...prev,
      barbers: updated,
    }))
  }

  const addImages = (files: File[]) => {
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
    }))
  }

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

//   const handleSubmit = (e: React.FormEvent) => {
//   e.preventDefault()
//   console.log("SUBMITTING", formData)
//   if (
//     !formData.title.trim() ||
//     !formData.address.trim() ||
//     !formData.description.trim() ||
//     formData.images.length === 0 ||
//     formData.barbers.length === 0 ||
//     formData.barbers.some((barber) => !barber.trim()) ||
//     formData.services.length === 0
//   ) {
//   alert("Please fill in all required fields before submitting.")
//   return 
//  }

//   onSubmit(e) // let parent handle actual submission
// }


  const value = {
    formData,
 //   handleSubmit, // ✅ Add this
    updateFormData,
    handleServiceToggle,
    addBarber,
    removeBarber,
    updateBarber,
    addImages,
    removeImage,
  }

  return <StoreFormContext.Provider value={value}>
    {children}
    </StoreFormContext.Provider>
}

export function useStoreForm() {
  const context = useContext(StoreFormContext)
  if (context === undefined) {
    throw new Error("useStoreForm must be used within a StoreFormProvider")
  }
  return context
}
