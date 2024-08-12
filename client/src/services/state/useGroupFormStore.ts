import { GroupFormValues } from '@/schema/group'
import { create } from 'zustand'

interface EventGroupState {
  formData: GroupFormValues
  updateFormData: (data: Partial<GroupFormValues>) => void
  resetFormData: () => void
}

const initialData: GroupFormValues = {
  name: '',
  description: '',
  visibility: '',
  joinPermission: '',
  postPermission: '',
  groupRules: [],
  creator: undefined,
}

const useGroupFormStore = create<EventGroupState>((set) => ({
  formData: initialData,
  updateFormData: (data) =>
    set((state) => ({
      formData: {
        ...state.formData,
        ...data,
      },
    })),
  resetFormData: () =>
    set({
      formData: initialData,
    }),
}))

export default useGroupFormStore
