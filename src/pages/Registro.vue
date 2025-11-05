<template>
  <v-container fluid class="fill-height d-flex align-center justify-center bg-grey-lighten-4">
    <v-card class="pa-6" elevation="12" max-width="400" rounded="xl">
      <v-card-item>
        <v-card-title class="text-h5 font-weight-bold text-center">
          Registro de Usuario
        </v-card-title>
        <v-card-subtitle class="text-center">
          Crea tu cuenta para continuar
        </v-card-subtitle>
      </v-card-item>

      <v-card-text>
        <v-text-field
          v-model="nombre"
          label="Nombre completo"
          prepend-inner-icon="mdi-account"
          class="mb-4"
        />

        <v-text-field
          v-model="correo"
          label="Correo electrónico"
          type="email"
          prepend-inner-icon="mdi-email"
          class="mb-4"
        />

        <v-text-field
          v-model="contrasena"
          label="Contraseña"
          type="password"
          prepend-inner-icon="mdi-lock"
          class="mb-6"
        />

        <v-alert
          v-if="mensajeError"
          type="error"
          dismissible
          class="mb-4"
        >
          {{ mensajeError }}
        </v-alert>

        <div class="text-center mb-3">
          <v-btn
            color="primary"
            block
            :loading="cargando"
            :disabled="cargando"
            @click="registrar"
          >
            Registrar
          </v-btn>
        </div>

        <div class="text-center">
          <v-btn
            variant="text"
            color="secondary"
            block
            @click="volverLogin"
          >
            Volver al inicio de sesión
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from '../config/axios'

const nombre = ref('')
const correo = ref('')
const contrasena = ref('')
const mensajeError = ref('')
const cargando = ref(false)
const router = useRouter()

const registrar = async () => {
  mensajeError.value = ''
  cargando.value = true

  try {
    // Validar campos vacíos
    if (!nombre.value || !correo.value || !contrasena.value) {
      mensajeError.value = 'Por favor, completa todos los campos'
      return
    }

    // Petición a Laravel (ruta corregida con /api/)
    const response = await axios.post('/register', {
      name: nombre.value,
      email: correo.value,
      password: contrasena.value,
    })

    console.log('✅ Respuesta del servidor:', response.data)

    // Éxito en registro
    if (response.status === 200 || response.data.success) {
      router.push('/')
    } else {
      mensajeError.value =
        response.data.error || 'No se pudo registrar el usuario.'
    }
  } catch (error: any) {
    if (error.response) {
      mensajeError.value =
        error.response.data.message || 'Error en el registro.'
    } else {
      mensajeError.value = 'Error de conexión o del servidor.'
    }
  } finally {
    cargando.value = false
  }
}

const volverLogin = () => {
  router.push('/')
}
</script>
