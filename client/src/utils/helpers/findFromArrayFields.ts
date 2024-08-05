import { FieldValues, Path, UseFormReturn } from 'react-hook-form'

type FindFromArrayFieldsProps<T extends FieldValues> = {
  form: UseFormReturn<T>
  match: string
  arrayField: Path<T>
  key: string
  message: string
}

export const findFromArrayFields = <T extends FieldValues>({
  form,
  match,
  arrayField,
  key,
  message,
}: FindFromArrayFieldsProps<T>) => {
  const values = form.getValues(arrayField)
  const index = values.findIndex(
    (value: any) => value[key as keyof typeof value] === match
  )

  let isFound = false
  if (index >= 0) {
    form.setError(`${arrayField}.${index}.${key}` as any, {
      message,
    })

    isFound = true
  }

  return { isFound, index }
}
