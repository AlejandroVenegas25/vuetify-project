// firebase-messaging-sw.js

importScripts("https://www.gstatic.com/firebasejs/9.6.11/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.6.11/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyCkUarq94e_jv9Z6ez3M9ud5550d0dqUCQ",
  authDomain: "notificaciones-87789.firebaseapp.com",
  projectId: "notificaciones-87789",
  storageBucket: "notificaciones-87789.appspot.com",
  messagingSenderId: "774856011473",
  appId: "1:774856011473:web:96ba4b44d5e4b6b4815ff0"
});

// Obtener instancia de messaging
const messaging = firebase.messaging();

// Escuchar notificaciones cuando la app está cerrada o en segundo plano
messaging.onBackgroundMessage(function (payload) {
  console.log("📩 Mensaje recibido en segundo plano:", payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/logo.png" // puedes cambiarlo si tienes un ícono
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
