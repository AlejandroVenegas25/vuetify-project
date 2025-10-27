<template>
  <v-card>
    <v-layout>
      <v-app-bar color="primary">
        <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

        <v-toolbar-title>My files</v-toolbar-title>

        <template v-if="$vuetify.display.mdAndUp">
          <v-btn icon="mdi-magnify" variant="text"></v-btn>
          <v-btn icon="mdi-filter" variant="text"></v-btn>
        </template>

        <v-btn icon="mdi-dots-vertical" variant="text"></v-btn>
      </v-app-bar>

      <v-navigation-drawer
        v-model="drawer"
        :location="$vuetify.display.mobile ? 'bottom' : undefined"
        temporary
      >
        <v-list>
          <v-list-item
            v-for="item in items"
            :key="item.title"
            :to="item.to"
            link
            :title="item.title"
            :prepend-icon="item.icon"
          ></v-list-item>
        </v-list>
      </v-navigation-drawer>

      <v-main style="height: 500px;">
        <v-card-text>
          The navigation drawer will appear from the bottom on smaller size screens.
        </v-card-text>
      </v-main>
    </v-layout>
  </v-card>
</template>

<script setup>
import { ref, watch } from 'vue'

const drawer = ref(false)
const group = ref(null)

const items = [
  { title: 'Inicio', to: '/', icon: 'mdi-home' },
  { title: 'Gastos', to: '/gastos', icon: 'mdi-cash' }, // 🔹 Nuevo botón
  { title: 'Foo', to: '/foo', icon: 'mdi-file' },
  { title: 'Bar', to: '/bar', icon: 'mdi-folder' },
  { title: 'Fizz', to: '/fizz', icon: 'mdi-account' },
  { title: 'Buzz', to: '/buzz', icon: 'mdi-settings' },
]

watch(group, () => {
  drawer.value = false
})
</script>
