import { EventFormValues } from '@/schema/event'
import { create } from 'zustand'

interface FormState {
  formData: EventFormValues
  updateFormData: (newData: Partial<EventFormValues>) => void
  resetFormData: () => void
}

const useEventFormStore = create<FormState>((set) => ({
  formData: {
    title: '',
    purpose: '',
    startDateTime: '',
    endDateTime: '',
    location: '',
    maxAttendees: '',
    guests: [],
    category: 'PUBLIC',
    maxBudget: '',
    status: 'UPCOMING',
  },
  updateFormData: (newData) =>
    set((state) => ({
      formData: {
        ...state.formData,
        ...newData,
      },
    })),
  resetFormData: () =>
    set({
      formData: {
        title: '',
        purpose: '',
        startDateTime: '',
        endDateTime: '',
        location: '',
        maxAttendees: '',
        guests: [],
        category: 'PUBLIC',
        maxBudget: '',
        status: 'UPCOMING',
      },
    }),
}))

export default useEventFormStore
