import { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { Plus, Trash } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { TextFieldCustom } from '@/components/ui/TextFieldCustom'
import { initialFinanceValues } from '@/components/event/UpdateFinanceDialog'
import { SelectFieldCustom } from '@/components/ui/SelectFieldCustom'
import { EVENT_FORM_CONFIG, SchemaType } from '@/pages/event/NewEvent'
import { FINANCE_CATEGORY, FINANCE_TYPE } from '@/constants/choices'
import useDynamicForm from '@/hooks/useDynamicForm'

const BudgetForm = () => {
  const [activeStep] = useState(2)

  const { form, fieldArrays, handleAppend, handleRemove } = useDynamicForm<
    SchemaType<typeof activeStep>
  >({
    schema: EVENT_FORM_CONFIG[activeStep].schema,
    dynamicFields: [{ name: 'finances', defaultValue: initialFinanceValues }],
    existingForm: useFormContext(),
  })
  const financesInput = fieldArrays.finances

  return (
    <div className="grid gap-4">
      <TextFieldCustom
        name="estimatedExpense"
        label="Estimated Budget"
        type="number"
      />
      <div className="flex flex-col-reverse md:flex-row gap-4">
        <TextFieldCustom
          className="w-full"
          name="price"
          label="Joining Fee / Ticket Price"
          type="number"
        />
        <div className="flex gap-3 items-center md:w-[20%] justify-start">
          <Switch
            className="-mt-1"
            checked={form.watch('price') === '0'}
            onCheckedChange={(checked) => {
              form.setValue('price', checked ? '0' : '')
              form.clearErrors('price')
            }}
          />
          <p className="text-sm text-muted-foreground">Free Event</p>
        </div>
      </div>

      <div className="flex flex-row items-center gap-8 rounded-lg border p-4 px-6">
        <Switch
          disabled={financesInput.fields.length > 1}
          checked={financesInput.fields.length > 0}
          onCheckedChange={(checked) => {
            checked ? handleAppend('finances') : handleRemove('finances', 0)
          }}
        />
        <div className="space-y-0.5">
          <Label className="text-base">Add budget matrix</Label>
          <p className="text-sm text-muted-foreground">
            You can list all the expenses below
          </p>
        </div>
      </div>

      {financesInput.fields.length > 0 && (
        <>
          <div className="w-full flex flex-col rounded-lg">
            <div className="flex justify-between items-center p-0">
              <Label className="ubuntu-bold">List budget/finances below</Label>
              <Button
                type="button"
                className="flex gap-2 my-2 p-0 lg:p-6"
                variant="ghost"
                onClick={() => handleAppend('finances')}
              >
                <Plus />
                <span className="hidden lg:flex">Add new finances</span>
              </Button>
            </div>
          </div>

          <div className="space-y-4 mb-4">
            {financesInput.fields.map((_, index) => (
              <div
                key={index}
                className="grid lg:grid-cols-8 grid-flow-row-dense gap-x-2 bg-slate-50/75 relative rounded-lg px-6 py-4 border-[1px]"
              >
                <Badge className="absolute -top-2 -left-2" variant="secondary">
                  {index + 1}
                </Badge>
                <div className="lg:col-span-2">
                  <SelectFieldCustom
                    placeholder="Finance Category"
                    choices={FINANCE_CATEGORY}
                    name={`finances.${index}.financeCategory`}
                  />
                </div>
                <div className="lg:col-span-2">
                  <SelectFieldCustom
                    placeholder="Transaction Type"
                    choices={FINANCE_TYPE.filter(
                      (type) =>
                        type.category ===
                        form.watch(`finances.${index}.financeCategory`)
                    )}
                    name={`finances.${index}.transactionType`}
                    disabled={!form.watch(`finances.${index}.financeCategory`)}
                  />
                </div>
                <div className="lg:col-span-3 mt-2">
                  <TextFieldCustom
                    placeholder="Transaction Description"
                    name={`finances.${index}.transactionDescription`}
                  />
                </div>
                <div className="lg:col-span-3">
                  <TextFieldCustom
                    placeholder="Service Provider"
                    name={`finances.${index}.serviceProvider`}
                  />
                </div>
                <div className="flex gap-x-2 lg:col-span-4">
                  <TextFieldCustom
                    placeholder="Estimated Amount"
                    className="w-full"
                    name={`finances.${index}.estimatedAmount`}
                    type="number"
                  />
                  <TextFieldCustom
                    placeholder="Actual Amount"
                    className="w-full"
                    name={`finances.${index}.actualAmount`}
                    type="number"
                  />
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  className="w-full h-[80%] p-[10px] lg:m-2 py-3 row-span-12 rounded-md bg-red-400"
                  onClick={() => handleRemove('finances', index)}
                >
                  <Trash className="h-auto w-auto" />
                </Button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default BudgetForm
