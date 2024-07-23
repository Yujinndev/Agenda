import { FinanceFormValues } from '@/schema/finance'
import { create } from 'zustand'

interface FormState {
  formData: FinanceFormValues
  updateFormData: (newData: Partial<FinanceFormValues>) => void
  resetFormData: () => void
}

const initialData: FinanceFormValues = {
  eventId: '',
  financeCategory: '',
  transactionType: '',
  transactionDescription: '',
  serviceProvider: '',
  estimatedAmount: '',
  actualAmount: '',
}

const useFinanceFormStore = create<FormState>((set) => ({
  formData: initialData,
  updateFormData: (newData) =>
    set((state) => ({
      formData: {
        ...state.formData,
        ...newData,
      },
    })),
  resetFormData: () =>
    set({
      formData: initialData,
    }),
}))

export default useFinanceFormStore
