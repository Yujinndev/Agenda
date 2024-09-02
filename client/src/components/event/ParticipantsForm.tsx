import { useState } from 'react'
import { Plus, Trash } from 'lucide-react'
import { useFormContext } from 'react-hook-form'
import { EVENT_FORM_CONFIG, type SchemaType } from '@/pages/event/NewEvent'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
} from '@/components/ui/form'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import FormError from '@/components/ui/formError'
import { TextFieldCustom } from '@/components/ui/TextFieldCustom'
import { SelectFieldCustom } from '@/components/ui/SelectFieldCustom'
import { CATEGORY_CHOICES, EVENT_AUDIENCE } from '@/constants/choices'
import useDynamicForm from '@/hooks/useDynamicForm'
import { useGetUserGroups } from '@/hooks/api/useGetUserGroups'
import MultipleSelector, { Option } from '../ui/multiple-selector'

const ParticipantsForm = () => {
  const [activeStep] = useState(1)
  const { control } = useFormContext()
  const { data, isSuccess } = useGetUserGroups()
  const { form, fieldArrays, handleAppend, handleRemove } = useDynamicForm<
    SchemaType<typeof activeStep>
  >({
    schema: EVENT_FORM_CONFIG[activeStep].schema,
    dynamicFields: [{ name: 'committees', defaultValue: { email: '' } }],
    existingForm: useFormContext(),
  })

  const committeesInput = fieldArrays.committees
  const USER_GROUPS: Option[] =
    isSuccess &&
    data.map((group: any) => ({
      value: group.id,
      label: group.name,
    }))

  const mockSearch = async (value: string): Promise<Option[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const res = USER_GROUPS.filter((group) =>
          group.label.toLowerCase().includes(value.toLowerCase())
        )
        resolve(res)
      }, 500)
    })
  }

  return (
    <div className="grid gap-4">
      <div className="grid lg:grid-cols-3 gap-2 w-full">
        <TextFieldCustom
          name="estimatedAttendees"
          label="Estimated Attendees"
          placeholder="No. of Attendee/s"
          type="number"
        />
        <SelectFieldCustom
          name="category"
          choices={CATEGORY_CHOICES}
          label="Event Category"
          placeholder="What category does this event fall under?"
          className="lg:col-span-2"
        />
      </div>

      <div>
        <SelectFieldCustom
          name="audience"
          onChangeFn={() => form.setValue('groupIDs', [])}
          choices={EVENT_AUDIENCE}
          label="Event Sharing and Privacy"
          placeholder="Who can view this event?"
        />

        {form.watch('audience') === 'USER_GROUP' && (
          <FormField
            control={form.control}
            name="groupIDs"
            // shouldUnregister={true}
            render={({ field }) => (
              <FormItem>
                <Label className="ubuntu-bold">Groups to publish</Label>
                <FormControl>
                  <MultipleSelector
                    {...field}
                    value={form.getValues('groupIDs')}
                    onSearch={async (value) => {
                      const res = await mockSearch(value)
                      return res
                    }}
                    hidePlaceholderWhenSelected
                    hideClearAllButton
                    defaultOptions={USER_GROUPS}
                    placeholder="Select groups where you want to publish this event ..."
                    emptyIndicator={
                      <p className="flex justify-center w-full text-red-500 p-2">
                        No groups.
                      </p>
                    }
                  />
                </FormControl>
                <FormError errorField={form.formState.errors} />
              </FormItem>
            )}
          />
        )}
      </div>

      <FormField
        control={control}
        name="status"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center gap-8 rounded-lg border p-4 px-6">
            <FormControl>
              <Switch
                checked={form.watch('status') === 'FOR_APPROVAL'}
                onCheckedChange={(checked) => {
                  field.onChange(checked ? 'FOR_APPROVAL' : 'UPCOMING')
                  checked
                    ? handleAppend('committees')
                    : handleRemove('committees', 0)
                }}
              />
            </FormControl>
            <div className="space-y-0.5">
              <Label className="text-base">With Approval Process</Label>
              <FormDescription>
                Add committees email and we will send them about the event.
              </FormDescription>
            </div>
          </FormItem>
        )}
      />

      {form.watch('status') === 'FOR_APPROVAL' && (
        <div className="w-full flex flex-col rounded-lg">
          <div className="flex justify-between items-center p-0">
            <Label className="ubuntu-bold">
              Send Request via Email (by order)
            </Label>
            <Button
              type="button"
              className="flex gap-2 my-2 p-0 lg:p-6"
              variant="ghost"
              onClick={() => handleAppend('committees')}
            >
              <Plus /> <span className="hidden lg:flex">Add new committee</span>
            </Button>
          </div>

          <div className="grid gap-2 relative">
            {committeesInput.fields.map((field, index) => (
              <FormField
                key={field.id}
                control={control}
                name={`committees.${index}.email`}
                render={({ field }) => (
                  <div className="relative grid grid-cols-8 h-max w-full shrink-0 m-auto gap-2 last:mb-8">
                    <Badge
                      className="absolute -top-2 -left-2"
                      variant="secondary"
                    >
                      {index + 1}
                    </Badge>
                    <FormItem className="col-span-7 h-full">
                      <FormControl>
                        <Input placeholder="agenda@gmail.com" {...field} />
                      </FormControl>
                      <FormError errorField={field.name} />
                    </FormItem>
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      className="w-full h-[60%] p-[10px] py-3 rounded-md bg-red-400"
                      onClick={() => {
                        if (committeesInput.fields.length === 1) {
                          form.setValue('status', 'UPCOMING')
                        }
                        handleRemove('committees', index)
                      }}
                    >
                      <Trash className="shrink-0" size={18} />
                    </Button>
                  </div>
                )}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ParticipantsForm
