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
        v-model="email"
          hide-details="auto"
          label="Email"
          placeholder="example@gmail.com"
          type="email"
          prepend-inner-icon="mdi-email"
          class="mb-4"
        ></v-text-field>

        <v-text-field
        v-model="password"
          label="Password"
          type="password"
          prepend-inner-icon="mdi-lock"
          class="mb-6"
        ></v-text-field>

        <v-alert
        type="error"
        dismissible
        class="mb-4"
        >
        {{errorMessage}}
        </v-alert>

        <div class="text-center">
          <v-btn
            color="primary"
            block
            :loading="loading"
            @click="login"
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
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from '../config/axios';
import { AxiosError } from 'axios';

const email = ref('');
const password = ref('');

const errorMessage = ref('');

const router = useRouter();

const login = async () => {
  try {
    if (!email.value || !password.value) {
      errorMessage.value = 'Por favor, completa todos los campos';
      return;
    }

    const response = await axios.post('/login', {
      email: email.value,
      password: password.value,
    });

    if(response.data.acceso == "Ok")
    {
      const token = response.data.token;
      localStorage.setItem('token', token);

      await router.push('/home' );
    }else{
      errorMessage.value = response.data.error;
    }
    

    
  } catch (err) {

    
    if (err instanceof AxiosError) {
      if (err.response && err.response.data) {
        errorMessage.value = err.response.data.message || 'Error al iniciar sesión';
      } else {
        errorMessage.value = 'Error de conexión con el servidor.';
      }
    } else {
      errorMessage.value = 'Ocurrió un error inesperado. Inténtalo nuevamente.';
    }
    
  } 
};
</script>
