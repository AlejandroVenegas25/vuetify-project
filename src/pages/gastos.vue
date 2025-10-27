<template>
  <v-container>
    <h1 class="mb-4">Gestión de Gastos</h1>

    <v-form @submit.prevent="guardarGasto">
      <v-text-field v-model="nuevoGasto.fecha" label="Fecha" type="date" required></v-text-field>
      <v-text-field v-model="nuevoGasto.monto" label="Monto" type="number" required></v-text-field>
      <v-text-field v-model="nuevoGasto.descripcion" label="Descripción" required></v-text-field>
      <v-btn color="primary" type="submit">{{ editando ? 'Actualizar' : 'Agregar' }}</v-btn>
    </v-form>

    <v-divider class="my-4"></v-divider>

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
        <tr v-for="g in gastos" :key="g.id">
          <td>{{ g.fecha }}</td>
          <td>${{ g.monto }}</td>
          <td>{{ g.descripcion }}</td>
          <td>
            <v-btn color="blue" size="small" @click="editarGasto(g)">Editar</v-btn>
            <v-btn color="red" size="small" @click="eliminarGasto(g.id)">Eliminar</v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

interface Gasto {
  id?: number
  fecha: string
  monto: number
  descripcion: string
}

const gastos = ref<Gasto[]>([])
const nuevoGasto = ref<Gasto>({ fecha: '', monto: 0, descripcion: '' })
const editando = ref(false)
const idEditando = ref<number | null>(null)

const cargarGastos = async () => {
  const res = await axios.get('http://127.0.0.1:8000/api/gastos')
  gastos.value = res.data
}

const guardarGasto = async () => {
  if (editando.value && idEditando.value) {
    await axios.put(`http://127.0.0.1:8000/api/gastos/${idEditando.value}`, nuevoGasto.value)
    editando.value = false
  } else {
    await axios.post('http://127.0.0.1:8000/api/gastos', nuevoGasto.value)
  }
  nuevoGasto.value = { fecha: '', monto: 0, descripcion: '' }
  cargarGastos()
}

const editarGasto = (gasto: Gasto) => {
  nuevoGasto.value = { ...gasto }
  idEditando.value = gasto.id!
  editando.value = true
}

const eliminarGasto = async (id: number) => {
  await axios.delete(`http://127.0.0.1:8000/api/gastos/${id}`)
  cargarGastos()
}

onMounted(() => {
  cargarGastos()
})
</script>
