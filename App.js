"use client"

import React, { useState, useEffect } from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { createStackNavigator } from "@react-navigation/stack"
import { StatusBar } from "expo-status-bar"
import { Ionicons } from "@expo/vector-icons"
import { View, ActivityIndicator, Platform } from "react-native"

// Importar la configuración web en la parte superior
import { configureWebAuth } from "./firebase/web-auth-config"

// Firebase
import "./firebase/config"
import authService from "./services/authService"

// Screens
import FeedScreen from "./src/screens/FeedScreen"
import SearchScreen from "./src/screens/SearchScreen"
import UploadScreen from "./src/screens/UploadScreen"
import CafeDetailScreen from "./src/screens/CafeDetailScreen"
import ProfileScreen from "./src/screens/ProfileScreen"
import LoginScreen from "./src/screens/LoginScreen"
import RegisterScreen from "./src/screens/RegisterScreen"

const Tab = createBottomTabNavigator()
const Stack = createStackNavigator()
const AuthStack = createStackNavigator()

// Context para usuario autenticado
export const UserContext = React.createContext()

// Stack de autenticación
function AuthStackScreen() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
    </AuthStack.Navigator>
  )
}

// Stack principal con tabs
function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName

          if (route.name === "Feed") {
            iconName = focused ? "home" : "home-outline"
          } else if (route.name === "Search") {
            iconName = focused ? "search" : "search-outline"
          } else if (route.name === "Upload") {
            iconName = focused ? "add-circle" : "add-circle-outline"
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline"
          }

          return <Ionicons name={iconName} size={size} color={color} />
        },
        tabBarActiveTintColor: "#8B4513",
        tabBarInactiveTintColor: "gray",
        headerStyle: {
          backgroundColor: "#8B4513",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
        // Responsive para web
        tabBarStyle: Platform.select({
          web: {
            height: 60,
            paddingBottom: 8,
            paddingTop: 8,
          },
          default: {},
        }),
      })}
    >
      <Tab.Screen name="Feed" component={FeedScreen} options={{ title: "Inicio" }} />
      <Tab.Screen name="Search" component={SearchScreen} options={{ title: "Buscar" }} />
      <Tab.Screen name="Upload" component={UploadScreen} options={{ title: "Subir" }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: "Perfil" }} />
    </Tab.Navigator>
  )
}

// Stack principal con navegación
function MainStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="MainTabs" component={MainTabNavigator} options={{ headerShown: false }} />
      <Stack.Screen
        name="CafeDetail"
        component={CafeDetailScreen}
        options={{
          title: "Cafetería",
          headerStyle: { backgroundColor: "#8B4513" },
          headerTintColor: "#fff",
        }}
      />
    </Stack.Navigator>
  )
}

export default function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Añadir esta función dentro del componente App, justo después de la declaración de estados
  useEffect(() => {
    // Configurar autenticación web
    if (Platform.OS === "web") {
      configureWebAuth()
    }
  }, [])

  // Verificar resultado de redirección al cargar (para móvil)
  useEffect(() => {
    if (Platform.OS !== "web") {
      const checkRedirectResult = async () => {
        try {
          const result = await authService.handleRedirectResult()
          if (result.success) {
            setUser(result.user)
          }
        } catch (error) {
          console.error("Error al verificar redirección:", error)
        }
      }

      checkRedirectResult()
    }
  }, [])

  useEffect(() => {
    // Observar cambios en autenticación
    const unsubscribe = authService.onAuthStateChange((userData) => {
      setUser(userData)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f5f5f5",
        }}
      >
        <ActivityIndicator size="large" color="#8B4513" />
      </View>
    )
  }

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <NavigationContainer>
        <StatusBar style="auto" />
        {user ? <MainStackNavigator /> : <AuthStackScreen />}
      </NavigationContainer>
    </UserContext.Provider>
  )
}
