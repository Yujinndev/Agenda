import { FieldValues, Path, UseFormReturn } from 'react-hook-form'

type FindDuplicatesInFieldArrayProps<T extends FieldValues> = {
  form: UseFormReturn<T>
  arrayField: Path<T>
  key: string
  message: string
}

export const findDuplicatesInFieldArray = <T extends FieldValues>({
  form,
  arrayField,
  key,
  message,
}: FindDuplicatesInFieldArrayProps<T>) => {
  const values = form.getValues(arrayField) as any[]
  const seenValues = new Map<any, number[]>()
  let hasDuplicates = false
  let indeces: number[] = []
  let ids: number[] = []

  values.forEach((value, index) => {
    const keyValue = value[key].toString().replace(/\s+/g, '').toLowerCase()

    if (seenValues.has(keyValue)) {
      hasDuplicates = true
      seenValues.get(keyValue)!.push(index)

      seenValues.get(keyValue)!.forEach((duplicateIndex) => {
        indeces.push(duplicateIndex)
        indeces.push(duplicateIndex)
        form.setError('root', {
          message,
        })
        form.setFocus(`${arrayField}.${duplicateIndex}.${key}` as any)
      })
    } else {
      seenValues.set(keyValue, [index])
    }
  })

  return { hasDuplicates, indeces, ids }
}
