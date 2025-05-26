"use client"

import { ArrowLeft, Star, Camera, MapPin, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"

interface UploadRecommendationProps {
  onBack: () => void
}

export default function UploadRecommendation({ onBack }: UploadRecommendationProps) {
  const [rating, setRating] = useState(0)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedCafe, setSelectedCafe] = useState("")

  const availableTags = [
    "Tranquilo",
    "WiFi Excelente",
    "Buen Café",
    "Para Trabajar",
    "Para Platicar",
    "Pet Friendly",
    "Al Aire Libre",
    "Música Ambiente",
    "Desayunos",
    "Postres",
  ]

  const suggestedCafes = ["Café Central", "Brew & Co", "Garden Coffee", "Urban Roasters", "The Coffee Lab"]

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">Subir Recomendación</h1>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        {/* Cafe Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <MapPin className="w-4 h-4 inline mr-1" />
            Selecciona la cafetería
          </label>
          <div className="relative">
            <Input
              placeholder="Buscar cafetería..."
              value={selectedCafe}
              onChange={(e) => setSelectedCafe(e.target.value)}
              className="mb-2"
            />
            {selectedCafe && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                {suggestedCafes
                  .filter((cafe) => cafe.toLowerCase().includes(selectedCafe.toLowerCase()))
                  .map((cafe, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedCafe(cafe)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 first:rounded-t-md last:rounded-b-md"
                    >
                      {cafe}
                    </button>
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* Rating */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Calificación</label>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button key={star} onClick={() => setRating(star)} className="p-1">
                <Star
                  className={`w-8 h-8 ${
                    star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300 hover:text-yellow-300"
                  } transition-colors`}
                />
              </button>
            ))}
            <span className="ml-2 text-sm text-gray-600">
              {rating > 0 ? `${rating}/5` : "Selecciona una calificación"}
            </span>
          </div>
        </div>

        {/* Comment */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Comentario</label>
          <Textarea placeholder="Comparte tu experiencia en esta cafetería..." rows={4} className="resize-none" />
        </div>

        {/* Tags */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Tag className="w-4 h-4 inline mr-1" />
            Etiquetas
          </label>
          <div className="flex flex-wrap gap-2">
            {availableTags.map((tag) => (
              <button key={tag} onClick={() => toggleTag(tag)} className="transition-colors">
                <Badge
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  className="cursor-pointer hover:bg-gray-100"
                >
                  {tag}
                </Badge>
              </button>
            ))}
          </div>
          {selectedTags.length > 0 && (
            <div className="mt-2">
              <span className="text-sm text-gray-600">Seleccionadas: </span>
              {selectedTags.map((tag, index) => (
                <span key={tag} className="text-sm text-amber-600">
                  {tag}
                  {index < selectedTags.length - 1 ? ", " : ""}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Photo Upload */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Camera className="w-4 h-4 inline mr-1" />
            Foto
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
            <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">Sube una foto de tu experiencia</p>
            <Button variant="outline" size="sm">
              Seleccionar archivo
            </Button>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex gap-3">
          <Button variant="outline" onClick={onBack} className="flex-1">
            Cancelar
          </Button>
          <Button className="flex-1 bg-amber-600 hover:bg-amber-700">Publicar Recomendación</Button>
        </div>
      </div>
    </div>
  )
}
