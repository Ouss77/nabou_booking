"use client"

import { FaUsers, FaTrashAlt, FaPlus } from "react-icons/fa"
import FormCard from "./form-card"
import { useStoreForm } from "./store-form-context"

export default function TeamTab() {
  const { formData, addBarber, removeBarber, updateBarber } = useStoreForm()

  return (
    <FormCard
      title="Team Members"
      description="Add your stylists, barbers, and other team members"
      icon={<FaUsers className="h-5 w-5" />}
    >
      <div className="space-y-4">
        {formData.barbers.map((name, index) => (
          <div key={index} className="flex gap-3 items-center">
            <div className="flex-1 space-y-1">
              <label htmlFor={`barber-${index}`} className="block text-xs text-zinc-400">
                Team Member #{index + 1}
              </label>
              <input
                id={`barber-${index}`}
                type="text"
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                value={name}
                placeholder="Full name"
                onChange={(e) => updateBarber(index, e.target.value)}
              />
            </div>
            <button
              type="button"
              className={`mt-5 p-2 rounded-md ${
                formData.barbers.length <= 1
                  ? "bg-red-900/30 text-red-300/50 cursor-not-allowed"
                  : "bg-red-600 text-white hover:bg-red-700"
              }`}
              onClick={() => removeBarber(index)}
              disabled={formData.barbers.length <= 1}
              aria-label="Remove team member"
            >
              <FaTrashAlt className="h-4 w-4" />
            </button>
          </div>
        ))}

        <button
          type="button"
          className="w-full mt-4 py-2 px-4 border border-zinc-700 rounded-md text-zinc-300 hover:bg-zinc-800 transition-colors flex items-center justify-center"
          onClick={addBarber}
        >
          <FaPlus className="mr-2 h-4 w-4" />
          Add Team Member
        </button>
      </div>
    </FormCard>
  )
}
