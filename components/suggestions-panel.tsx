"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface SuggestionsPanelProps {
  onCafeSelect: (cafe: any) => void
}

export default function SuggestionsPanel({ onCafeSelect }: SuggestionsPanelProps) {
  const user = {
    name: "usuario",
    username: "nombreusuario",
    avatar: "/placeholder.svg?height=40&width=40",
  }

  const suggestions = [
    { id: 1, name: "cafe1", username: "nombrecafe1" },
    { id: 2, name: "cafe2", username: "nombrecafe2" },
    { id: 3, name: "cafe3", username: "nombrecafe3" },
  ]

  return (
    <div className="w-64 bg-white border-l border-gray-200 p-6">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="w-12 h-12 bg-blue-200">
            <AvatarImage src={user.avatar || "/placeholder.svg"} />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-gray-900">{user.name}</p>
            <p className="text-sm text-gray-500">{user.username}</p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-4">Sugerencias</h3>
        <div className="space-y-3">
          {suggestions.map((cafe) => (
            <button
              key={cafe.id}
              onClick={() => onCafeSelect(cafe)}
              className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-amber-200 flex items-center justify-center">
                <span className="text-amber-800 font-semibold">{cafe.name.charAt(0).toUpperCase()}</span>
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900">{cafe.name}</p>
                <p className="text-sm text-gray-500">{cafe.username}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
