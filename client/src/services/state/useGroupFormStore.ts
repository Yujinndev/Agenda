import { EventGroupDetailsValues } from '@/schema/group'
import { create } from 'zustand'

interface EventGroupState {
  formData: EventGroupDetailsValues & {
    creator?: {
      id: string
      firstName: string
      lastName: string
      email: string
    }
  }
  updateFormData: (data: Partial<EventGroupDetailsValues>) => void
  resetFormData: () => void
}

const useGroupFormStore = create<EventGroupState>((set) => ({
  formData: {
    name: '',
    description: '',
    visibility: '',
    joinPermission: '',
    postPermission: '',
    grouprules: [],
    creator: undefined,
  },
  updateFormData: (data) =>
    set((state) => ({
      formData: {
        ...state.formData,
        ...data,
      },
    })),
  resetFormData: () =>
    set({
      formData: {
        name: '',
        description: '',
        visibility: '',
        joinPermission: '',
        postPermission: '',
        grouprules: [],
        creator: undefined,
      },
    }),
}))

export default useGroupFormStore
