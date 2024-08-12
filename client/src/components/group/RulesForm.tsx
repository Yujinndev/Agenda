import { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { Plus, Trash } from 'lucide-react'
import { FormControl, FormField, FormItem } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import FormError from '@/components/ui/formError'
import useDynamicForm from '@/hooks/useDynamicForm'
import { GROUP_FORM_CONFIG, SchemaType } from '@/pages/group/NewGroup'

const RulesForm = () => {
  const [activeStep] = useState(1)

  const { form, fieldArrays, handleAppend, handleRemove } = useDynamicForm<
    SchemaType<typeof activeStep>
  >({
    schema: GROUP_FORM_CONFIG[activeStep].schema,
    dynamicFields: [{ name: 'groupRules', defaultValue: { rules: '' } }],
    existingForm: useFormContext(),
  })

  const rules = fieldArrays.groupRules

  return (
    <div className="grid gap-4">
      <div className="w-full flex flex-col rounded-lg">
        <div className="flex justify-between items-center p-0">
          <Label className="text-lg">Create Group Rules</Label>
          <Button
            type="button"
            className="flex gap-2 my-2 p-0 lg:p-6"
            variant="ghost"
            onClick={() => handleAppend('groupRules')}
          >
            <Plus /> <span className="hidden lg:flex">Add new rule</span>
          </Button>
        </div>

        <div className="grid gap-2">
          {rules.fields.map((field, index) => (
            <FormField
              key={field.id}
              control={form.control}
              name={`groupRules.${index}.rules`}
              render={({ field }) => (
                <div className="grid grid-cols-8 h-max w-full shrink-0 m-auto gap-2 last:mb-8">
                  <FormItem className="col-span-7 h-full">
                    <FormControl>
                      <Input placeholder="Respect each other." {...field} />
                    </FormControl>
                    <FormError errorField={field.name} />
                  </FormItem>
                  <Button
                    type="button"
                    onClick={() => handleRemove('groupRules', index)}
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
    </div>
  )
}

export default RulesForm
