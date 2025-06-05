"use client"

// Configuración específica para autenticación web
import { getAuth } from "firebase/auth"
import app from "./config"
import { useEffect } from "react"

const auth = getAuth(app)

// Configurar dominio autorizado para redirecciones
// Esto es importante para producción
export const configureWebAuth = () => {
  useEffect(() => {
    auth.useDeviceLanguage()
  }, [])

  if (typeof window !== "undefined") {
    // Solo ejecutar en el cliente

    // Para desarrollo local
    if (window.location.hostname === "localhost") {
      // No es necesario configuración adicional para localhost
    }
    // Para producción
    else {
      // Asegúrate de que tu dominio esté autorizado en la consola de Firebase
      console.log("Autenticación configurada para producción")
    }
  }
}

export default auth
