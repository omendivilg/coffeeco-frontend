import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  FacebookAuthProvider,
  OAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  linkWithCredential,
} from "firebase/auth"
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore"
import { auth, db } from "../firebase/config"
import { Platform } from "react-native"

// Proveedores
const googleProvider = new GoogleAuthProvider()
const facebookProvider = new FacebookAuthProvider()
const appleProvider = new OAuthProvider("apple.com")

class AuthService {
  // Métodos existentes
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

  // NUEVOS MÉTODOS PARA AUTENTICACIÓN SOCIAL

  // Función genérica para manejar la autenticación social
  async socialLogin(provider, providerName) {
    try {
      let userCredential

      // En web usamos popup, en móvil usamos redirect
      if (Platform.OS === "web") {
        userCredential = await signInWithPopup(auth, provider)
      } else {
        // Para móvil, primero iniciamos el flujo de redirección
        await signInWithRedirect(auth, provider)
        // El resultado se maneja en otro lugar con getRedirectResult()
        return { success: true, pending: true }
      }

      // Obtener información del usuario
      const user = userCredential.user
      const isNewUser = userCredential._tokenResponse?.isNewUser

      // Verificar si el usuario ya existe en Firestore
      const userDoc = await getDoc(doc(db, "usuarios", user.uid))

      if (!userDoc.exists() && isNewUser) {
        // Crear nuevo documento de usuario si es la primera vez
        const newUserData = {
          id: user.uid,
          email: user.email,
          name: user.displayName || `Usuario ${providerName}`,
          username: this.generateUsername(user.displayName || `user_${Math.floor(Math.random() * 10000)}`),
          type: "normal",
          bio: "",
          avatar: user.photoURL || "",
          provider: providerName,
          stats: {
            reviews: 0,
            followers: 0,
            following: 0,
          },
          createdAt: new Date(),
        }

        await setDoc(doc(db, "usuarios", user.uid), newUserData)
        return { success: true, user: newUserData, isNewUser: true }
      } else if (userDoc.exists()) {
        // Actualizar último inicio de sesión
        await updateDoc(doc(db, "usuarios", user.uid), {
          lastLogin: new Date(),
        })
        return { success: true, user: userDoc.data(), isNewUser: false }
      }

      return { success: false, error: "Error procesando el inicio de sesión" }
    } catch (error) {
      console.error(`Error en inicio de sesión con ${providerName}:`, error)
      return { success: false, error: error.message }
    }
  }

  // Inicio de sesión con Google
  async loginWithGoogle() {
    return this.socialLogin(googleProvider, "Google")
  }

  // Inicio de sesión con Facebook
  async loginWithFacebook() {
    return this.socialLogin(facebookProvider, "Facebook")
  }

  // Inicio de sesión con Apple
  async loginWithApple() {
    return this.socialLogin(appleProvider, "Apple")
  }

  // Manejar resultado de redirección (para móvil)
  async handleRedirectResult() {
    try {
      const result = await getRedirectResult(auth)
      if (result) {
        const user = result.user
        const userDoc = await getDoc(doc(db, "usuarios", user.uid))

        if (userDoc.exists()) {
          return { success: true, user: userDoc.data() }
        } else {
          // Crear usuario si no existe
          const providerData = user.providerData[0]
          const providerName = this.getProviderName(providerData.providerId)

          const newUserData = {
            id: user.uid,
            email: user.email,
            name: user.displayName || `Usuario ${providerName}`,
            username: this.generateUsername(user.displayName || `user_${Math.floor(Math.random() * 10000)}`),
            type: "normal",
            bio: "",
            avatar: user.photoURL || "",
            provider: providerName,
            stats: {
              reviews: 0,
              followers: 0,
              following: 0,
            },
            createdAt: new Date(),
          }

          await setDoc(doc(db, "usuarios", user.uid), newUserData)
          return { success: true, user: newUserData, isNewUser: true }
        }
      }
      return { success: false, error: "No hay resultado de redirección" }
    } catch (error) {
      console.error("Error al manejar redirección:", error)
      return { success: false, error: error.message }
    }
  }

  // Vincular cuentas
  async linkAccounts(provider) {
    try {
      const currentUser = auth.currentUser
      if (!currentUser) {
        return { success: false, error: "No hay usuario autenticado" }
      }

      const credential = await signInWithPopup(auth, provider)
      const result = await linkWithCredential(currentUser, credential)
      return { success: true, user: result.user }
    } catch (error) {
      console.error("Error al vincular cuentas:", error)
      return { success: false, error: error.message }
    }
  }

  // Utilidades
  generateUsername(name) {
    // Convertir nombre a formato de username
    if (!name) return `user_${Math.floor(Math.random() * 10000)}`
    return name
      .toLowerCase()
      .replace(/\s+/g, "_")
      .replace(/[^a-z0-9_]/g, "")
      .substring(0, 15)
  }

  getProviderName(providerId) {
    switch (providerId) {
      case "google.com":
        return "Google"
      case "facebook.com":
        return "Facebook"
      case "apple.com":
        return "Apple"
      default:
        return "Social"
    }
  }

  // Métodos existentes
  async logoutUser() {
    try {
      await signOut(auth)
      return { success: true }
    } catch (error) {
      console.error("Error logging out:", error)
      return { success: false, error: error.message }
    }
  }

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
