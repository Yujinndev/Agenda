import { useFormContext } from 'react-hook-form'
import { Label } from './label'
import FormError from './formError'
import { FormControl, FormField, FormItem } from './form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './select'
import { cn } from '@/lib/utils'

type Choice = {
  value: string
  label: string
  type?: string
}

type TextFieldCustomProps = {
  name: string
  choices: Choice[]
  label?: string
  labelCn?: string
  className?: string
  placeholder?: string
  disabled?: boolean
}

export function SelectFieldCustom({
  name,
  label,
  labelCn,
  className,
  choices,
  placeholder = '',
  disabled = false,
}: TextFieldCustomProps) {
  const { control, formState } = useFormContext()

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <Label className={cn('ubuntu-bold', labelCn)}>{label}</Label>
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
            disabled={disabled}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {choices.map((choice) => (
                <SelectItem key={choice.value} value={choice.value}>
                  {choice.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormError errorField={formState.errors} />
        </FormItem>
      )}
    />
  )
}
