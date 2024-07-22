import { zodResolver } from '@hookform/resolvers/zod'
import {
  useFieldArray,
  useForm,
  UseFormReturn,
  FieldValues,
  UseFormProps,
  ArrayPath,
  FieldArray,
  UseFieldArrayReturn,
} from 'react-hook-form'
import { z } from 'zod'

type DynamicFieldConfig<T extends FieldValues> = {
  name: ArrayPath<T>
  defaultValue: any
}

type UseDynamicFormOptions<T extends FieldValues> = {
  schema: z.ZodType<T>
  dynamicFields: DynamicFieldConfig<T>[]
  existingForm?: UseFormReturn<T>
  formOptions?: UseFormProps<T>
}

type FieldArrays<T extends FieldValues> = {
  [K in ArrayPath<T>]: UseFieldArrayReturn<T, K, 'id'>
}

const useDynamicForm = <T extends FieldValues>({
  schema,
  dynamicFields,
  existingForm,
  formOptions = {},
}: UseDynamicFormOptions<T>) => {
  const form =
    existingForm ||
    useForm<T>({
      resolver: zodResolver(schema),
      mode: 'onChange',
      defaultValues: {
        ...dynamicFields.reduce((acc, field) => {
          acc[field.name] = [field.defaultValue] as any
          return acc
        }, {} as Partial<T>),
        ...formOptions.defaultValues,
      },
      ...formOptions,
    })

  const { control } = form

  const fieldArrays = dynamicFields.reduce((acc, field) => {
    acc[field.name] = useFieldArray({
      control,
      name: field.name,
    })
    return acc
  }, {} as FieldArrays<T>)

  const handleAppend = (fieldName: ArrayPath<T>) => {
    const fieldArray = fieldArrays[fieldName]
    const defaultValue = dynamicFields.find(
      (f) => f.name === fieldName
    )?.defaultValue
    if (fieldArray && defaultValue) {
      fieldArray.append(defaultValue as FieldArray<T, ArrayPath<T>>)
    }
  }

  const handleRemove = (fieldName: ArrayPath<T>, index: number) => {
    const fieldArray = fieldArrays[fieldName]
    if (fieldArray) {
      fieldArray.remove(index)
    }
  }

  return { form, fieldArrays, handleAppend, handleRemove }
}

export default useDynamicForm
