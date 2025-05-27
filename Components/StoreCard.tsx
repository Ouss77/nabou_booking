// components/StoreCard.tsx
import Link from "next/link";
import { Star, MapPin } from "lucide-react";

interface StoreCardProps {
  id: string;
  title: string;
  address: string;
  description: string;
  images: string[];
}

const getImageUrl = (image: string) => image; // Adjust if needed

export default function StoreCard({
  id,
  title,
  address,
  description,
  images,
}: StoreCardProps) {
  return (
    <div className="bg-gray-900 border border-gray-800 overflow-hidden hover:border-yellow-600 transition-all duration-300 group rounded-lg">
      <div className="relative h-56 w-full overflow-hidden">
        <img
          src={
            images?.[0]
              ? getImageUrl(images[0])
              : "/placeholder.svg?height=224&width=400&text=Barbershop+Image"
          }
          alt={title}
          
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
          <Star className="h-4 w-4 text-yellow-600 fill-current" />
          <span className="text-white text-sm font-medium">4.9</span>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <div className="flex items-start gap-2 text-gray-400 mb-3">
          <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
          <p className="text-sm">{address}</p>
        </div>
        <p className="text-gray-300 text-sm line-clamp-2">{description}</p>
      </div>

      <div className="p-6 pt-0">
        <Link href={`/stores/${id}`} className="block w-full">
          <button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3 text-lg rounded-md transition-colors duration-200">
            Book Now
          </button>
        </Link>
      </div>
    </div>
  );
}
