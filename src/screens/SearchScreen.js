"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  FlatList,
  ActivityIndicator,
  Platform,
  Dimensions,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import cafeService from "../../services/cafeService"

const { width } = Dimensions.get("window")
const isWeb = Platform.OS === "web"

const CafeTags = [
  "Tranquilo",
  "WiFi Excelente",
  "Pet Friendly",
  "Al Aire Libre",
  "Para Trabajar",
  "Para Platicar",
  "Música Ambiente",
  "Desayunos",
  "Postres",
  "Café Especialidad",
]

export default function SearchScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTags, setSelectedTags] = useState([])
  const [cafes, setCafes] = useState([])
  const [loading, setLoading] = useState(false)
  const [popularCafes, setPopularCafes] = useState([])

  useEffect(() => {
    loadPopularCafes()
  }, [])

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (searchQuery || selectedTags.length > 0) {
        searchCafes()
      } else {
        setCafes([])
      }
    }, 500)

    return () => clearTimeout(delayedSearch)
  }, [searchQuery, selectedTags])

  const loadPopularCafes = async () => {
    setLoading(true)
    try {
      const result = await cafeService.getPopularCafes(10)
      if (result.success) {
        setPopularCafes(result.cafes)
        if (!searchQuery && selectedTags.length === 0) {
          setCafes(result.cafes)
        }
      }
    } catch (error) {
      console.error("Error loading popular cafes:", error)
    } finally {
      setLoading(false)
    }
  }

  const searchCafes = async () => {
    setLoading(true)
    try {
      const result = await cafeService.searchCafes(searchQuery, selectedTags, 20)
      if (result.success) {
        setCafes(result.cafes)
      }
    } catch (error) {
      console.error("Error searching cafes:", error)
    } finally {
      setLoading(false)
    }
  }

  const toggleTag = (tag) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Ionicons key={index} name={index < Math.floor(rating) ? "star" : "star-outline"} size={14} color="#fbbf24" />
    ))
  }

  const renderCafeCard = ({ item }) => (
    <TouchableOpacity style={styles.cafeCard} onPress={() => navigation.navigate("CafeDetail", { cafe: item })}>
      {item.images && item.images.length > 0 ? (
        <Image source={{ uri: item.images[0] }} style={styles.cafeImage} />
      ) : (
        <View style={[styles.cafeImage, styles.placeholderImage]}>
          <Ionicons name="cafe-outline" size={40} color="#ccc" />
        </View>
      )}

      <View style={styles.cafeInfo}>
        <View style={styles.cafeHeader}>
          <Text style={styles.cafeName} numberOfLines={1}>
            {item.name}
          </Text>
          <View style={styles.ratingContainer}>
            {renderStars(item.rating?.average || 0)}
            <Text style={styles.rating}>{(item.rating?.average || 0).toFixed(1)}</Text>
            <Text style={styles.reviews}>({item.rating?.count || 0})</Text>
          </View>
        </View>

        <View style={styles.locationContainer}>
          <Ionicons name="location-outline" size={14} color="#666" />
          <Text style={styles.location} numberOfLines={1}>
            {item.location?.address || "Ubicación no disponible"}
          </Text>
        </View>

        <Text style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.tagsContainer}>
          {item.tags?.slice(0, 3).map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
          {item.tags?.length > 3 && <Text style={styles.moreTags}>+{item.tags.length - 3}</Text>}
        </View>
      </View>
    </TouchableOpacity>
  )

  const displayCafes = searchQuery || selectedTags.length > 0 ? cafes : popularCafes

  return (
    <SafeAreaView style={styles.container}>
      <View style={isWeb ? styles.webContainer : styles.mobileContainer}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar cafeterías..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>

        {/* Tags Filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tagsScrollContainer}
          contentContainerStyle={styles.tagsContainer}
        >
          {CafeTags.map((tag) => (
            <TouchableOpacity
              key={tag}
              style={[styles.filterTag, selectedTags.includes(tag) && styles.selectedFilterTag]}
              onPress={() => toggleTag(tag)}
            >
              <Text style={[styles.filterTagText, selectedTags.includes(tag) && styles.selectedFilterTagText]}>
                {tag}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Results */}
        <View style={styles.resultsContainer}>
          {!searchQuery && selectedTags.length === 0 && <Text style={styles.sectionTitle}>Cafeterías Populares</Text>}

          {searchQuery || selectedTags.length > 0 ? (
            <Text style={styles.resultsText}>{loading ? "Buscando..." : `${cafes.length} resultados encontrados`}</Text>
          ) : null}

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#8B4513" />
            </View>
          ) : (
            <FlatList
              data={displayCafes}
              renderItem={renderCafeCard}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContainer}
              numColumns={isWeb ? 2 : 1}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Ionicons name="cafe-outline" size={64} color="#ccc" />
                  <Text style={styles.emptyText}>
                    {searchQuery || selectedTags.length > 0 ? "No se encontraron cafeterías" : "Cargando cafeterías..."}
                  </Text>
                </View>
              }
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  webContainer: {
    flex: 1,
    maxWidth: 1200,
    alignSelf: "center",
    width: "100%",
    paddingHorizontal: 20,
  },
  mobileContainer: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: isWeb ? 0 : 16,
    marginVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e5e5",
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    outlineStyle: "none", // Para web
  },
  tagsScrollContainer: {
    paddingVertical: 8,
  },
  tagsContainer: {
    paddingHorizontal: isWeb ? 0 : 16,
  },
  filterTag: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#e5e5e5",
  },
  selectedFilterTag: {
    backgroundColor: "#8B4513",
    borderColor: "#8B4513",
  },
  filterTagText: {
    color: "#666",
    fontSize: 14,
    fontWeight: "500",
  },
  selectedFilterTagText: {
    color: "#fff",
  },
  resultsContainer: {
    flex: 1,
    paddingHorizontal: isWeb ? 0 : 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  resultsText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: {
    paddingBottom: 20,
  },
  cafeCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flex: isWeb ? 0.48 : 1,
    marginHorizontal: isWeb ? "1%" : 0,
  },
  cafeImage: {
    width: "100%",
    height: 180,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  placeholderImage: {
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
  },
  cafeInfo: {
    padding: 16,
  },
  cafeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  cafeName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
    marginRight: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rating: {
    marginLeft: 4,
    fontWeight: "600",
    color: "#333",
    fontSize: 14,
  },
  reviews: {
    marginLeft: 4,
    color: "#666",
    fontSize: 12,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  location: {
    marginLeft: 4,
    color: "#666",
    fontSize: 14,
    flex: 1,
  },
  description: {
    color: "#666",
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
  },
  tag: {
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 12,
    color: "#666",
  },
  moreTags: {
    fontSize: 12,
    color: "#8B4513",
    fontWeight: "500",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    marginTop: 16,
    textAlign: "center",
  },
})
