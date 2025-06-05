"use client"

import React, { useContext, useState } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ScrollView,
  TextInput,
  Platform,
  Dimensions,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { UserContext } from "../../App"
import ratingService from "../../services/ratingService"
import cafeService from "../../services/cafeService"

const { width } = Dimensions.get("window")
const isWeb = Platform.OS === "web"

const CafeTags = [
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

export default function UploadScreen({ navigation }) {
  const { user } = useContext(UserContext)
  const [selectedCafe, setSelectedCafe] = useState("")
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [selectedTags, setSelectedTags] = useState([])
  const [loading, setLoading] = useState(false)
  const [cafes, setCafes] = useState([])
  const [showCafeList, setShowCafeList] = useState(false)

  React.useEffect(() => {
    loadCafes()
  }, [])

  const loadCafes = async () => {
    try {
      const result = await cafeService.getPopularCafes(20)
      if (result.success) {
        setCafes(result.cafes)
      }
    } catch (error) {
      console.error("Error loading cafes:", error)
    }
  }

  const toggleTag = (tag) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  const handleSubmitRating = async () => {
    if (!selectedCafe) {
      Alert.alert("Error", "Por favor selecciona una cafetería")
      return
    }

    if (rating === 0) {
      Alert.alert("Error", "Por favor selecciona una calificación")
      return
    }

    if (!comment.trim()) {
      Alert.alert("Error", "Por favor escribe un comentario")
      return
    }

    setLoading(true)

    try {
      const selectedCafeData = cafes.find((cafe) => cafe.name === selectedCafe)

      if (!selectedCafeData) {
        Alert.alert("Error", "Cafetería no encontrada")
        return
      }

      const ratingData = {
        userId: user.id,
        userName: user.name || "Usuario",
        userAvatar: user.avatar || "",
        cafeId: selectedCafeData.id,
        rating: rating,
        comment: comment.trim(),
        tags: selectedTags,
      }

      const result = await ratingService.createRating(ratingData, [])

      if (result.success) {
        Alert.alert("Éxito", "Tu calificación ha sido enviada", [
          {
            text: "OK",
            onPress: () => {
              setSelectedCafe("")
              setRating(0)
              setComment("")
              setSelectedTags([])
              navigation.navigate("Feed")
            },
          },
        ])
      } else {
        Alert.alert("Error", result.error)
      }
    } catch (error) {
      Alert.alert("Error", "Ocurrió un error al enviar la calificación")
    } finally {
      setLoading(false)
    }
  }

  const filteredCafes = cafes.filter((cafe) => cafe.name.toLowerCase().includes(selectedCafe.toLowerCase()))

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={isWeb && styles.webContainer}>
        <View style={[styles.content, isWeb && styles.webContent]}>
          <Text style={styles.title}>Calificar Cafetería</Text>

          {/* Cafe Selection */}
          <View style={styles.section}>
            <Text style={styles.label}>
              <Ionicons name="location-outline" size={16} color="#8B4513" /> Selecciona la cafetería *
            </Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Buscar cafetería..."
                value={selectedCafe}
                onChangeText={(text) => {
                  setSelectedCafe(text)
                  setShowCafeList(text.length > 0)
                }}
                onFocus={() => setShowCafeList(selectedCafe.length > 0)}
              />
            </View>

            {showCafeList && filteredCafes.length > 0 && (
              <View style={styles.cafeList}>
                {filteredCafes.slice(0, 5).map((cafe) => (
                  <TouchableOpacity
                    key={cafe.id}
                    style={styles.cafeItem}
                    onPress={() => {
                      setSelectedCafe(cafe.name)
                      setShowCafeList(false)
                    }}
                  >
                    <Text style={styles.cafeName}>{cafe.name}</Text>
                    <Text style={styles.cafeLocation}>{cafe.location?.address}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Rating */}
          <View style={styles.section}>
            <Text style={styles.label}>Calificación *</Text>
            <View style={styles.ratingContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => setRating(star)} style={styles.starButton}>
                  <Ionicons
                    name={star <= rating ? "star" : "star-outline"}
                    size={32}
                    color={star <= rating ? "#fbbf24" : "#d1d5db"}
                  />
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.ratingText}>{rating > 0 ? `${rating}/5` : "Selecciona una calificación"}</Text>
          </View>

          {/* Comment */}
          <View style={styles.section}>
            <Text style={styles.label}>Comentario *</Text>
            <TextInput
              style={styles.textArea}
              value={comment}
              onChangeText={setComment}
              placeholder="Comparte tu experiencia en esta cafetería..."
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {/* Tags */}
          <View style={styles.section}>
            <Text style={styles.label}>
              <Ionicons name="pricetag-outline" size={16} color="#8B4513" /> Etiquetas
            </Text>
            <Text style={styles.subtitle}>¿Qué destacarías de este café?</Text>

            <View style={styles.tagsContainer}>
              {CafeTags.map((tag) => (
                <TouchableOpacity
                  key={tag}
                  style={[styles.tag, selectedTags.includes(tag) && styles.selectedTag]}
                  onPress={() => toggleTag(tag)}
                >
                  <Text style={[styles.tagText, selectedTags.includes(tag) && styles.selectedTagText]}>{tag}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitButton, loading && styles.disabledButton]}
            onPress={handleSubmitRating}
            disabled={loading}
          >
            <Text style={styles.submitButtonText}>{loading ? "Enviando..." : "Enviar Calificación"}</Text>
          </TouchableOpacity>
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
    justifyContent: "center",
    minHeight: "100vh",
  },
  content: {
    padding: 16,
  },
  webContent: {
    maxWidth: 600,
    alignSelf: "center",
    width: "100%",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 32,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
  },
  inputContainer: {
    position: "relative",
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e5e5",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    outlineStyle: "none", // Para web
  },
  cafeList: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e5e5",
    borderTopWidth: 0,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    maxHeight: 200,
  },
  cafeItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  cafeName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  cafeLocation: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  ratingContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 8,
  },
  starButton: {
    padding: 4,
  },
  ratingText: {
    textAlign: "center",
    color: "#666",
    fontSize: 14,
  },
  textArea: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e5e5",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    height: 100,
    outlineStyle: "none", // Para web
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  tag: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e5e5",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedTag: {
    backgroundColor: "#8B4513",
    borderColor: "#8B4513",
  },
  tagText: {
    fontSize: 14,
    color: "#666",
  },
  selectedTagText: {
    color: "#fff",
  },
  submitButton: {
    backgroundColor: "#8B4513",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 24,
  },
  disabledButton: {
    backgroundColor: "#d1d5db",
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
})
