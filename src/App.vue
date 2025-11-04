<template>
  <v-app>
    <v-main>
      <OfflineDialog />
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import OfflineDialog from './components/OfflineDialog.vue';
import { onMounted } from "vue";
import { requestPermissionAndGetToken } from "./firebase";

onMounted(async () => {
  const token = await requestPermissionAndGetToken();
  console.log("Token de Firebase:", token);

  // Aquí podrías enviarlo a tu backend con axios:
  // await axios.post("https://tu-api.com/api/register-token", { token });
});
  //
</script>
