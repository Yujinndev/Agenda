import { EventFormValues } from '@/schema/event'
import { create } from 'zustand'

interface FormState {
  formData: EventFormValues
  updateFormData: (newData: Partial<EventFormValues>) => void
  resetFormData: () => void
}

const initialData: EventFormValues = {
  title: '',
  details: '',
  purpose: '',
  startDateTime: '',
  endDateTime: '',
  location: '',
  estimatedAttendees: '',
  category: '',
  audience: '',
  price: '',
  committees: [],
  finances: [],
  estimatedExpense: '',
  status: 'UPCOMING',
}

const useEventFormStore = create<FormState>((set) => ({
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

export default useEventFormStore
