# Coffeeco Universal - React Native Web + Firebase

Una aplicación **universal** construida con React Native que funciona perfectamente en **web, iOS y Android**, con Firebase como backend completo.

## 🌟 **Características Principales**

### ✅ **Universal (Web + Móvil)**
- **React Native Web** para funcionar en navegadores
- **Expo** para desarrollo multiplataforma
- **Responsive Design** que se adapta a cualquier pantalla
- **Navegación unificada** entre plataformas

### ✅ **Firebase Backend Completo**
- **Authentication** (registro, login, logout)
- **Firestore Database** (cafeterías, usuarios, calificaciones)
- **Storage** (imágenes de cafés y reseñas)
- **Real-time updates** y sincronización

### ✅ **Funcionalidades Completas**
- **Autenticación de usuarios** con tipos (normal/propietario)
- **Registro y gestión de cafeterías**
- **Sistema de calificaciones** con estrellas y comentarios
- **Búsqueda avanzada** con filtros por etiquetas
- **Subida de imágenes** para cafés y reseñas
- **Feed de actividad** y cafés populares

## 📱 **Plataformas Soportadas**

| Plataforma | Estado | Comando |
|------------|--------|---------|
| **Web** | ✅ Listo | `npm run web` |
| **iOS** | ✅ Listo | `npm run ios` |
| **Android** | ✅ Listo | `npm run android` |

## 🚀 **Instalación y Configuración**

