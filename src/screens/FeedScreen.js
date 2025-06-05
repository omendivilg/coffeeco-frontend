"use client"

import { useState, useEffect, useContext } from "react"
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  RefreshControl,
  ActivityIndicator,
  Platform,
  Dimensions,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { UserContext } from "../../App"
import cafeService from "../../services/cafeService"

const { width } = Dimensions.get("window")
const isWeb = Platform.OS === "web"

export default function FeedScreen({ navigation }) {
  const { user } = useContext(UserContext)
  const [popularCafes, setPopularCafes] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    loadFeedData()
  }, [])

  const loadFeedData = async () => {
    try {
      const cafesResult = await cafeService.getPopularCafes(5)
      if (cafesResult.success) {
        setPopularCafes(cafesResult.cafes)
      }
    } catch (error) {
      console.error("Error loading feed data:", error)
    } finally {
      setLoading(false)
    }
  }

  const onRefresh = async () => {
    setRefreshing(true)
    await loadFeedData()
    setRefreshing(false)
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Ionicons key={index} name={index < Math.floor(rating) ? "star" : "star-outline"} size={12} color="#fbbf24" />
    ))
  }

  const renderCafeCard = (cafe) => (
    <TouchableOpacity key={cafe.id} style={styles.cafeCard} onPress={() => navigation.navigate("CafeDetail", { cafe })}>
      {cafe.images && cafe.images.length > 0 ? (
        <Image source={{ uri: cafe.images[0] }} style={styles.cafeImage} />
      ) : (
        <View style={[styles.cafeImage, styles.placeholderImage]}>
          <Ionicons name="cafe-outline" size={30} color="#ccc" />
        </View>
      )}

      <View style={styles.cafeInfo}>
        <Text style={styles.cafeName} numberOfLines={1}>
          {cafe.name}
        </Text>
        <View style={styles.ratingContainer}>
          {renderStars(cafe.rating?.average || 0)}
          <Text style={styles.rating}>{(cafe.rating?.average || 0).toFixed(1)}</Text>
        </View>
        <Text style={styles.location} numberOfLines={1}>
          {cafe.location?.address || "Ubicación no disponible"}
        </Text>
      </View>
    </TouchableOpacity>
  )

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8B4513" />
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={isWeb ? styles.webContainer : null}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>¡Hola, {user?.name || "Usuario"}!</Text>
            <Text style={styles.subtitle}>Descubre nuevos cafés</Text>
          </View>
          <TouchableOpacity style={styles.profileButton} onPress={() => navigation.navigate("Profile")}>
            {user?.avatar ? (
              <Image source={{ uri: user.avatar }} style={styles.avatar} />
            ) : (
              <Ionicons name="person-circle-outline" size={40} color="#8B4513" />
            )}
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate("Search")}>
            <Ionicons name="search-outline" size={24} color="#8B4513" />
            <Text style={styles.actionText}>Buscar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate("Upload")}>
            <Ionicons name="add-circle-outline" size={24} color="#8B4513" />
            <Text style={styles.actionText}>Calificar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="camera-outline" size={24} color="#8B4513" />
            <Text style={styles.actionText}>Foto</Text>
          </TouchableOpacity>
        </View>

        {/* Popular Cafes */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Cafés Populares</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Search")}>
              <Text style={styles.seeAll}>Ver todos</Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
            {popularCafes.map(renderCafeCard)}
          </ScrollView>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actividad Reciente</Text>
          <View style={styles.emptyActivity}>
            <Ionicons name="cafe-outline" size={48} color="#ccc" />
            <Text style={styles.emptyText}>No hay actividad reciente</Text>
            <Text style={styles.emptySubtext}>¡Sigue a otros usuarios para ver sus reseñas!</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  webContainer: {
    maxWidth: isWeb ? 800 : "100%",
    alignSelf: "center",
    width: "100%",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#fff",
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: "hidden",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  quickActions: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#fff",
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
  },
  actionText: {
    fontSize: 12,
    color: "#8B4513",
    marginTop: 4,
    fontWeight: "500",
  },
  section: {
    marginTop: 16,
    backgroundColor: "#fff",
    paddingVertical: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  seeAll: {
    fontSize: 14,
    color: "#8B4513",
    fontWeight: "500",
  },
  horizontalScroll: {
    paddingHorizontal: 16,
  },
  cafeCard: {
    width: isWeb ? 200 : 160,
    marginRight: 12,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cafeImage: {
    width: "100%",
    height: 120,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  placeholderImage: {
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
  },
  cafeInfo: {
    padding: 12,
  },
  cafeName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  rating: {
    marginLeft: 4,
    fontSize: 12,
    color: "#333",
    fontWeight: "500",
  },
  location: {
    fontSize: 12,
    color: "#666",
  },
  emptyActivity: {
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 16,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    marginTop: 16,
    textAlign: "center",
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
    marginTop: 8,
    textAlign: "center",
  },
})
