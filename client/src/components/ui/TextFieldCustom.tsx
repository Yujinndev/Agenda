import { cn } from '@/lib/utils'
import { Label } from '@/components/ui/label'
import FormError from '@/components/ui/formError'
import { Textarea } from '@/components/ui/textarea'
import { Input, InputProps } from '@/components/ui/input'
import { FormControl, FormField, FormItem } from '@/components/ui/form'
import { useFormContext, FieldValues, FieldPath } from 'react-hook-form'

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
