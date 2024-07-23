import { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { Plus, Trash } from 'lucide-react'
import useEventFormStore from '@/services/state/useEventFormStore'
import { TextFieldCustom } from '@/components/ui/TextFieldCustom'
import { FormControl, FormField, FormItem } from '@/components/ui/form'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import FormError from '@/components/ui/formError'
import useDynamicForm from '@/hooks/useDynamicForm'
import { SCHEMAS, SchemaType } from '@/pages/event/NewEvent'
import { EventStatus } from '@/schema/event'

const BudgetForm = () => {
  const { formData, updateFormData } = useEventFormStore()
  const isNeedingApproval = formData.status === 'FOR_APPROVAL'
  const [isChecked, setIsChecked] = useState<boolean>(isNeedingApproval)
  const [activeStep] = useState(2)

  const { control, getValues } = useFormContext()
  const { fieldArrays, handleAppend, handleRemove } = useDynamicForm<
    SchemaType<typeof activeStep>
  >({
    schema: SCHEMAS[activeStep],
    dynamicFields: [{ name: 'committees', defaultValue: { email: '' } }],
    existingForm: useFormContext(),
  })

  const committees = fieldArrays.committees

  const onCheckBoxChange = () => {
    setIsChecked((prev) => !prev)

    const estimatedExpense = getValues('estimatedExpense')
    const price = getValues('price')
    let newData

    if (!isChecked) {
      newData = {
        ...formData,
        status: 'FOR_APPROVAL' as EventStatus,
        committees: [{ email: '' }],
        estimatedExpense,
        price,
      }
    } else {
      newData = {
        ...formData,
        status: 'UPCOMING' as EventStatus,
        committees: [],
        estimatedExpense,
        price,
      }
    }

    updateFormData(newData)
  }

  return (
    <div className="grid gap-4">
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

      <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
        <Checkbox checked={isChecked} onCheckedChange={onCheckBoxChange} />
        <div className="space-y-1 leading-none">
          <p>Send Request for approval?</p>
        </div>
      </div>

      {isChecked && (
        <div className="w-full flex flex-col rounded-lg">
          <div className="flex justify-between items-center p-0">
            <Label className="text-lg">Send Request via Email (by order)</Label>
            <Button
              type="button"
              className="flex gap-2 my-2 p-0 lg:p-6"
              variant="ghost"
              onClick={() => handleAppend('committees')}
            >
              <Plus /> <span className="hidden lg:flex">Add new committee</span>
            </Button>
          </div>

          <div className="grid gap-2">
            {committees.fields.map((field, index) => (
              <FormField
                key={field.id}
                control={control}
                name={`committees.${index}.email`}
                render={({ field }) => (
                  <div className="grid grid-cols-8 h-max w-full shrink-0 m-auto gap-2 last:mb-8">
                    <FormItem className="col-span-7 h-full">
                      <FormControl>
                        <Input placeholder="agenda@gmail.com" {...field} />
                      </FormControl>
                      <FormError errorField={field.name} />
                    </FormItem>
                    <Button
                      type="button"
                      onClick={() => {
                        if (committees.fields.length > 1)
                          handleRemove('committees', index)
                      }}
                      size="sm"
                      variant="link"
                      className="inline-flex mt-1 p-0"
                    >
                      <Trash className="shrink-0" size={18} />
                    </Button>
                  </div>
                )}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default BudgetForm