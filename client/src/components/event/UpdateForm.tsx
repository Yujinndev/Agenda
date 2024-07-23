import { useState } from 'react'
import { format } from 'date-fns'
import { Edit, Plus, Trash } from 'lucide-react'
import { eventFormSchema, EventFormValues } from '@/schema/event'
import { useGetEventById } from '@/hooks/api/useGetEventById'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import Loading from '@/components/Loading'
import { TextFieldCustom } from '@/components/ui/TextFieldCustom'
import { FormControl, FormField, FormItem } from '@/components/ui/form'
import { SelectFieldCustom } from '@/components/ui/SelectFieldCustom'
import { CATEGORY_CHOICES, EVENT_AUDIENCE } from '@/constants/choices'
import FormError from '@/components/ui/formError'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import useDynamicForm from '@/hooks/useDynamicForm'
import { usePostEventMutation } from '@/hooks/api/usePostEventMutation'

const UpdateFormDialog = ({ id }: { id: string }) => {
  const { data, isLoading } = useGetEventById(id)
  const { participants, eventHistoryLogs, ...rest } = data
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  if (isLoading) {
    return <Loading />
  }

  const startDateTime = data.startDateTime
    ? format(new Date(data.startDateTime), 'yyyy-MM-dd HH:mm')
    : undefined
  const endDateTime = data.endDateTime
    ? format(new Date(data.endDateTime), 'yyyy-MM-dd HH:mm')
    : undefined

  const { form, fieldArrays, handleAppend, handleRemove } =
    useDynamicForm<EventFormValues>({
      schema: eventFormSchema,
      dynamicFields: [{ name: 'committees', defaultValue: { email: '' } }],
      formOptions: {
        defaultValues: {
          ...rest,
          estimatedAttendees:
            data.estimatedAttendees && data.estimatedAttendees.toString(),
          committees: data.committees,
          startDateTime,
          endDateTime,
        },
      },
    })

  const updateEvent = usePostEventMutation('/api/event/update', {
    onSuccess: () => setIsDialogOpen(false),
    invalidateQueryKey: ['event', id],
  })

  const onSubmit = (values: any) => {
    updateEvent.mutate({ ...values, id, saveFlag: 'SAVE_ALL' })
  }

  const handleSaveDraft = async () => {
    let newValues = form.getValues()
    const isDraftValid = await form.trigger('title')
    if (!isDraftValid) return

    updateEvent.mutate({ ...newValues, id, saveFlag: 'SAVE_DRAFT' })
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="relative grid grid-cols-4 gap-4" variant="secondary">
          <Edit size={20} />
          <span>Edit / Revise</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[725px]">
        <DialogHeader>
          <DialogTitle>Edit event</DialogTitle>
          <DialogDescription>
            Make changes to your event here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="h-[1px] w-full bg-green-900" />

        <div className="grid gap-4 h-[60vh] overflow-y-auto p-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              <TextFieldCustom name="title" label="Title" />
              <TextFieldCustom name="details" label="Details" />
              <TextFieldCustom name="purpose" label="Purpose" />
              <div className="grid lg:grid-cols-2 gap-4">
                <TextFieldCustom
                  name="startDateTime"
                  label="Start Date & Time of Event"
                  type="datetime-local"
                />
                <TextFieldCustom
                  name="endDateTime"
                  label="End Date & Time of Event"
                  type="datetime-local"
                />
              </div>
              <TextFieldCustom name="location" label="Venue Location" />
              <div className="grid lg:grid-cols-3 gap-4">
                <TextFieldCustom
                  name="estimatedExpense"
                  label="Estimated Expenses"
                  type="number"
                />
                <TextFieldCustom
                  name="price"
                  label="Joining Fee / Ticket Price"
                  type="number"
                />
                <TextFieldCustom
                  name="estimatedAttendees"
                  label="Estimated Attendees"
                  type="number"
                />
              </div>
              <div className="grid lg:grid-cols-2 gap-4">
                <SelectFieldCustom
                  choices={CATEGORY_CHOICES}
                  name="category"
                  label="Event Category"
                />
                <SelectFieldCustom
                  choices={EVENT_AUDIENCE}
                  name="audience"
                  label="Event Sharing and Privacy"
                />
              </div>

              <div className="w-full flex flex-col rounded-lg">
                <div className="flex justify-between items-center p-0">
                  <Label className="ubuntu-bold">Event Committees</Label>
                  <Button
                    type="button"
                    className="flex gap-2 my-2 p-0 lg:p-6"
                    variant="ghost"
                    onClick={() => handleAppend('committees')}
                  >
                    <Plus />{' '}
                    <span className="hidden lg:flex">Add new committee</span>
                  </Button>
                </div>

                <div className="grid gap-2">
                  {fieldArrays.committees.fields.map((field, index) => (
                    <FormField
                      key={field.id}
                      control={form.control}
                      name={`committees.${index}.email`}
                      render={({ field }) => (
                        <div className="grid grid-cols-8 h-max w-full shrink-0 m-auto gap-2 last:mb-8">
                          <FormItem className="col-span-7 h-full">
                            <FormControl>
                              <Input
                                placeholder="agenda@gmail.com"
                                {...field}
                              />
                            </FormControl>
                            <FormError errorField={field.name} />
                          </FormItem>
                          <Button
                            type="button"
                            onClick={() => handleRemove('committees', index)}
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

              <div className="h-[1px] w-full rounded-full bg-gray-400" />

              <DialogFooter className="gap-y-2">
                <Button
                  onClick={() => handleSaveDraft()}
                  disabled={updateEvent.isPending}
                  type="button"
                  variant="outline"
                >
                  Save Draft
                </Button>
                <Button
                  type="submit"
                  className="px-8 w-full"
                  disabled={updateEvent.isPending}
                >
                  Finalize Event
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default UpdateFormDialog
