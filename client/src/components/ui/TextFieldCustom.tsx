import { useFormContext, FieldValues, FieldPath } from 'react-hook-form'
import { Input, InputProps } from './input'
import { Label } from './label'
import FormError from './formError'
import { FormControl, FormField, FormItem } from './form'
import { Textarea } from './textarea'
import { cn } from '@/lib/utils'

interface TextFieldCustomProps<TFieldValues extends FieldValues>
  extends Omit<InputProps, 'name'> {
  name: FieldPath<TFieldValues>
  label?: string
}

export function TextFieldCustom<TFieldValues extends FieldValues>({
  name,
  label,
  labelCn,
  className,
  fieldType = 'input',
  placeholder = '',
  ...props
}: TextFieldCustomProps<TFieldValues> & {
  labelCn?: string
  fieldType?: 'input' | 'text-area'
}) {
  const { control, formState } = useFormContext<TFieldValues>()

  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem className={className}>
          {label && (
            <Label className={cn('ubuntu-bold', labelCn)}>{label}</Label>
          )}
          <FormControl>
            {fieldType === 'text-area' ? (
              <Textarea
                {...field}
                className="min-h-32"
                autoComplete="off"
                placeholder={placeholder !== '' ? placeholder : ''}
              />
            ) : (
              <Input
                {...field}
                {...props}
                autoComplete="off"
                placeholder={placeholder !== '' ? placeholder : ''}
              />
            )}
          </FormControl>

          <FormError errorField={formState.errors} />
        </FormItem>
      )}
    />
  )
}
