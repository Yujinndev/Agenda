import useDynamicForm from '@/hooks/useDynamicForm'
import { TextFieldCustom } from '../ui/TextFieldCustom'
import { FormControl, FormField, FormItem } from '../ui/form'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Plus, Trash } from 'lucide-react'
import { useFormContext, useWatch } from 'react-hook-form'
import { Label } from '../ui/label'
import FormError from '../ui/formError'
import useEventFormStore from '@/services/state/useEventFormStore'

const ParticipantsForm = () => {
  const { control } = useFormContext()
  const guests = useWatch({ name: 'guests' }) || []
  const { formData, updateFormData } = useEventFormStore()
  const {
    fields,
    handleAppend,
    handleRemove: handleRemoveFromDynamicForm,
  } = useDynamicForm(formData.guests)

  const onHandleRemove = (index: number) => {
    handleRemoveFromDynamicForm(index)

    // Update Zustand store immediately after removing
    const updatedGuests = [...guests]
    updatedGuests.splice(index, 1)
    updateFormData({ guests: updatedGuests })
  }

  return (
    <div className="grid gap-4">
      <TextFieldCustom
        name="maxAttendees"
        label="Max Attendees"
        placeholder="Number of Maximum Attendee/s"
        type="number"
      />
      <TextFieldCustom name="category" label="Event Category" />

      <div className="w-full flex flex-col rounded-lg">
        <div className="flex justify-between items-center p-0">
          <Label className="text-lg">Invite Guests via Email</Label>
          <Button
            type="button"
            className="flex gap-2 my-2 p-0 lg:p-6"
            variant="ghost"
            onClick={() => handleAppend()}
          >
            <Plus /> <span className="hidden lg:flex">Add new guest</span>
          </Button>
        </div>

        <div className="grid gap-2">
          {fields.map((field, index) => (
            <FormField
              key={field.id}
              control={control}
              name={`guests.${index}.email`}
              render={({ field }) => (
                <div className="grid grid-cols-8 h-max w-full shrink-0 m-auto gap-2 last:mb-8">
                  <FormItem className="col-span-7 h-full">
                    <FormControl>
                      <Input placeholder="agenda@gmail.com" {...field} />
                    </FormControl>
                    <FormError />
                  </FormItem>
                  <Button
                    type="button"
                    onClick={() => {
                      if (fields.length > 1) onHandleRemove(index)
                    }}
                    size="sm"
                    variant="link"
                    className="inline-flex mt-1 p-0"
                  >
                    <Trash className="shrink-0" size={18} />
                  </Button>
                </div>
              )}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default ParticipantsForm
