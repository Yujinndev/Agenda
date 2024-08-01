import { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { Plus, Trash } from 'lucide-react'
import { FormControl, FormField, FormItem } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import FormError from '@/components/ui/formError'
import useDynamicForm from '@/hooks/useDynamicForm'
import { eventGroupRulesSchema, eventGroupSchema } from '@/schema/group'
import { z } from 'zod'

export const SCHEMAS = [eventGroupSchema, eventGroupRulesSchema]

export type SchemaArray = typeof SCHEMAS
export type SchemaType<T extends number> = z.infer<SchemaArray[T]>

const CreateGroupRules = () => {
  const [activeStep] = useState(1)

  const { control, getValues } = useFormContext()
  const { fieldArrays, handleAppend, handleRemove } = useDynamicForm<
    SchemaType<typeof activeStep>
  >({
    schema: SCHEMAS[activeStep],
    dynamicFields: [{ name: 'grouprules', defaultValue: { rules: '' } }],
    existingForm: useFormContext(),
  })

  const rules = fieldArrays.grouprules

  return (
    <div className="grid gap-4">
      <div className="w-full flex flex-col rounded-lg">
        <div className="flex justify-between items-center p-0">
          <Label className="text-lg">Create Group Rules</Label>
          <Button
            type="button"
            className="flex gap-2 my-2 p-0 lg:p-6"
            variant="ghost"
            onClick={() => handleAppend('grouprules')}
          >
            <Plus /> <span className="hidden lg:flex">Add new rule</span>
          </Button>
        </div>

        <div className="grid gap-2">
          {rules.fields.map((field, index) => (
            <FormField
              key={field.id}
              control={control}
              name={`grouprules.${index}.rules`}
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
                    onClick={() => {
                      if (rules.fields.length > 1)
                        handleRemove('grouprules', index)
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
    </div>
  )
}

export default CreateGroupRules
