import { useFormContext, FieldValues, FieldPath } from 'react-hook-form'
import { Input, InputProps } from './input'
import { Label } from './label'
import FormError from './formError'
import { FormControl, FormField, FormItem } from './form'
import { Textarea } from './textarea'

interface TextFieldCustomProps<TFieldValues extends FieldValues>
  extends Omit<InputProps, 'name'> {
  name: FieldPath<TFieldValues>
  label: string
}

export function TextFieldCustom<TFieldValues extends FieldValues>({
  name,
  label,
  className,
  placeholder = '',
  ...props
}: TextFieldCustomProps<TFieldValues>) {
  const { control, formState } = useFormContext<TFieldValues>()

  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem className={className}>
          <Label className="ubuntu-bold">{label}</Label>
          <FormControl>
            {name !== 'purpose' && name !== 'details' ? (
              <Input
                {...field}
                {...props}
                placeholder={placeholder !== '' ? placeholder : ''}
              />
            ) : (
              <Textarea
                {...field}
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
