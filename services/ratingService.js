import { collection, doc, getDocs, query, orderBy, runTransaction, limit } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { db, storage } from "../firebase/config"

class RatingService {
  // Crear nueva calificación
  async createRating(ratingData, images = []) {
    try {
      const ratingRef = doc(collection(db, "cafes", ratingData.cafeId, "calificaciones"))
      const ratingId = ratingRef.id

      // Subir imágenes si existen
      let imageUrls = []
      if (images.length > 0) {
        imageUrls = await this.uploadRatingImages(ratingData.cafeId, ratingId, images)
      }

      const ratingDoc = {
        id: ratingId,
        ...ratingData,
        images: imageUrls,
        helpful: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      // Usar transacción para actualizar calificación y promedio del café
      await runTransaction(db, async (transaction) => {
        transaction.set(ratingRef, ratingDoc)

        const cafeRef = doc(db, "cafes", ratingData.cafeId)
        const cafeDoc = await transaction.get(cafeRef)

        if (cafeDoc.exists()) {
          const cafeData = cafeDoc.data()
          const currentRating = cafeData.rating || { average: 0, count: 0, breakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } }

          const newCount = currentRating.count + 1
          const newTotal = currentRating.average * currentRating.count + ratingData.rating
          const newAverage = newTotal / newCount

          const newBreakdown = { ...currentRating.breakdown }
          newBreakdown[ratingData.rating] = (newBreakdown[ratingData.rating] || 0) + 1

          transaction.update(cafeRef, {
            "rating.average": Math.round(newAverage * 10) / 10,
            "rating.count": newCount,
            "rating.breakdown": newBreakdown,
            updatedAt: new Date(),
          })
        }
      })

      return { success: true, rating: ratingDoc }
    } catch (error) {
      console.error("Error creating rating:", error)
      return { success: false, error: error.message }
    }
  }

  // Subir imágenes de la calificación
  async uploadRatingImages(cafeId, ratingId, images) {
    const imageUrls = []

    for (let i = 0; i < images.length; i++) {
      try {
        const image = images[i]
        const imageRef = ref(storage, `ratings/${cafeId}/${ratingId}/image_${i}_${Date.now()}.jpg`)

        let blob
        if (typeof image === "string") {
          const response = await fetch(image)
          blob = await response.blob()
        } else {
          blob = image
        }

        const snapshot = await uploadBytes(imageRef, blob)
        const downloadURL = await getDownloadURL(snapshot.ref)
        imageUrls.push(downloadURL)
      } catch (error) {
        console.error("Error uploading rating image:", error)
      }
    }

    return imageUrls
  }

  // Obtener calificaciones de un café
  async getCafeRatings(cafeId, limitCount = 20) {
    try {
      const q = query(
        collection(db, "cafes", cafeId, "calificaciones"),
        orderBy("createdAt", "desc"),
        limit(limitCount),
      )

      const querySnapshot = await getDocs(q)
      const ratings = []

      querySnapshot.forEach((doc) => {
        ratings.push(doc.data())
      })

      return { success: true, ratings }
    } catch (error) {
      console.error("Error getting cafe ratings:", error)
      return { success: false, error: error.message }
    }
  }
}

export default new RatingService()
