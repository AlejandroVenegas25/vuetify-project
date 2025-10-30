<template>
  <v-dialog v-model="isOffline" persistent max-width="400" overlay-opacity="0.8">
    <v-card color="error" dark>
      <v-card-title class="text-h6">
        <v-icon left>mdi-wifi-off</v-icon>
        Sin conexión
      </v-card-title>
      <v-card-text>
        Estás trabajando sin conexión a internet. Algunas funciones pueden no estar disponibles.
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const isOffline = ref(!navigator.onLine)

function updateStatus() {
  isOffline.value = !navigator.onLine
}

onMounted(() => {
  window.addEventListener('online', updateStatus)
  window.addEventListener('offline', updateStatus)
})

onBeforeUnmount(() => {
  window.removeEventListener('online', updateStatus)
  window.removeEventListener('offline', updateStatus)
})
</script>
