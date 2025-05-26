"use client"

import { useState } from "react"
import Sidebar from "@/components/sidebar"
import SuggestionsPanel from "@/components/suggestions-panel"
import SearchScreen from "@/components/search-screen"
import CafeDetail from "@/components/cafe-detail"
import UploadRecommendation from "@/components/upload-recommendation"
import FeedScreen from "@/components/feed-screen"

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState("feed")
  const [selectedCafe, setSelectedCafe] = useState(null)

  const renderScreen = () => {
    switch (currentScreen) {
      case "search":
        return (
          <SearchScreen
            onCafeSelect={(cafe) => {
              setSelectedCafe(cafe)
              setCurrentScreen("detail")
            }}
          />
        )
      case "detail":
        return <CafeDetail cafe={selectedCafe} onBack={() => setCurrentScreen("search")} />
      case "upload":
        return <UploadRecommendation onBack={() => setCurrentScreen("feed")} />
      case "feed":
      default:
        return (
          <FeedScreen
            onCafeSelect={(cafe) => {
              setSelectedCafe(cafe)
              setCurrentScreen("detail")
            }}
          />
        )
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar currentScreen={currentScreen} onNavigate={setCurrentScreen} />

      <main className="flex-1 max-w-4xl mx-auto">{renderScreen()}</main>

      <SuggestionsPanel
        onCafeSelect={(cafe) => {
          setSelectedCafe(cafe)
          setCurrentScreen("detail")
        }}
      />
    </div>
  )
}