### **1. Clonar e Instalar**
\`\`\`bash
git clone https://github.com/tu-usuario/coffeeco-universal.git
cd coffeeco-universal
npm install
\`\`\`

### **2. Configurar Firebase**

1. **Crear proyecto en [Firebase Console](https://console.firebase.google.com)**
2. **Habilitar servicios:**
   - Authentication (Email/Password)
   - Firestore Database
   - Storage

3. **Actualizar credenciales en `firebase/config.js`:**
\`\`\`javascript
const firebaseConfig = {
  apiKey: "tu-api-key",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto-id",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789",
  appId: "tu-app-id"
};
\`\`\`

### **3. Configurar Reglas de Firestore**
\`\`\`javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /usuarios/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /cafes/{cafeId} {
      allow read: if true;
      allow write: if request.auth != null;
      
      match /calificaciones/{ratingId} {
        allow read: if true;
        allow write: if request.auth != null && 
          request.auth.uid == request.resource.data.userId;
      }
    }
  }
}
\`\`\`

### **4. Ejecutar la Aplicación**

#### **Web (Navegador)**
\`\`\`bash
npm run web
# Abre en http://localhost:19006
\`\`\`

#### **Móvil (iOS/Android)**
\`\`\`bash
npm start
# Escanea el QR con Expo Go
\`\`\`

#### **Desarrollo Específico**
\`\`\`bash
npm run ios      # Solo iOS
npm run android  # Solo Android
\`\`\`

## 📁 **Estructura del Proyecto**

\`\`\`
coffeeco-universal/
├── firebase/
│   └── config.js                 # Configuración Firebase
├── services/
│   ├── authService.js            # Autenticación
│   ├── cafeService.js            # Gestión de cafés
│   └── ratingService.js          # Sistema de calificaciones
├── src/
│   └── screens/
│       ├── LoginScreen.js        # Pantalla de login
│       ├── RegisterScreen.js     # Registro de usuarios
│       ├── FeedScreen.js         # Feed principal
│       ├── SearchScreen.js       # Búsqueda de cafés
│       ├── UploadScreen.js       # Calificar cafés
│       ├── CafeDetailScreen.js   # Detalle de café
│       └── ProfileScreen.js      # Perfil de usuario
├── App.js                        # Componente principal
├── package.json                  # Dependencias
└── app.json                      # Configuración Expo
\`\`\`

## 🎯 **Funcionalidades por Pantalla**

### **🔐 Autenticación**
- **LoginScreen**: Inicio de sesión con email/password
- **RegisterScreen**: Registro con tipos de usuario

### **📱 Navegación Principal**
- **FeedScreen**: Cafés populares y actividad reciente
- **SearchScreen**: Búsqueda con filtros por etiquetas
- **UploadScreen**: Calificar cafeterías existentes
- **ProfileScreen**: Perfil y configuración de usuario

### **☕ Gestión de Cafés**
- **CafeDetailScreen**: Información completa, menú, reseñas
- **Registro de cafés**: Para propietarios (próximamente)

## 🌐 **Responsive Design**

La aplicación se adapta automáticamente a diferentes tamaños de pantalla:

- **Móvil**: Navegación con tabs, diseño vertical
- **Tablet**: Layouts optimizados, más contenido visible
- **Web**: Diseño centrado, máximo ancho, hover effects

## 🔥 **Integración Firebase**

### **Autenticación**
\`\`\`javascript
// Registro
await authService.registerUser(email, password, userData);

// Login
await authService.loginUser(email, password);

// Logout
await authService.logoutUser();
\`\`\`

### **Cafeterías**
\`\`\`javascript
// Buscar cafés
await cafeService.searchCafes(searchTerm, tags);

// Obtener populares
await cafeService.getPopularCafes(limit);
\`\`\`

### **Calificaciones**
\`\`\`javascript
// Crear calificación
await ratingService.createRating(ratingData, images);

// Obtener calificaciones
await ratingService.getCafeRatings(cafeId);
\`\`\`

## 📊 **Modelo de Datos**

### **Usuarios** (`usuarios/`)
\`\`\`javascript
{
  id: string,
  email: string,
  name: string,
  username: string,
  type: 'normal' | 'cafe_owner',
  avatar: string,
  bio: string,
  stats: { reviews: number, followers: number, following: number },
  createdAt: timestamp
}
\`\`\`

### **Cafeterías** (`cafes/`)
\`\`\`javascript
{
  id: string,
  name: string,
  description: string,
  location: { address: string, city: string },
  tags: string[],
  images: string[],
  menu: { drinks: string[], food: string[], specials: string[] },
  contact: { phone: string, website: string, instagram: string },
  rating: { average: number, count: number, breakdown: object },
  createdAt: timestamp
}
\`\`\`

### **Calificaciones** (`cafes/{cafeId}/calificaciones/`)
\`\`\`javascript
{
  id: string,
  userId: string,
  userName: string,
  cafeId: string,
  rating: number,
  comment: string,
  tags: string[],
  images: string[],
  helpful: number,
  createdAt: timestamp
}
\`\`\`

## 🚀 **Deployment**

### **Web (Vercel/Netlify)**
\`\`\`bash
npm run build:web
# Deploy la carpeta web-build/
\`\`\`

### **Móvil (App Stores)**
\`\`\`bash
expo build:ios     # iOS App Store
expo build:android # Google Play Store
\`\`\`

## 🔧 **Scripts Disponibles**

\`\`\`bash
npm start          # Servidor de desarrollo
npm run web        # Solo web
npm run ios        # Solo iOS
npm run android    # Solo Android
npm run build:web  # Build para web
\`\`\`

## 🎨 **Personalización**

### **Colores del Tema**
- **Primario**: `#8B4513` (Marrón café)
- **Secundario**: `#f5f5f5` (Gris claro)
- **Acentos**: `#fbbf24` (Amarillo estrellas)

### **Tipografía**
- **Títulos**: System font, bold
- **Texto**: System font, regular
- **Responsive**: Se adapta al tamaño de pantalla

## 🤝 **Contribuir**

1. Fork el proyecto
2. Crea una rama: `git checkout -b feature/nueva-funcionalidad`
3. Commit: `git commit -m 'Agregar nueva funcionalidad'`
4. Push: `git push origin feature/nueva-funcionalidad`
5. Pull Request

## 📄 **Licencia**

MIT License - ver [LICENSE](LICENSE) para más detalles.

## 🙏 **Agradecimientos**

- **React Native** y **Expo** por el framework universal
- **Firebase** por el backend completo
- **React Navigation** por la navegación
- **Expo Vector Icons** por los iconos

---

**¡Disfruta del café en cualquier plataforma! ☕📱💻**
