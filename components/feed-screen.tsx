"use client"

import { Heart, Bookmark, MessageCircle, Share } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

interface FeedScreenProps {
  onCafeSelect: (cafe: any) => void
}

export default function FeedScreen({ onCafeSelect }: FeedScreenProps) {
  const filters = ["Mejor para trabajar", "Mejor para platicar", "Mejor café"]

  const posts = [
    {
      id: 1,
      user: { name: "nombreusuario", avatar: "/placeholder.svg?height=40&width=40" },
      cafe: { name: "Café Central", id: 1 },
      image: "/placeholder.svg?height=400&width=600",
      caption: "el mejor cafe del mundo",
      timeAgo: "1 min ago",
      likes: 24,
      comments: 8,
    },
    {
      id: 2,
      user: { name: "maria_coffee", avatar: "/placeholder.svg?height=40&width=40" },
      cafe: { name: "Brew & Co", id: 2 },
      image: "/placeholder.svg?height=400&width=600",
      caption: "Perfecto para trabajar, ambiente tranquilo y wifi excelente ☕️",
      timeAgo: "15 min ago",
      likes: 42,
      comments: 12,
    },
  ]

  return (
    <div className="p-6">
      {/* Filters */}
      <div className="mb-6">
        <div className="flex gap-4 mb-4">
          {filters.map((filter, index) => (
            <Button key={index} variant="outline" className="bg-gray-800 text-white border-gray-700 hover:bg-gray-700">
              {filter}
            </Button>
          ))}
        </div>
      </div>

      {/* Posts Feed */}
      <div className="space-y-6">
        {posts.map((post) => (
          <div key={post.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {/* Post Header */}
            <div className="p-4 flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={post.user.avatar || "/placeholder.svg"} />
                <AvatarFallback>{post.user.name.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{post.user.name}</p>
                <p className="text-sm text-gray-500">{post.timeAgo}</p>
              </div>
            </div>

            {/* Post Image */}
            <div className="relative">
              <img src={post.image || "/placeholder.svg"} alt="Coffee post" className="w-full h-96 object-cover" />
            </div>

            {/* Post Actions */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="sm" className="p-0">
                    <Heart className="w-6 h-6" />
                  </Button>
                  <Button variant="ghost" size="sm" className="p-0">
                    <MessageCircle className="w-6 h-6" />
                  </Button>
                  <Button variant="ghost" size="sm" className="p-0">
                    <Share className="w-6 h-6" />
                  </Button>
                </div>
                <Button variant="ghost" size="sm" className="p-0">
                  <Bookmark className="w-6 h-6" />
                </Button>
              </div>

              <p className="text-sm font-semibold text-gray-900 mb-1">{post.likes} likes</p>

              <p className="text-sm text-gray-900 mb-2">
                <button onClick={() => onCafeSelect(post.cafe)} className="font-semibold hover:underline">
                  @{post.cafe.name}
                </button>{" "}
                {post.caption}
              </p>

              <button className="text-sm text-gray-500 hover:underline">Ver los {post.comments} comentarios</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
