'use client'
import React, { useState } from 'react'
import { HiOutlineSearch, HiOutlineLocationMarker } from 'react-icons/hi'

export default function Hero() {
  const [selectedService, setSelectedService] = useState('')
  const [selectedCity, setSelectedCity] = useState('')

  const mockServices = [
    { id: 'haircut', name: 'Haircut' },
    { id: 'coloring', name: 'Hair Coloring' },
    { id: 'styling', name: 'Styling' },
    { id: 'massage', name: 'Massage' },
  ]

  const handleSearch = () => {
    alert(`Searching for ${selectedService} in ${selectedCity}`)
  }

  return (
    <section className="relative h-full min-h-screen text-white">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.squarespace-cdn.com/content/v1/5a4d67a68dd041365e9d3ba2/1515022836526-94S1FFRO8LIPBQTC2P59/home.jpg?format=2500w"
          alt="Salon interior"
          className="w-full h-full object-cover brightness-[0.3]"
        />
      </div>

      {/* Overlay Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-24 sm:px-6 sm:py-28 lg:py-36 text-center">
        <h1 className="mb-6 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
          <span className="block bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
            Book Your Perfect
          </span>
          <span className="block bg-gradient-to-r from-amber-500 to-amber-300 bg-clip-text text-transparent drop-shadow-sm">
            Style Experience
          </span>
        </h1>
        <p className="mb-10 text-base sm:text-lg md:text-xl text-zinc-300">
          Connect with top professionals in your area and book appointments with ease.
        </p>

        {/* Search Form */}
        <div className="bg-zinc-900/80 backdrop-blur-sm p-6 rounded-xl max-w-xl mx-auto w-full">
          <div className="grid gap-4 sm:grid-cols-2 mb-4">
            <div>
              <label htmlFor="service" className="block text-sm font-medium mb-1 text-left">
                Service Type
              </label>
              <select
                id="service"
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="w-full rounded border border-zinc-800 bg-zinc-950 p-2 text-zinc-100"
              >
                <option value="" disabled>Select service</option>
                {mockServices.map(service => (
                  <option key={service.id} value={service.id}>
                    {service.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative">
              <label htmlFor="city" className="block text-sm font-medium mb-1 text-left">
                Your City
              </label>
              <HiOutlineLocationMarker className="absolute left-3 top-[42px] h-5 w-5 text-zinc-500 pointer-events-none" />
              <input
                id="city"
                type="text"
                placeholder="Enter your city"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full rounded border border-zinc-800 bg-zinc-950 p-2 pl-10 text-zinc-100"
              />
            </div>
          </div>

          <button
            onClick={handleSearch}
            className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-semibold rounded p-3"
          >
            <HiOutlineSearch className="h-5 w-5" />
            Find Professionals
          </button>
        </div>
      </div>
    </section>
  )
}
