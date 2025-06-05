"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  Platform,
  Dimensions,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import authService from "../../services/authService"

const { width } = Dimensions.get("window")
const isWeb = Platform.OS === "web"

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [socialLoading, setSocialLoading] = useState("")

  // Verificar resultado de redirección al cargar (para móvil)
  useEffect(() => {
    if (Platform.OS !== "web") {
      checkRedirectResult()
    }
  }, [])

  const checkRedirectResult = async () => {
    try {
      const result = await authService.handleRedirectResult()
      if (result.success) {
        // La navegación se manejará automáticamente por el AuthStateChange
      }
    } catch (error) {
      console.error("Error al verificar redirección:", error)
    }
  }

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Por favor completa todos los campos")
      return
    }

    setLoading(true)

    try {
      const result = await authService.loginUser(email, password)

      if (result.success) {
        // La navegación se manejará automáticamente por el AuthStateChange
      } else {
        Alert.alert("Error", result.error)
      }
    } catch (error) {
      Alert.alert("Error", "Ocurrió un error al iniciar sesión")
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setSocialLoading("google")
    try {
      const result = await authService.loginWithGoogle()
      if (!result.success && result.error) {
        Alert.alert("Error", result.error)
      }
      // Si es exitoso, la navegación se manejará por AuthStateChange
    } catch (error) {
      Alert.alert("Error", "Ocurrió un error al iniciar sesión con Google")
    } finally {
      setSocialLoading("")
    }
  }

  const handleFacebookLogin = async () => {
    setSocialLoading("facebook")
    try {
      const result = await authService.loginWithFacebook()
      if (!result.success && result.error) {
        Alert.alert("Error", result.error)
      }
    } catch (error) {
      Alert.alert("Error", "Ocurrió un error al iniciar sesión con Facebook")
    } finally {
      setSocialLoading("")
    }
  }

  const handleAppleLogin = async () => {
    setSocialLoading("apple")
    try {
      const result = await authService.loginWithApple()
      if (!result.success && result.error) {
        Alert.alert("Error", result.error)
      }
    } catch (error) {
      Alert.alert("Error", "Ocurrió un error al iniciar sesión con Apple")
    } finally {
      setSocialLoading("")
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.content, isWeb && styles.webContent]}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Ionicons name="cafe" size={64} color="#8B4513" />
          <Text style={styles.logoText}>Coffeeco</Text>
          <Text style={styles.subtitle}>Descubre los mejores cafés</Text>
        </View>

        {/* Form */}
        <View style={[styles.form, isWeb && styles.webForm]}>
          <Text style={styles.title}>Iniciar Sesión</Text>

          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Correo electrónico"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoComplete="password"
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={20} color="#666" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.loginButton, loading && styles.disabledButton]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.loginButtonText}>Iniciar Sesión</Text>}
          </TouchableOpacity>

          {/* Separador */}
          <View style={styles.separator}>
            <View style={styles.separatorLine} />
            <Text style={styles.separatorText}>o continúa con</Text>
            <View style={styles.separatorLine} />
          </View>

          {/* Botones de redes sociales */}
          <View style={styles.socialButtonsContainer}>
            <TouchableOpacity style={styles.socialButton} onPress={handleGoogleLogin} disabled={!!socialLoading}>
              {socialLoading === "google" ? (
                <ActivityIndicator size="small" color="#666" />
              ) : (
                <Ionicons name="logo-google" size={24} color="#DB4437" />
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.socialButton} onPress={handleFacebookLogin} disabled={!!socialLoading}>
              {socialLoading === "facebook" ? (
                <ActivityIndicator size="small" color="#666" />
              ) : (
                <Ionicons name="logo-facebook" size={24} color="#4267B2" />
              )}
            </TouchableOpacity>

            {/* Solo mostrar Apple en iOS o web */}
            {(Platform.OS === "ios" || Platform.OS === "web") && (
              <TouchableOpacity style={styles.socialButton} onPress={handleAppleLogin} disabled={!!socialLoading}>
                {socialLoading === "apple" ? (
                  <ActivityIndicator size="small" color="#666" />
                ) : (
                  <Ionicons name="logo-apple" size={24} color="#000" />
                )}
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>¿No tienes cuenta? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
              <Text style={styles.registerLink}>Regístrate</Text>
            </TouchableOpacity>
          </View>
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
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  webContent: {
    maxWidth: 400,
    alignSelf: "center",
    width: "100%",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 48,
  },
  logoText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#8B4513",
    marginTop: 16,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginTop: 8,
  },
  form: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  webForm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 24,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e5e5",
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    backgroundColor: "#f9fafb",
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: "#333",
    outlineStyle: "none", // Para web
  },
  loginButton: {
    backgroundColor: "#8B4513",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  disabledButton: {
    backgroundColor: "#d1d5db",
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  separator: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#e5e5e5",
  },
  separatorText: {
    marginHorizontal: 10,
    color: "#666",
    fontSize: 14,
  },
  socialButtonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: "#e5e5e5",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  registerText: {
    color: "#666",
    fontSize: 14,
  },
  registerLink: {
    color: "#8B4513",
    fontSize: 14,
    fontWeight: "600",
  },
})
