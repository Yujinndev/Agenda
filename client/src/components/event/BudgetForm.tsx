import { useFormContext } from 'react-hook-form'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import { TextFieldCustom } from '../ui/TextFieldCustom'
import useEventFormStore from '@/services/state/useEventFormStore'
import { useState } from 'react'

const BudgetForm = () => {
  const { formData, updateFormData } = useEventFormStore()
  const isNeedingApproval = formData.status === 'FOR_APPROVAL'
  const [isChecked, setIsChecked] = useState<boolean>(isNeedingApproval)

  const onCheckBoxChange = () => {
    setIsChecked((prev) => !prev)

    let newData

    if (!isChecked) {
      newData = { ...formData, status: 'FOR_APPROVAL' }
    } else {
      newData = { ...formData, status: 'UPCOMING' }
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
          <small>Request for approval?</small>
        </div>
      </div>
    </div>
  )
}

export default BudgetForm
