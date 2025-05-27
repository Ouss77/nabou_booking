import Header from '@/Components/LandingPage/Header'
import React from 'react'
import StoreCard from '@/Components/StoreCard'
import { supabase } from "@/lib/supabaseClient";

    async function getStores(): Promise<Store[]> {
  const { data: stores, error } = await supabase.from("stores").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching stores:", error)
    return []
  }

  return stores || []
}
async function  BarbersShop() {
      const stores = await getStores()


  return (
    <div>
        <Header />
        
<section className="py-16 px-4 sm:px-6 lg:px-8 bg-black">
  <div className="max-w-7xl mx-auto">
    <div className="text-center mb-12">
      <h2 className="text-4xl font-bold text-white mb-4">
        Premium <span className="text-yellow-600">Barbershops</span>
      </h2>
      <p className="text-gray-400 text-lg">Discover the finest barbershops in your area</p>
    </div>

    {stores.length === 0 ? (
      <div className="text-center py-12">
        <p className="text-gray-400 text-lg">No barbershops available at the moment.</p>
      </div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {stores.map((store) => (
          <StoreCard
            key={store.id}
            id={store.id}
            title={store.title}
            address={store.address}
            description={store.description}
            images={store.images}
          />
        ))}
      </div>
    )}
  </div>
</section>
    </div>
  )
}

export default BarbersShop