const STORAGE_KEY = 'offlineExpenses'

// 🔹 Guarda un gasto localmente cuando no hay conexión
export function saveOfflineExpense(expense) {
  const expenses = JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
  expenses.push(expense)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses))
}

// 🔹 Obtiene todos los gastos pendientes
export function getOfflineExpenses() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
}

// 🔹 Elimina los gastos una vez sincronizados
export function clearOfflineExpenses() {
  localStorage.removeItem(STORAGE_KEY)
}
