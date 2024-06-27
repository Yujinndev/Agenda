import { eventGuestPeopleSchema } from '@/schema/event'
import { zodResolver } from '@hookform/resolvers/zod'
import { useFieldArray, useForm } from 'react-hook-form'
import { z } from 'zod'

const useDynamicForm = (initialGuests: { email: string }[] = []) => {
  const form = useForm<z.infer<typeof eventGuestPeopleSchema>>({
    resolver: zodResolver(eventGuestPeopleSchema),
    defaultValues: {
      guests: initialGuests.length > 0 ? initialGuests : [{ email: '' }],
    },
  })

  const onSubmit = (data: z.infer<typeof eventGuestPeopleSchema>) => {
    console.log(data)
  }

  const { control } = form
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: 'guests',
  })

  const handleRemove = (index: number) => {
    form.resetField(`guests.${index}`)
    update(index, { email: '' })
    remove(index)
  }

  const handleAppend = () => {
    append({ email: '' })
  }

  return { form, fields, onSubmit, handleAppend, handleRemove }
}

export default useDynamicForm
