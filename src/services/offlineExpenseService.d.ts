declare module '@/services/offlineExpenseService' {
    export interface Gasto {
      id?: number
      fecha: string
      monto: number
      descripcion: string
      offline?: boolean
    }
  
    export function saveOfflineExpense(expense: Gasto): void
    export function getOfflineExpenses(): Gasto[]
    export function clearOfflineExpenses(): void
  }
  