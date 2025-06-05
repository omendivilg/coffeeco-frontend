import { collection, doc, setDoc, getDocs, query, where, orderBy, limit } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { db, storage } from "../firebase/config"

class CafeService {
  // Registrar nuevo café
  async registerCafe(cafeData, images = []) {
    try {
      const cafeRef = doc(collection(db, "cafes"))
      const cafeId = cafeRef.id

      // Subir imágenes si existen
      let imageUrls = []
      if (images.length > 0) {
        imageUrls = await this.uploadCafeImages(cafeId, images)
      }

      const cafeDoc = {
        id: cafeId,
        ...cafeData,
        images: imageUrls,
        rating: {
          average: 0,
          count: 0,
          breakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      await setDoc(cafeRef, cafeDoc)

      return { success: true, cafe: cafeDoc }
    } catch (error) {
      console.error("Error registering cafe:", error)
      return { success: false, error: error.message }
    }
  }

  // Subir imágenes del café
  async uploadCafeImages(cafeId, images) {
    const imageUrls = []

    for (let i = 0; i < images.length; i++) {
      try {
        const image = images[i]
        const imageRef = ref(storage, `cafes/${cafeId}/image_${i}_${Date.now()}.jpg`)

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
        console.error("Error uploading image:", error)
      }
    }

    return imageUrls
  }

  // Buscar cafés
  async searchCafes(searchTerm = "", tags = [], limitCount = 20) {
    try {
      let q = collection(db, "cafes")

      if (searchTerm) {
        q = query(
          q,
          where("name", ">=", searchTerm),
          where("name", "<=", searchTerm + "\uf8ff"),
          orderBy("name"),
          limit(limitCount),
        )
      } else {
        q = query(q, orderBy("rating.average", "desc"), limit(limitCount))
      }

      const querySnapshot = await getDocs(q)
      let cafes = []

      querySnapshot.forEach((doc) => {
        cafes.push(doc.data())
      })

      // Filtrar por tags si se especifican
      if (tags.length > 0) {
        cafes = cafes.filter((cafe) => tags.some((tag) => cafe.tags?.includes(tag)))
      }

      return { success: true, cafes }
    } catch (error) {
      console.error("Error searching cafes:", error)
      return { success: false, error: error.message }
    }
  }

  // Obtener cafés populares
  async getPopularCafes(limitCount = 10) {
    try {
      const q = query(
        collection(db, "cafes"),
        orderBy("rating.average", "desc"),
        orderBy("rating.count", "desc"),
        limit(limitCount),
      )

      const querySnapshot = await getDocs(q)
      const cafes = []

      querySnapshot.forEach((doc) => {
        cafes.push(doc.data())
      })

      return { success: true, cafes }
    } catch (error) {
      console.error("Error getting popular cafes:", error)
      return { success: false, error: error.message }
    }
  }
}

export default new CafeService()
