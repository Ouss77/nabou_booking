import { supabase } from "@/lib/supabaseClient"
import Link from "next/link"
import { MapPin, Users, Scissors, ArrowLeft, Clock } from "lucide-react"
import { notFound } from "next/navigation"

// Mocked prices
const servicePrices: Record<string, { price: number; duration: string }> = {
  "Classic Haircut": { price: 25, duration: "30min" },
  "Beard Trim": { price: 15, duration: "20min" },
  "Hot Towel Shave": { price: 30, duration: "45min" },
  "Hair Wash": { price: 10, duration: "15min" },
  "Fade Cut": { price: 30, duration: "35min" },
  "Beard Styling": { price: 20, duration: "25min" },
  "Mustache Trim": { price: 12, duration: "15min" },
  "Scalp Treatment": { price: 35, duration: "40min" },
  "Traditional Shave": { price: 40, duration: "50min" },
  "Pompadour Cut": { price: 35, duration: "40min" },
  "Beard Oil Treatment": { price: 25, duration: "30min" },
  "Straight Razor Shave": { price: 45, duration: "60min" },
}

async function getStore(id: string): Promise<Store | null> {
  const { data: store, error } = await supabase.from("stores").select("*").eq("id", id).single()
  if (error) {
    console.error("Error fetching store:", error)
    return null
  }
  return store
}

interface PageProps {
  params: { id: string }
}

export default async function StoreDetailPage({ params }: PageProps) {
  const getImageUrl = (image: string) => image; // Adjust if needed

  const store = await getStore(params.id)
  if (!store) notFound()

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link href="/" className="inline-flex items-center gap-2 text-yellow-400 hover:text-yellow-300">
            <ArrowLeft className="h-4 w-4" />
            Back to all barbershops
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Store Info */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">{store.title}</h1>
          <div className="flex items-center gap-2 text-gray-400 mb-4">
            <MapPin className="h-5 w-5" />
            <p className="text-lg">{store.address}</p>
          </div>
          <p className="text-gray-300 text-lg">{store.description}</p>
        </div>

        {/* Gallery */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-yellow-400">Gallery</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {store.images && store.images.length > 0 ? (
              store.images.map((image, index) => (
                <div key={index} className="relative h-64 rounded-lg overflow-hidden group">
                  <img
                    src={getImageUrl(image) || "/placeholder.svg"}
                    alt={`Image ${index + 1}`}
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-gray-400">No images available</div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Services */}
          <div>
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3 text-yellow-500">
              <Scissors className="h-8 w-8" />
              Services
            </h2>
            <div className="space-y-4">
              {store.services?.length ? (
                store.services.map((service, index) => {
                  const { price, duration } = servicePrices[service] || { price: 25, duration: "30min" }
                  return (
                    <div
                      key={index}
                      className="bg-gray-900 border border-gray-700 rounded-lg p-6 hover:border-yellow-600 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-bold text-xl text-white mb-1">{service}</h3>
                          <div className="flex items-center gap-2 text-gray-400">
                            <Clock className="h-4 w-4" />
                            <span className="text-sm">{duration}</span>
                          </div>
                        </div>
                        <div className="bg-yellow-500 text-black text-lg font-bold px-4 py-2 rounded">
                          €{price}
                        </div>
                      </div>
                      <Link
                        href={`/booking?store=${store.id}&service=${encodeURIComponent(service)}&price=${price}`}
                        className="block text-center bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3 text-lg rounded"
                      >
                        Choisir
                      </Link>
                    </div>
                  )
                })
              ) : (
                <p className="text-gray-400">No services available</p>
              )}
            </div>
          </div>

          {/* Barbers */}
          <div>
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3 text-yellow-500">
              <Users className="h-8 w-8" />
              Our Barbers
            </h2>
            <div className="space-y-4">
              {store.barbers?.length ? (
                store.barbers.map((barber, index) => (
                  <div key={index} className="bg-gray-900 border border-gray-700 rounded-lg p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
                        <Users className="h-6 w-6 text-black" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold text-xl">{barber}</h3>
                        <p className="text-gray-300 text-sm">Professional Barber</p>
                        <p className="text-gray-400 text-sm">Available for bookings</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400">No barbers listed</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}