<template>
  <v-container fluid class="fill-height d-flex align-center justify-center bg-grey-lighten-4">
    <v-card
      class="pa-6"
      elevation="12"
      max-width="400"
      rounded="xl"
    >
      <v-card-item>
        <v-card-title class="text-h5 font-weight-bold text-center">
          Inicio de Sesión
        </v-card-title>
        <v-card-subtitle class="text-center">
          Bienvenido, ingresa tus credenciales
        </v-card-subtitle>
      </v-card-item>

      <v-card-text>
        <v-text-field
          hide-details="auto"
          label="Email"
          placeholder="example@gmail.com"
          type="email"
          prepend-inner-icon="mdi-email"
          class="mb-4"
        ></v-text-field>

        <v-text-field
          label="Password"
          type="password"
          prepend-inner-icon="mdi-lock"
          class="mb-6"
        ></v-text-field>

        <div class="text-center">
          <v-btn
            color="primary"
            block
            :loading="loading"
            @click="loading = !loading"
          >
            Ingresar

            <template v-slot:loader>
              <v-progress-linear
                indeterminate
                color="white"
              ></v-progress-linear>
            </template>
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const loading = ref(false)
</script>
