"use client"

import { useState, useContext } from "react"
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Platform,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { UserContext } from "../../App"
import authService from "../../services/authService"

const isWeb = Platform.OS === "web"

export default function ProfileScreen({ navigation }) {
  const { user, setUser } = useContext(UserContext)
  const [loading, setLoading] = useState(false)

  const handleLogout = () => {
    Alert.alert("Cerrar Sesión", "¿Estás seguro de que quieres cerrar sesión?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Cerrar Sesión",
        style: "destructive",
        onPress: async () => {
          setLoading(true)
          const result = await authService.logoutUser()
          if (result.success) {
            setUser(null)
          } else {
            Alert.alert("Error", "No se pudo cerrar sesión")
          }
          setLoading(false)
        },
      },
    ])
  }

  const menuItems = [
    {
      icon: "person-outline",
      title: "Editar Perfil",
      subtitle: "Actualiza tu información personal",
      onPress: () => Alert.alert("Próximamente", "Esta función estará disponible pronto"),
    },
    {
      icon: "star-outline",
      title: "Mis Reseñas",
      subtitle: "Ve todas tus calificaciones",
      onPress: () => Alert.alert("Próximamente", "Esta función estará disponible pronto"),
    },
    {
      icon: "heart-outline",
      title: "Favoritos",
      subtitle: "Cafés que has guardado",
      onPress: () => Alert.alert("Próximamente", "Esta función estará disponible pronto"),
    },
    {
      icon: "people-outline",
      title: "Siguiendo",
      subtitle: "Usuarios que sigues",
      onPress: () => Alert.alert("Próximamente", "Esta función estará disponible pronto"),
    },
    {
      icon: "settings-outline",
      title: "Configuración",
      subtitle: "Preferencias y privacidad",
      onPress: () => Alert.alert("Próximamente", "Esta función estará disponible pronto"),
    },
    {
      icon: "help-circle-outline",
      title: "Ayuda y Soporte",
      subtitle: "Obtén ayuda o reporta problemas",
      onPress: () => Alert.alert("Próximamente", "Esta función estará disponible pronto"),
    },
  ]

  if (user?.type === "cafe_owner") {
    menuItems.splice(2, 0, {
      icon: "storefront-outline",
      title: "Mis Cafeterías",
      subtitle: "Administra tus locales",
      onPress: () => Alert.alert("Próximamente", "Esta función estará disponible pronto"),
    })
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={isWeb && styles.webContainer}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            {user?.avatar ? (
              <Image source={{ uri: user.avatar }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Ionicons name="person" size={40} color="#666" />
              </View>
            )}
            <TouchableOpacity style={styles.editAvatarButton}>
              <Ionicons name="camera" size={16} color="#fff" />
            </TouchableOpacity>
          </View>

          <Text style={styles.userName}>{user?.name || "Usuario"}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>

          {user?.type === "cafe_owner" && (
            <View style={styles.badge}>
              <Ionicons name="storefront" size={12} color="#8B4513" />
              <Text style={styles.badgeText}>Propietario de Café</Text>
            </View>
          )}

          {user?.bio && <Text style={styles.userBio}>{user.bio}</Text>}
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{user?.stats?.reviews || 0}</Text>
            <Text style={styles.statLabel}>Reseñas</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{user?.stats?.followers || 0}</Text>
            <Text style={styles.statLabel}>Seguidores</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{user?.stats?.following || 0}</Text>
            <Text style={styles.statLabel}>Siguiendo</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity key={index} style={styles.menuItem} onPress={item.onPress}>
              <View style={styles.menuItemLeft}>
                <View style={styles.menuIcon}>
                  <Ionicons name={item.icon} size={20} color="#8B4513" />
                </View>
                <View style={styles.menuText}>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                  <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} disabled={loading}>
          <Ionicons name="log-out-outline" size={20} color="#e11d48" />
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>
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
    maxWidth: 600,
    alignSelf: "center",
    width: "100%",
  },
  profileHeader: {
    backgroundColor: "#fff",
    alignItems: "center",
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#e5e5e5",
    justifyContent: "center",
    alignItems: "center",
  },
  editAvatarButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#8B4513",
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  badgeText: {
    fontSize: 12,
    color: "#8B4513",
    marginLeft: 4,
    fontWeight: "500",
  },
  userBio: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingVertical: 20,
    marginTop: 8,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  menuContainer: {
    backgroundColor: "#fff",
    marginTop: 8,
    paddingVertical: 8,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  menuText: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  menuSubtitle: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    marginTop: 8,
    paddingVertical: 16,
    marginHorizontal: isWeb ? 0 : 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e11d48",
  },
  logoutText: {
    fontSize: 16,
    color: "#e11d48",
    fontWeight: "500",
    marginLeft: 8,
  },
})
