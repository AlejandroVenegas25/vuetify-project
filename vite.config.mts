// vite.config.mts

// Plugins
import Components from 'unplugin-vue-components/vite'
import Vue from '@vitejs/plugin-vue'
import Vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
import Fonts from 'unplugin-fonts/vite'
import VueRouter from 'unplugin-vue-router/vite'
// Importación del plugin para Progressive Web App (PWA)
import { VitePWA } from 'vite-plugin-pwa' 

// Utilities
import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    VueRouter({
      dts: 'src/typed-router.d.ts',
    }),
    Vue({
      template: { transformAssetUrls },
    }),
    // https://github.com/vuetifyjs/vuetify-loader/tree/master/packages/vite-plugin#readme
    Vuetify({
      autoImport: true,
      styles: {
        configFile: 'src/styles/settings.scss',
      },
    }),
    Components({
      dts: 'src/components.d.ts',
    }),
    Fonts({
      fontsource: {
        families: [
          {
            name: 'Roboto',
            weights: [100, 300, 400, 500, 700, 900],
            styles: ['normal', 'italic'],
          },
        ],
      },
    }),
    
    // ===============================================
    //               CONFIGURACIÓN PWA
    // ===============================================
    VitePWA({
      // Define la estrategia de registro del Service Worker
      // 'autoUpdate' intentará actualizar automáticamente la caché.
      registerType: 'autoUpdate', 
      
      // Opciones para el Manifiesto (Web App Manifest)
      manifest: {
        name: 'Mi Proyecto Vuetify PWA', // <<-- ¡Personaliza el nombre de tu app!
        short_name: 'VuetifyApp',       // Nombre corto para el icono de inicio
        description: 'Una Progressive Web App con Vuetify y Vite.',
        theme_color: '#1976D2', // Color de la barra de herramientas del navegador (puedes usar el color primario de Vuetify)
        icons: [
          // ¡Asegúrate de tener estos archivos PNG en tu carpeta 'public'!
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable', // Icono para cumplir con los requisitos de Android
          },
        ],
        // Opcional: Define la orientación predeterminada de la aplicación
        // orientation: 'portrait', 
        display: 'standalone', // Hace que la app se abra sin la interfaz del navegador
      },
      
      // Opciones para Workbox (la herramienta que genera el Service Worker)
      workbox: {
        // Patrones de archivos a precachear (cachear al instalar la PWA)
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json,woff2,ttf,eot}'],
        // Necesario para las Single Page Applications (SPA) como Vue Router
        navigateFallback: 'index.html',
        // Asegura que el nuevo Service Worker tome control inmediatamente
        skipWaiting: true,
        clientsClaim: true,
      },

      // Opcional: Descomenta para probar el Service Worker en modo de desarrollo (npm run dev)
      // devOptions: {
      //   enabled: true
      // }
    }),
    // ===============================================
  ],
  optimizeDeps: {
    exclude: [
      'vuetify',
      'vue-router',
      'unplugin-vue-router/runtime',
      'unplugin-vue-router/data-loaders',
      'unplugin-vue-router/data-loaders/basic',
    ],
  },
  define: { 'process.env': {} },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('src', import.meta.url)),
    },
    extensions: [
      '.js',
      '.json',
      '.jsx',
      '.mjs',
      '.ts',
      '.tsx',
      '.vue',
    ],
  },
  server: {
    port: 3000,
  },
})