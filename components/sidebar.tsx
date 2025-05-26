"use client"

import { Home, Search, Star, Coffee } from "lucide-react"

interface SidebarProps {
  currentScreen: string
  onNavigate: (screen: string) => void
}

export default function Sidebar({ currentScreen, onNavigate }: SidebarProps) {
  const menuItems = [
    { id: "feed", label: "Start", icon: Home },
    { id: "upload", label: "Rate", icon: Star },
    { id: "search", label: "Search", icon: Search },
  ]

  return (
    <div className="w-64 bg-white border-r border-gray-200 p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Coffee className="w-8 h-8 text-amber-600" />
          Coffeeco
        </h1>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
              currentScreen === item.id ? "bg-amber-100 text-amber-800" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center ${
                currentScreen === item.id ? "bg-amber-600" : "bg-gray-400"
              }`}
            >
              <item.icon className="w-4 h-4 text-white" />
            </div>
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  )
}
