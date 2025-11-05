<template>
  <v-container>
    <h1 class="mb-4">Gestión de Gastos</h1>

    <v-form @submit.prevent="guardarGasto">
      <v-text-field
        v-model="nuevoGasto.fecha"
        label="Fecha"
        type="date"
        required
      ></v-text-field>

      <v-text-field
        v-model="nuevoGasto.monto"
        label="Monto"
        type="number"
        required
      ></v-text-field>

      <v-text-field
        v-model="nuevoGasto.descripcion"
        label="Descripción"
        required
      ></v-text-field>

      <v-btn color="primary" type="submit">
        {{ editando ? 'Actualizar' : 'Agregar' }}
      </v-btn>
    </v-form>

    <v-divider class="my-4"></v-divider>

    <!-- ⚠️ Aviso de desconexión -->
    <v-alert
      v-if="mostrarAvisoOffline"
      type="warning"
      class="mb-4"
    >
      ⚠️ Estás sin conexión. Los gastos se guardarán localmente.
    </v-alert>

    <!-- ✅ Aviso de reconexión -->
    <v-alert
      v-if="mostrarAvisoOnline"
      type="success"
      class="mb-4"
    >
      ✅ Conexión restaurada. Sincronizando gastos...
    </v-alert>

    <v-table>
      <thead>
        <tr>
          <th>Fecha</th>
          <th>Monto</th>
          <th>Descripción</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="g in gastos" :key="g.id ?? g.descripcion">
          <td>{{ g.fecha }}</td>
          <td>${{ g.monto }}</td>
          <td>
            {{ g.descripcion }}
            <v-chip
              v-if="g.offline"
              color="orange"
              size="x-small"
              class="ml-2"
            >
              Offline
            </v-chip>
          </td>
          <td>
            <v-btn color="blue" size="small" @click="editarGasto(g)">
              Editar
            </v-btn>
            <v-btn color="red" size="small" @click="eliminarGasto(g.id!)">
              Eliminar
            </v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'
import axios from 'axios'
import {
  saveOfflineExpense,
  getOfflineExpenses,
  clearOfflineExpenses,
  type Gasto,
} from '@/services/offlineExpenseService'

const gastos = ref<Gasto[]>([])
const nuevoGasto = ref<Gasto>({ fecha: '', monto: 0, descripcion: '' })
const editando = ref(false)
const idEditando = ref<number | null>(null)
const estaEnLinea = ref(navigator.onLine)
const mostrarAvisoOffline = ref(false)
const mostrarAvisoOnline = ref(false)
const avisoMostrado = ref(false) // 🔸 nuevo: evita que el aviso offline salga repetido

// 🔹 Cargar gastos desde la API o localStorage
const cargarGastos = async () => {
  if (estaEnLinea.value) {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/gastos')
      gastos.value = res.data
    } catch (e) {
      console.warn('Error al obtener gastos del servidor.')
      gastos.value = getOfflineExpenses().map((g: Gasto) => ({
        ...g,
        offline: true,
      }))
    }
  } else {
    gastos.value = getOfflineExpenses().map((g: Gasto) => ({
      ...g,
      offline: true,
    }))
  }
}

// 🔹 Guardar un nuevo gasto
const guardarGasto = async () => {
  try {
    if (editando.value && idEditando.value) {
      if (estaEnLinea.value) {
        await axios.put(
          `http://127.0.0.1:8000/api/gastos/${idEditando.value}`,
          nuevoGasto.value
        )
      } else {
        saveOfflineExpense({ ...nuevoGasto.value, id: idEditando.value })
      }
      editando.value = false
    } else {
      if (estaEnLinea.value) {
        await axios.post('http://127.0.0.1:8000/api/gastos', nuevoGasto.value)
      } else {
        // 🔸 Guarda localmente si no hay conexión
        saveOfflineExpense({ ...nuevoGasto.value })
      }
    }

    nuevoGasto.value = { fecha: '', monto: 0, descripcion: '' }
    cargarGastos()
  } catch (error) {
    console.error('Error al guardar gasto:', error)
  }
}

// 🔹 Editar gasto existente
const editarGasto = (gasto: Gasto) => {
  nuevoGasto.value = { ...gasto }
  idEditando.value = gasto.id!
  editando.value = true
}

// 🔹 Eliminar gasto
const eliminarGasto = async (id: number) => {
  if (estaEnLinea.value) {
    await axios.delete(`http://127.0.0.1:8000/api/gastos/${id}`)
  } else {
    const offline = getOfflineExpenses().filter((g: Gasto) => g.id !== id)
    localStorage.setItem('offlineExpenses', JSON.stringify(offline))
  }
  cargarGastos()
}

// 🔹 Sincronizar gastos cuando vuelve la conexión
const sincronizarGastos = async () => {
  const offline = getOfflineExpenses()
  if (offline.length > 0) {
    for (const g of offline) {
      await axios.post('http://127.0.0.1:8000/api/gastos', g)
    }
    clearOfflineExpenses()
  }
  cargarGastos()
}

// 🔹 Detectar cambios de conexión
const actualizarEstadoConexion = () => {
  const estabaEnLinea = estaEnLinea.value
  estaEnLinea.value = navigator.onLine

  // Si se pierde la conexión
  if (!estaEnLinea.value && estabaEnLinea) {
    if (!avisoMostrado.value) {
      mostrarAvisoOffline.value = true
      avisoMostrado.value = true // solo una vez por desconexión
    }
    mostrarAvisoOnline.value = false
  }

  // Si vuelve la conexión
  if (estaEnLinea.value && !estabaEnLinea) {
    mostrarAvisoOffline.value = false
    mostrarAvisoOnline.value = true
    avisoMostrado.value = false // permite mostrar de nuevo si se vuelve a desconectar
    sincronizarGastos()

    // 🔸 Oculta el aviso verde automáticamente
    setTimeout(() => {
      mostrarAvisoOnline.value = false
    }, 5000)
  }
}

onMounted(() => {
  cargarGastos()
  window.addEventListener('online', actualizarEstadoConexion)
  window.addEventListener('offline', actualizarEstadoConexion)
})

onUnmounted(() => {
  window.removeEventListener('online', actualizarEstadoConexion)
  window.removeEventListener('offline', actualizarEstadoConexion)
})
</script>
