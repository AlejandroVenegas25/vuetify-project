import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {

  apiKey: "AIzaSyCkUarq94e_jv9Z6ez3M9ud5550d0dqUCQ",

  authDomain: "notificaciones-87789.firebaseapp.com",

  projectId: "notificaciones-87789",

  storageBucket: "notificaciones-87789.firebasestorage.app",

  messagingSenderId: "774856011473",

  appId: "1:774856011473:web:96ba4b44d5e4b6b4815ff0"

};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
console.log("✅ Firebase inicializado correctamente");

const messaging = getMessaging(app);

// Obtener el token del dispositivo
export const requestPermissionAndGetToken = async () => {
  try {
    const permission = await Notification.requestPermission();
    console.log("🔔 Permiso de notificación:", permission);

    if (permission === "granted") {
      const token = await getToken(messaging, {
        vapidKey: "BFZaPG_e0iR-7mXvHFE1WdH96O0Vm8u8BLmKIB3NJHR6bLv9EDEkpThs261f2WjcKFjkL9ZxlhBKNOCKCG91BaY", // ✅ sin espacio
      });

      if (token) {
        console.log("🔥 Token FCM:", token);
      } else {
        console.warn("⚠️ No se pudo obtener el token. Verifica la VAPID key y permisos.");
      }

      return token;
    } else {
      console.warn("🚫 Permiso de notificación denegado");
    }
  } catch (error) {
    console.error("❌ Error al obtener token FCM:", error);
  }
};

// Escuchar mensajes cuando la app está abierta
onMessage(messaging, (payload) => {
  console.log("📨 Mensaje recibido:", payload);
});
