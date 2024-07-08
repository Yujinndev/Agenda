import { eventCommitteeSchema } from '@/schema/event'
import { zodResolver } from '@hookform/resolvers/zod'
import { useFieldArray, useForm } from 'react-hook-form'
import { z } from 'zod'

const useDynamicForm = (initialGuests: { email: string }[] = []) => {
  const form = useForm<z.infer<typeof eventCommitteeSchema>>({
    resolver: zodResolver(eventCommitteeSchema),
    defaultValues: {
      committee: initialGuests.length > 0 ? initialGuests : [{ email: '' }],
    },
  })

  const onSubmit = (data: z.infer<typeof eventCommitteeSchema>) => {
    console.log(data)
  }

  const { control } = form
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: 'committee',
  })

  const handleRemove = (index: number) => {
    form.resetField(`committee.${index}.email`)
    update(index, { email: '' })
    remove(index)
  }

  const handleAppend = () => {
    append({ email: '' })
  }

  return { form, fields, onSubmit, handleAppend, handleRemove }
}

export default useDynamicForm
