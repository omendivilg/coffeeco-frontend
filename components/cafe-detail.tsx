"use client"

import { ArrowLeft, Star, MapPin, Clock, Wifi, Volume2, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface CafeDetailProps {
  cafe: any
  onBack: () => void
}

export default function CafeDetail({ cafe, onBack }: CafeDetailProps) {
  const menuCategories = [
    { name: "Drinks", items: ["Espresso", "Cappuccino", "Latte", "Cold Brew"] },
    { name: "Snacks/Food", items: ["Croissant", "Sandwich", "Muffin", "Avocado Toast"] },
    { name: "Especiales", items: ["Café de Olla", "Matcha Latte", "Chai", "Smoothies"] },
  ]

  const ambientTags = [
    { icon: Volume2, label: "Tranquilo", active: true },
    { icon: Wifi, label: "WiFi Excelente", active: true },
    { icon: Users, label: "Pet Friendly", active: false },
    { icon: Clock, label: "24 Horas", active: false },
  ]

  const reviews = [
    {
      id: 1,
      user: { name: "Ana García", avatar: "/placeholder.svg?height=40&width=40" },
      rating: 5,
      comment: "Excelente café y ambiente perfecto para trabajar. El WiFi es súper rápido.",
      timeAgo: "2 días",
      images: ["/placeholder.svg?height=100&width=100"],
    },
    {
      id: 2,
      user: { name: "Carlos López", avatar: "/placeholder.svg?height=40&width=40" },
      rating: 4,
      comment: "Muy buen café, aunque a veces está muy lleno. Los baristas son muy amables.",
      timeAgo: "1 semana",
      images: [],
    },
  ]

  if (!cafe) return null

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">Perfil de Cafetería</h1>
      </div>

      {/* Cafe Profile */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex items-start gap-6 mb-6">
          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-2xl font-bold text-gray-600">{cafe.name?.charAt(0) || "C"}</span>
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{cafe.name || "Café Central"}</h2>
            <div className="flex items-center gap-4 mb-3">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${
                      star <= (cafe.rating || 4.5) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  {cafe.rating || 4.5} ({cafe.reviews || 128} reseñas)
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">{cafe.location || "Centro Histórico, CDMX"}</span>
            </div>
            <p className="text-gray-600">
              {cafe.description ||
                "Un acogedor café en el corazón de la ciudad, perfecto para trabajar y disfrutar de un excelente café de especialidad."}
            </p>
          </div>
        </div>

        {/* Ambient Tags */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Ambiente</h3>
          <div className="flex flex-wrap gap-2">
            {ambientTags.map((tag, index) => (
              <Badge key={index} variant={tag.active ? "default" : "secondary"} className="flex items-center gap-1">
                <tag.icon className="w-3 h-3" />
                {tag.label}
              </Badge>
            ))}
          </div>
        </div>

        {/* Menu Categories */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Menú</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {menuCategories.map((category, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">{category.name}</h4>
                <ul className="space-y-1">
                  {category.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="text-sm text-gray-600">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Photo Gallery */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Galería</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6].map((index) => (
              <div key={index} className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                <img
                  src={`/placeholder.svg?height=200&width=200`}
                  alt={`Foto ${index}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Reseñas</h3>
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="border-b border-gray-100 pb-4 last:border-b-0">
              <div className="flex items-start gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={review.user.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{review.user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-900">{review.user.name}</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">{review.timeAgo}</span>
                  </div>
                  <p className="text-gray-700 mb-2">{review.comment}</p>
                  {review.images.length > 0 && (
                    <div className="flex gap-2">
                      {review.images.map((image, index) => (
                        <img
                          key={index}
                          src={image || "/placeholder.svg"}
                          alt="Review"
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
