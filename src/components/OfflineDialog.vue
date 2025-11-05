<template>
  <v-dialog v-model="mostrar" max-width="400">
    <v-card>
      <v-card-title class="headline">Sin conexión</v-card-title>
      <v-card-text>
        ⚠️ No tienes conexión a Internet. Tu información se guardará localmente.
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="cerrarAviso">Aceptar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const mostrar = ref(!navigator.onLine)

const cerrarAviso = () => {
  mostrar.value = false
}

const actualizarConexion = () => {
  if (!navigator.onLine) {
    mostrar.value = true
  } else {
    mostrar.value = false
  }
}

onMounted(() => {
  window.addEventListener('online', actualizarConexion)
  window.addEventListener('offline', actualizarConexion)
})

onUnmounted(() => {
  window.removeEventListener('online', actualizarConexion)
  window.removeEventListener('offline', actualizarConexion)
})
</script>
