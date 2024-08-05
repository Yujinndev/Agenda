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
import { Badge } from '@/components/ui/badge'
import useDynamicForm from '@/hooks/useDynamicForm'
import { usePostEventMutation } from '@/hooks/api/usePostEventMutation'
import useAuth from '@/hooks/useAuth'
import { findFromArrayFields } from '@/utils/helpers/findFromArrayFields'
import { findDuplicatesInFieldArray } from '@/utils/helpers/findDuplicatesFromArrayFields'
import { cn } from '@/lib/utils'

const UpdateFormDialog = ({ id }: { id: string }) => {
  const { auth } = useAuth()
  const { data, isLoading } = useGetEventById(id)
  const { participants, eventHistoryLogs, ...rest } = data
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [errorFields, setErrorFields] = useState<Number[] | undefined>([])

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
  const committeesInput = fieldArrays.committees

  const updateEvent = usePostEventMutation('/api/event/update', {
    onSuccess: () => setIsDialogOpen(false),
    invalidateQueryKey: ['event', id],
  })

  const validateFormHelpers = (values: any) => {
    const startDateTime = new Date(values.startDateTime)
    const endDateTime = new Date(values.endDateTime)
    if (startDateTime > endDateTime) {
      form.setError('startDateTime', {
        message:
          'Start Date & Time of Event cannot be later than the End Date & Time',
      })

      return false
    }

    const { isFound, index } = findFromArrayFields<EventFormValues>({
      form: form,
      match: auth.user!,
      arrayField: 'committees',
      key: 'email',
      message: 'Organizer cannot be a committee',
    })
    if (isFound) {
      setErrorFields([index])
      return false
    }

    setErrorFields([])

    const { hasDuplicates, indeces } = findDuplicatesInFieldArray({
      form,
      arrayField: 'committees',
      key: 'email',
      message:
        'Committees cannot be duplicated! Kindly just edit the other one.',
    })

    if (hasDuplicates) {
      setErrorFields(indeces)
      return false
    }

    setErrorFields([])
    return true
  }

  const onSubmit = (values: EventFormValues) => {
    const isCommitteeValid = validateFormHelpers(values)
    if (!isCommitteeValid) return

    updateEvent.mutate({ ...values, id, saveFlag: 'SAVE_ALL' })
  }

  const handleSaveDraft = async () => {
    let newValues = form.getValues()
    const isDraftValid = await form.trigger('title')
    if (!isDraftValid) return

    const isCommitteeValid = validateFormHelpers(newValues)
    if (!isCommitteeValid) return
    updateEvent.mutate({ ...newValues, id, saveFlag: 'SAVE_DRAFT' })
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="relative grid grid-cols-4 gap-4" variant="secondary">
          <Edit size={20} />
          <span>Edit Details</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[80dvh] md:max-w-[80dvw] lg:max-w-[85dvw] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Edit event</DialogTitle>
          <DialogDescription>
            Make changes to your event here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="h-[1px] w-full bg-green-900" />

        <div className="grid gap-4 max-h-[70vh] overflow-y-auto p-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-3 mb-12"
            >
              <TextFieldCustom name="title" label="Title" />
              <TextFieldCustom
                name="details"
                label="Details"
                fieldType="text-area"
              />
              <TextFieldCustom
                name="purpose"
                label="Purpose"
                fieldType="text-area"
              />
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

                <div className="grid gap-4">
                  {committeesInput.fields.map((field, index) => {
                    const isDuplicated =
                      errorFields!.findIndex((el) => el === index) >= 0

                    return (
                      <FormField
                        key={field.id}
                        control={form.control}
                        name={`committees.${index}.email`}
                        render={({ field }) => (
                          <div
                            // className="relative grid grid-cols-8 lg:grid-cols-11 h-max w-full shrink-0 m-auto gap-2 last:mb-8"
                            className={cn(
                              'grid grid-cols-8 lg:grid-cols-11 grid-flow-row-dense gap-x-2 bg-slate-50/75 relative rounded-lg p-6 pb-2 border-[1px] transition-all duration-500 last:mb-8',
                              {
                                'bg-red-900/5 border-red-900/80': isDuplicated,
                              }
                            )}
                          >
                            <Badge
                              className={cn('absolute -top-2 -left-2', {
                                'bg-red-900 text-white': isDuplicated,
                              })}
                              variant="secondary"
                            >
                              {index + 1}
                            </Badge>
                            <FormItem className="col-span-7 lg:col-span-10 h-full">
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
                              variant="destructive"
                              className="w-full p-[10px] mt-1 rounded-md bg-red-400"
                              onClick={() => handleRemove('committees', index)}
                            >
                              <Trash className="h-auto w-auto" />
                            </Button>
                          </div>
                        )}
                      />
                    )
                  })}
                </div>
              </div>

              <FormError errorField={form.formState.errors.root} />

              <div className="h-[1px] w-full rounded-full bg-gray-400" />
              {form.formState.isDirty && (
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
              )}
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default UpdateFormDialog
