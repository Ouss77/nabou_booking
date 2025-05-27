"use client"

import { FaCut } from "react-icons/fa"
import FormCard from "./form-card"
import { useStoreForm } from "./store-form-context"

export default function ServicesTab() {
  const { formData, handleServiceToggle } = useStoreForm()

  const serviceCategories = {
    hairServices: [
      { id: "haircut", label: "Haircut" },
      { id: "shave", label: "Shave" },
    ],
    beautyServices: [
      { id: "facial", label: "Facial" },
      { id: "manicure", label: "Manicure" },
    ],
  }

  return (
    <FormCard
      title="Services Offered"
      description="Select the services your store provides to customers"
      icon={<FaCut className="h-5 w-5" />}
    >
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-3">Hair Services</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {serviceCategories.hairServices.map((service) => (
              <ServiceCheckbox
                key={service.id}
                id={service.id}
                label={service.label}
                checked={formData.services.includes(service.id)}
                onChange={() => handleServiceToggle(service.id)}
              />
            ))}
          </div>
        </div>

        <div className="border-t border-zinc-800 pt-6">
          <h3 className="text-lg font-medium mb-3">Beauty & Esthetics</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {serviceCategories.beautyServices.map((service) => (
              <ServiceCheckbox
                key={service.id}
                id={service.id}
                label={service.label}
                checked={formData.services.includes(service.id)}
                onChange={() => handleServiceToggle(service.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </FormCard>
  )
}

interface ServiceCheckboxProps {
  id: string
  label: string
  checked: boolean
  onChange: () => void
}

function ServiceCheckbox({ id, label, checked, onChange }: ServiceCheckboxProps) {
  return (
    <div className="flex items-center space-x-3 p-3 rounded-md border border-zinc-800 hover:border-amber-500/50 hover:bg-zinc-800/50 transition-colors">
      <div className="relative flex items-center">
        <input type="checkbox" id={id} checked={checked} onChange={onChange} className="peer sr-only" />
        <div className="h-5 w-5 border border-zinc-600 rounded peer-checked:bg-amber-500 peer-checked:border-amber-500 peer-focus:ring-2 peer-focus:ring-amber-500/50 transition-colors"></div>
        <svg
          className={`absolute left-0.5 top-0.5 h-4 w-4 text-zinc-950 ${checked ? "block" : "hidden"}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <label htmlFor={id} className="cursor-pointer flex-1">
        {label}
      </label>
    </div>
  )
}
