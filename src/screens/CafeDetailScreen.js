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
  Dimensions,
  Linking,
  Platform,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { UserContext } from "../../App"
import ratingService from "../../services/ratingService"

const { width } = Dimensions.get("window")
const isWeb = Platform.OS === "web"

export default function CafeDetailScreen({ route, navigation }) {
  const { cafe } = route.params
  const { user } = useContext(UserContext)
  const [ratings, setRatings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadRatings()
  }, [])

  const loadRatings = async () => {
    try {
      const result = await ratingService.getCafeRatings(cafe.id, 10)
      if (result.success) {
        setRatings(result.ratings)
      }
    } catch (error) {
      console.error("Error loading ratings:", error)
    } finally {
      setLoading(false)
    }
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Ionicons key={index} name={index < Math.floor(rating) ? "star" : "star-outline"} size={16} color="#fbbf24" />
    ))
  }

  const formatDate = (date) => {
    if (!date) return ""
    const dateObj = date.toDate ? date.toDate() : new Date(date)
    return dateObj.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const openContact = (type, value) => {
    switch (type) {
      case "phone":
        Linking.openURL(`tel:${value}`)
        break
      case "website":
        Linking.openURL(value)
        break
      case "instagram":
        Linking.openURL(`https://instagram.com/${value.replace("@", "")}`)
        break
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={isWeb && styles.webContainer}>
        {/* Images */}
        {cafe.images && cafe.images.length > 0 && (
          <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} style={styles.imageContainer}>
            {cafe.images.map((image, index) => (
              <Image key={index} source={{ uri: image }} style={styles.image} />
            ))}
          </ScrollView>
        )}

        {/* Basic Info */}
        <View style={styles.infoContainer}>
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{cafe.name}</Text>
              {cafe.verified && <Ionicons name="checkmark-circle" size={20} color="#10b981" />}
            </View>

            <View style={styles.ratingContainer}>
              {renderStars(cafe.rating?.average || 0)}
              <Text style={styles.rating}>{(cafe.rating?.average || 0).toFixed(1)}</Text>
              <Text style={styles.reviewCount}>({cafe.rating?.count || 0} reseñas)</Text>
            </View>
          </View>

          <View style={styles.locationContainer}>
            <Ionicons name="location-outline" size={16} color="#666" />
            <Text style={styles.location}>{cafe.location?.address}</Text>
          </View>

          <Text style={styles.description}>{cafe.description}</Text>

          {/* Tags */}
          {cafe.tags && cafe.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {cafe.tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Contact Info */}
          {(cafe.contact?.phone || cafe.contact?.website || cafe.contact?.instagram) && (
            <View style={styles.contactContainer}>
              <Text style={styles.sectionTitle}>Contacto</Text>

              {cafe.contact.phone && (
                <TouchableOpacity style={styles.contactItem} onPress={() => openContact("phone", cafe.contact.phone)}>
                  <Ionicons name="call-outline" size={20} color="#8B4513" />
                  <Text style={styles.contactText}>{cafe.contact.phone}</Text>
                </TouchableOpacity>
              )}

              {cafe.contact.website && (
                <TouchableOpacity
                  style={styles.contactItem}
                  onPress={() => openContact("website", cafe.contact.website)}
                >
                  <Ionicons name="globe-outline" size={20} color="#8B4513" />
                  <Text style={styles.contactText}>{cafe.contact.website}</Text>
                </TouchableOpacity>
              )}

              {cafe.contact.instagram && (
                <TouchableOpacity
                  style={styles.contactItem}
                  onPress={() => openContact("instagram", cafe.contact.instagram)}
                >
                  <Ionicons name="logo-instagram" size={20} color="#8B4513" />
                  <Text style={styles.contactText}>{cafe.contact.instagram}</Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Menu */}
          {(cafe.menu?.drinks?.length > 0 || cafe.menu?.food?.length > 0 || cafe.menu?.specials?.length > 0) && (
            <View style={styles.menuContainer}>
              <Text style={styles.sectionTitle}>Menú</Text>

              {cafe.menu.drinks?.length > 0 && (
                <View style={styles.menuSection}>
                  <Text style={styles.menuSectionTitle}>Bebidas</Text>
                  {cafe.menu.drinks.map((item, index) => (
                    <Text key={index} style={styles.menuItem}>
                      • {item}
                    </Text>
                  ))}
                </View>
              )}

              {cafe.menu.food?.length > 0 && (
                <View style={styles.menuSection}>
                  <Text style={styles.menuSectionTitle}>Comida</Text>
                  {cafe.menu.food.map((item, index) => (
                    <Text key={index} style={styles.menuItem}>
                      • {item}
                    </Text>
                  ))}
                </View>
              )}

              {cafe.menu.specials?.length > 0 && (
                <View style={styles.menuSection}>
                  <Text style={styles.menuSectionTitle}>Especialidades</Text>
                  {cafe.menu.specials.map((item, index) => (
                    <Text key={index} style={styles.menuItem}>
                      • {item}
                    </Text>
                  ))}
                </View>
              )}
            </View>
          )}

          {/* Reviews Section */}
          <View style={styles.reviewsContainer}>
            <View style={styles.reviewsHeader}>
              <Text style={styles.sectionTitle}>Reseñas</Text>
              {user && (
                <TouchableOpacity style={styles.addReviewButton} onPress={() => navigation.navigate("Upload")}>
                  <Ionicons name="add" size={20} color="#fff" />
                  <Text style={styles.addReviewText}>Calificar</Text>
                </TouchableOpacity>
              )}
            </View>

            {ratings.length > 0 ? (
              ratings.map((rating, index) => (
                <View key={index} style={styles.reviewCard}>
                  <View style={styles.reviewHeader}>
                    <View style={styles.reviewUser}>
                      <View style={styles.reviewAvatarPlaceholder}>
                        <Ionicons name="person" size={16} color="#666" />
                      </View>
                      <View>
                        <Text style={styles.reviewUserName}>{rating.userName}</Text>
                        <Text style={styles.reviewDate}>{formatDate(rating.createdAt)}</Text>
                      </View>
                    </View>
                    <View style={styles.reviewRating}>{renderStars(rating.rating)}</View>
                  </View>

                  <Text style={styles.reviewComment}>{rating.comment}</Text>

                  {rating.tags && rating.tags.length > 0 && (
                    <View style={styles.reviewTags}>
                      {rating.tags.map((tag, tagIndex) => (
                        <View key={tagIndex} style={styles.reviewTag}>
                          <Text style={styles.reviewTagText}>{tag}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              ))
            ) : (
              <View style={styles.noReviews}>
                <Ionicons name="chatbubble-outline" size={48} color="#ccc" />
                <Text style={styles.noReviewsText}>No hay reseñas aún</Text>
                <Text style={styles.noReviewsSubtext}>¡Sé el primero en calificar este café!</Text>
              </View>
            )}
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
  scrollView: {
    flex: 1,
  },
  webContainer: {
    maxWidth: 800,
    alignSelf: "center",
    width: "100%",
  },
  imageContainer: {
    height: 250,
  },
  image: {
    width: isWeb ? Math.min(width, 800) : width,
    height: 250,
    resizeMode: "cover",
  },
  infoContainer: {
    backgroundColor: "#fff",
    marginTop: -20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  header: {
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginRight: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rating: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  reviewCount: {
    marginLeft: 4,
    fontSize: 14,
    color: "#666",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  location: {
    marginLeft: 4,
    fontSize: 14,
    color: "#666",
    flex: 1,
  },
  description: {
    fontSize: 16,
    color: "#333",
    lineHeight: 24,
    marginBottom: 16,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 24,
  },
  tag: {
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 12,
    color: "#666",
  },
  contactContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  contactText: {
    marginLeft: 12,
    fontSize: 14,
    color: "#8B4513",
  },
  menuContainer: {
    marginBottom: 24,
  },
  menuSection: {
    marginBottom: 16,
  },
  menuSectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  menuItem: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  reviewsContainer: {
    marginBottom: 24,
  },
  reviewsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  addReviewButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#8B4513",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  addReviewText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
    marginLeft: 4,
  },
  reviewCard: {
    backgroundColor: "#f9fafb",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  reviewUser: {
    flexDirection: "row",
    alignItems: "center",
  },
  reviewAvatarPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#e5e5e5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  reviewUserName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  reviewDate: {
    fontSize: 12,
    color: "#666",
  },
  reviewRating: {
    flexDirection: "row",
  },
  reviewComment: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
    marginBottom: 8,
  },
  reviewTags: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  reviewTag: {
    backgroundColor: "#e5e5e5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 4,
  },
  reviewTagText: {
    fontSize: 10,
    color: "#666",
  },
  noReviews: {
    alignItems: "center",
    paddingVertical: 40,
  },
  noReviewsText: {
    fontSize: 16,
    color: "#666",
    marginTop: 16,
  },
  noReviewsSubtext: {
    fontSize: 14,
    color: "#999",
    marginTop: 8,
  },
})
