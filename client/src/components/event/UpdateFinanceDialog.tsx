import { useState } from 'react'
import { Plus, Trash } from 'lucide-react'
import { FaMoneyBills } from 'react-icons/fa6'
import { FormProvider } from 'react-hook-form'
import { QueryClient, useMutation } from '@tanstack/react-query'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog'
import { SelectFieldCustom } from '@/components/ui/SelectFieldCustom'
import { TextFieldCustom } from '@/components/ui/TextFieldCustom'
import { toast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'
import { FINANCE_CATEGORY, FINANCE_TYPE } from '@/constants/choices'
import { useGetEventById } from '@/hooks/api/useGetEventById'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import useDynamicForm from '@/hooks/useDynamicForm'
import { EventFinanceFormValues, eventFinanceSchema } from '@/schema/event'
import { Badge } from '../ui/badge'
import { findDuplicatesInFieldArray } from '@/utils/helpers/findDuplicatesFromArrayFields'
import { cn } from '@/lib/utils'
import FormError from '../ui/formError'

export const initialFinanceValues = {
  eventId: '',
  financeCategory: '',
  transactionType: '',
  transactionDescription: '',
  serviceProvider: '',
  estimatedAmount: '',
  actualAmount: '',
}

const UpdateFinanceDialog = ({ id }: { id: string }) => {
  const { data, isSuccess } = useGetEventById(id)
  const { finances: existingFinances }: EventFinanceFormValues =
    isSuccess && data
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [duplicateFields, setDuplicateFields] = useState<Number[] | undefined>(
    []
  )
  const queryClient = new QueryClient()
  const axios = useAxiosPrivate()

  const { form, fieldArrays, handleAppend, handleRemove } =
    useDynamicForm<EventFinanceFormValues>({
      schema: eventFinanceSchema,
      dynamicFields: [
        {
          name: 'finances',
          defaultValue: { ...initialFinanceValues, eventId: id },
        },
      ],
      formOptions: {
        defaultValues: {
          finances:
            existingFinances.length > 0
              ? existingFinances
              : [{ ...initialFinanceValues, eventId: id }],
        },
      },
    })

  const financesInput = fieldArrays.finances

  const updateFinances = useMutation({
    mutationFn: async (data: any) => {
      await axios.post('/api/event/finance/update', {
        data: {
          ...data,
        },
      })
    },
    onSuccess: () => {
      toast({
        description: 'Your budget matrix has been created.',
        variant: 'success',
      })

      form.reset()
      setIsDialogOpen(false)

      return queryClient.invalidateQueries({
        queryKey: ['event', id],
        refetchType: 'all',
      })
    },
    onError: (error: any) => {
      console.log(error)
      toast({
        description: 'Failed to create budget matrix.',
        variant: 'destructive',
      })
    },
  })

  const onSubmit = (values: EventFinanceFormValues) => {
    const { hasDuplicates, indeces } = findDuplicatesInFieldArray({
      form,
      arrayField: 'finances',
      key: 'transactionDescription',
      message:
        'Transaction Description cannot be duplicated! Kindly just edit the other one.',
    })

    if (hasDuplicates) {
      setDuplicateFields(indeces)
      return
    }

    setDuplicateFields([])
    updateFinances.mutate(values)
  }

  const handleOnRemove = (index: number) => {
    if (duplicateFields?.includes(index)) {
      setDuplicateFields([])
      form.clearErrors('root')
    }

    handleRemove('finances', index)
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="relative grid grid-cols-4 gap-4" variant="secondary">
          <FaMoneyBills size={20} />
          <span>Edit Finances</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80dvh] md:max-w-[80dvw] lg:max-w-[85dvw] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Budget Matrix</DialogTitle>
          <DialogDescription>A list of your budget matrix.</DialogDescription>
        </DialogHeader>
        <div className="h-[1px] w-full bg-green-900" />

        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="lg:grid lg:grid-cols-10 hidden gap-4 p-4 relative font-bold">
              <div>Finance Category</div>
              <div className="col-span-2">Transaction Type</div>
              <div className="col-span-2">Transaction Description</div>
              <div className="col-span-2">Service Provider</div>
              <div>Estimated Amount</div>
              <div>Actual Amount</div>
              <div className="text-center">Actions</div>
            </div>

            <div className="grid gap-4 max-h-[60vh] overflow-y-auto p-4">
              <div className="space-y-4 mb-4">
                {financesInput.fields.map((field, index) => {
                  const isDuplicated =
                    duplicateFields!.findIndex((el) => el === index) >= 0

                  return (
                    <div
                      key={field.id}
                      className={cn(
                        'grid lg:grid-cols-10 grid-flow-row-dense gap-x-2 bg-slate-50/75 relative rounded-lg p-6 pb-2 border-[1px] transition-all duration-500',
                        {
                          'bg-red-900/5 border-red-900/80': isDuplicated,
                        }
                      )}
                    >
                      <Badge
                        className={cn('absolute -top-2 -left-2', {
                          'bg-red-900 text-white': isDuplicated,
                        })}
                        variant="secondary"
                      >
                        {index + 1}
                      </Badge>
                      <div>
                        <SelectFieldCustom
                          placeholder="Finance Category"
                          choices={FINANCE_CATEGORY}
                          className="-mt-2"
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
                          className="-mt-2"
                          name={`finances.${index}.transactionType`}
                          disabled={
                            !form.watch(`finances.${index}.financeCategory`)
                          }
                        />
                      </div>
                      <div className="lg:col-span-2">
                        <TextFieldCustom
                          placeholder="Transaction Description"
                          name={`finances.${index}.transactionDescription`}
                        />
                      </div>
                      <div className="lg:col-span-2">
                        <TextFieldCustom
                          placeholder="Service Provider"
                          name={`finances.${index}.serviceProvider`}
                        />
                      </div>
                      <div className="flex gap-x-2 lg:col-span-2">
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
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="destructive"
                          className="w-full p-[10px] lg:mt-1 lg:ms-4 py-3 row-span-12 rounded-md bg-red-400"
                          onClick={() => handleOnRemove(index)}
                        >
                          <Trash className="h-auto w-auto" />
                        </Button>
                        {financesInput.fields.length - 1 === index && (
                          <Button
                            type="button"
                            variant="secondary"
                            className="w-full p-[10px] lg:mt-1 py-3 row-span-12 rounded-md"
                            onClick={() => handleAppend('finances')}
                          >
                            <Plus className="h-auto w-auto" />
                          </Button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>

              <FormError errorField={form.formState.errors.root} />

              <div className="h-[1px] w-full bg-green-900 my-4" />

              {form.formState.isDirty && (
                <div className="flex flex-col-reverse lg:flex-row justify-between lg:justify-end gap-4 relative">
                  <DialogClose className="px-16" asChild>
                    <Button
                      variant="secondary"
                      onClick={() => {
                        form.clearErrors('root')
                        setDuplicateFields([])
                      }}
                    >
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button
                    type="submit"
                    className="px-16"
                    disabled={updateFinances.isPending}
                  >
                    Update Finances
                  </Button>
                </div>
              )}
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}

export default UpdateFinanceDialog
