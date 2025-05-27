"use client"

import { FaStore, FaMapMarkerAlt, FaInfoCircle } from "react-icons/fa"
import FormCard from "./form-card"
import { useStoreForm } from "./store-form-context"

export default function BasicInfoTab() {
  const { formData, updateFormData } = useStoreForm();
  return (
    <FormCard   
      title="Store Details"
      description="Enter the basic information about your store"
      icon={<FaStore className="h-5 w-5" />}
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="title" className="block text-sm font-medium">
            Store Name
          </label>
          <input
            id="title"
            type="text"
            placeholder="e.g. Elite Cuts Salon"
            className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            value={formData.title}
            onChange={(e) => updateFormData({ title: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="address" className="block text-sm font-medium flex items-center">
            <FaMapMarkerAlt className="h-4 w-4 mr-2" />
            Address
          </label>
          <textarea
            id="address"
            placeholder="Full address including street, city, and postal code"
            className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent min-h-[100px]"
            value={formData.address}
            onChange={(e) => updateFormData({ address: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="block text-sm font-medium flex items-center">
            <FaInfoCircle className="h-4 w-4 mr-2" />
            About
          </label>
          <textarea
            id="description"
            placeholder="Describe your store, specialties, and what makes it unique..."
            className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent min-h-[150px]"
            value={formData.description}
            onChange={(e) => updateFormData({ description: e.target.value })}
          />
        </div>
      </div>
    </FormCard>
  )
}
