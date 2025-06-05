import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth"
import { doc, setDoc, getDoc } from "firebase/firestore"
import { auth, db } from "../firebase/config"

class AuthService {
  // Registrar nuevo usuario
  async registerUser(email, password, userData) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      await updateProfile(user, {
        displayName: userData.name,
      })

      const userDoc = {
        id: user.uid,
        email: email,
        name: userData.name,
        username: userData.username,
        type: userData.type || "normal",
        bio: userData.bio || "",
        avatar: "",
        stats: {
          reviews: 0,
          followers: 0,
          following: 0,
        },
        createdAt: new Date(),
      }

      await setDoc(doc(db, "usuarios", user.uid), userDoc)

      return { success: true, user: userDoc }
    } catch (error) {
      console.error("Error registering user:", error)
      return { success: false, error: error.message }
    }
  }

  // Iniciar sesión
  async loginUser(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      const userDoc = await getDoc(doc(db, "usuarios", user.uid))

      if (userDoc.exists()) {
        return { success: true, user: userDoc.data() }
      } else {
        return { success: false, error: "Usuario no encontrado en la base de datos" }
      }
    } catch (error) {
      console.error("Error logging in:", error)
      return { success: false, error: error.message }
    }
  }

  // Cerrar sesión
  async logoutUser() {
    try {
      await signOut(auth)
      return { success: true }
    } catch (error) {
      console.error("Error logging out:", error)
      return { success: false, error: error.message }
    }
  }

  // Observar cambios en autenticación
  onAuthStateChange(callback) {
    return onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, "usuarios", user.uid))
        if (userDoc.exists()) {
          callback(userDoc.data())
        } else {
          callback(null)
        }
      } else {
        callback(null)
      }
    })
  }

  getCurrentUser() {
    return auth.currentUser
  }
}

export default new AuthService()
