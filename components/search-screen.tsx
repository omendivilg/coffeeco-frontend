"use client"

import { Search, Star, MapPin } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface SearchScreenProps {
  onCafeSelect: (cafe: any) => void
}

export default function SearchScreen({ onCafeSelect }: SearchScreenProps) {
  const categories = ["Mejor para trabajar", "Mejor para platicar", "Mejor café", "Ambiente tranquilo", "Al aire libre"]

  const cafes = [
    {
      id: 1,
      name: "Café Central",
      image: "/placeholder.svg?height=200&width=300",
      rating: 4.5,
      reviews: 128,
      location: "Centro Histórico",
      tags: ["Tranquilo", "WiFi", "Trabajo"],
      description: "Perfecto para trabajar con excelente café",
    },
    {
      id: 2,
      name: "Brew & Co",
      image: "/placeholder.svg?height=200&width=300",
      rating: 4.8,
      reviews: 89,
      location: "Roma Norte",
      tags: ["Especialidad", "Latte Art", "Moderno"],
      description: "Café de especialidad con baristas expertos",
    },
    {
      id: 3,
      name: "Garden Coffee",
      image: "/placeholder.svg?height=200&width=300",
      rating: 4.3,
      reviews: 156,
      location: "Condesa",
      tags: ["Al aire libre", "Pet-friendly", "Brunch"],
      description: "Hermoso jardín y ambiente relajado",
    },
    {
      id: 4,
      name: "Urban Roasters",
      image: "/placeholder.svg?height=200&width=300",
      rating: 4.6,
      reviews: 203,
      location: "Polanco",
      tags: ["Tostado propio", "Industrial", "Fuerte"],
      description: "Tostadores urbanos con café intenso",
    },
  ]

  return (
    <div className="p-6">
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input placeholder="Buscar cafeterías..." className="pl-10 py-3 text-lg" />
        </div>
      </div>

      {/* Category Filters */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Categorías</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((category, index) => (
            <Button key={index} variant="outline" className="rounded-full">
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Cafes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cafes.map((cafe) => (
          <div
            key={cafe.id}
            onClick={() => onCafeSelect(cafe)}
            className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
          >
            <img src={cafe.image || "/placeholder.svg"} alt={cafe.name} className="w-full h-48 object-cover" />
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{cafe.name}</h3>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{cafe.rating}</span>
                  <span className="text-sm text-gray-500">({cafe.reviews})</span>
                </div>
              </div>

              <div className="flex items-center gap-1 mb-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">{cafe.location}</span>
              </div>

              <p className="text-sm text-gray-600 mb-3">{cafe.description}</p>

              <div className="flex flex-wrap gap-1">
                {cafe.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
