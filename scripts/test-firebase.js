// scripts/test-firebase.js
import { db } from "../firebase/config.js"
import { collection, getDocs } from "firebase/firestore"

async function testFirebaseConnection() {
  console.log("Probando conexión a Firebase...")

  try {
    // Probar Firestore
    console.log("Probando Firestore...")
    const cafesSnapshot = await getDocs(collection(db, "cafes"))
    console.log(`Conexión exitosa! Encontrados ${cafesSnapshot.size} cafés.`)

    cafesSnapshot.forEach((doc) => {
      console.log(`Café: ${doc.data().name}`)
    })

    console.log("¡Conexión a Firebase configurada correctamente!")
    return true
  } catch (error) {
    console.error("Error al conectar con Firebase:", error)
    return false
  }
}

testFirebaseConnection()
