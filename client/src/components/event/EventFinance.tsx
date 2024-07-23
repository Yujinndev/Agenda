import { useGetEventById } from '@/hooks/api/useGetEventById'
import { EventFinanceFormValues, eventFinanceSchema } from '@/schema/finance'
import { Button } from '../ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useState } from 'react'
import { TextFieldCustom } from '../ui/TextFieldCustom'
import { FormProvider, useFormContext } from 'react-hook-form'
import { Minus, Plus } from 'lucide-react'
import {
  EXPENSE_FINANCE_TYPE,
  FINANCE_CATEGORY,
  REVENUE_FINANCE_TYPE,
} from '@/constants/choices'
import { SelectFieldCustom } from '../ui/SelectFieldCustom'
import { DialogDescription } from '@radix-ui/react-dialog'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { toast } from '../ui/use-toast'
import { QueryClient, useMutation } from '@tanstack/react-query'
import Finance from '@/components/event/Finance'
import useDynamicForm from '@/hooks/useDynamicForm'

const EventFinance = ({ id }: { id: string }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { data } = useGetEventById(id)
  const queryClient = new QueryClient()
  const axios = useAxiosPrivate()

  const initialFinanceField = {
    eventId: id,
    financeCategory: '',
    transactionType: '',
    transactionDescription: '',
    serviceProvider: '',
    estimatedAmount: '',
    actualAmount: '',
  }

  const { fieldArrays, handleAppend, handleRemove, form } =
    useDynamicForm<EventFinanceFormValues>({
      schema: eventFinanceSchema,
      dynamicFields: [{ name: 'finance', defaultValue: initialFinanceField }],
    })

  const financeFields = fieldArrays.finance

  const createBudgetMatrix = useMutation({
    mutationFn: async (data: any) => {
      await axios.post('/api/event/me/c/finance', {
        data: {
          ...data,
        },
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event', id] })
      toast({
        description: 'Your budget matrix has been created.',
        variant: 'success',
      })

      form.reset()
      setIsDialogOpen(false)
      window.location.reload()
    },
    onError: (error: any) => {
      console.log(error)
      toast({
        description: 'Failed to create budget matrix.',
        variant: 'destructive',
      })
    },
  })

  const onSubmit = (data: any) => {
    console.log('Created:', data)
    createBudgetMatrix.mutate(data)
  }

  return (
    <div className="relative ml-auto">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogDescription></DialogDescription>
        <DialogTrigger asChild>
          <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
            Create Budget Matrix
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Budget Matrix</DialogTitle>
          </DialogHeader>
          <div className="col-span-3 relative p-8 py-4 lg:pt-8 z-10">
            <FormProvider {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <Table>
                  <TableCaption>A list of your budget matrix.</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Finance Category</TableHead>
                      <TableHead>Transaction Type</TableHead>
                      <TableHead>Transaction Description</TableHead>
                      <TableHead>Service Provider</TableHead>
                      <TableHead>Estimated Amount</TableHead>
                      <TableHead>Actual Amount</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {financeFields.fields.map((field, index) => (
                      <TableRow key={field.id}>
                        <TableCell className="hidden">
                          <TextFieldCustom
                            label=""
                            name={`finance.${index}.eventId`}
                            type="text"
                          />
                        </TableCell>
                        <TableCell>
                          <SelectFieldCustom
                            choices={FINANCE_CATEGORY}
                            name={`finance.${index}.financeCategory`}
                            label=""
                            className="lg:col-span-2"
                          />
                        </TableCell>
                        <TableCell>
                          <FinanceCategory index={index} />
                        </TableCell>
                        <TableCell>
                          <TextFieldCustom
                            name={`finance.${index}.transactionDescription`}
                            label=""
                            type="text"
                            placeholder="Renting the hotel"
                          />
                        </TableCell>
                        <TableCell>
                          <TextFieldCustom
                            name={`finance.${index}.serviceProvider`}
                            label=""
                            type="text"
                            placeholder="Agenda Hotel Co."
                          />
                        </TableCell>
                        <TableCell>
                          <TextFieldCustom
                            name={`finance.${index}.estimatedAmount`}
                            label=""
                            type="number"
                            placeholder="10000"
                          />
                        </TableCell>
                        <TableCell>
                          <TextFieldCustom
                            name={`finance.${index}.actualAmount`}
                            label=""
                            type="number"
                            placeholder="20000"
                          />
                        </TableCell>
                        <TableCell className="flex mt-5">
                          <Plus onClick={() => handleAppend('finance')} />
                          <Minus
                            onClick={() => {
                              if (financeFields.fields.length > 1)
                                handleRemove('finance', index)
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="flex justify-center gap-4 my-6 relative lg:absolute lg:bottom-0 lg:right-8">
                  <Button type="submit" className="px-8 w-full">
                    Create
                  </Button>
                </div>
              </form>
            </FormProvider>
          </div>
        </DialogContent>
      </Dialog>
      <Finance data={data} />
    </div>
  )
}

const FinanceCategory = ({ index }: { index: number }) => {
  const { watch } = useFormContext()
  const financeCategory = watch(`finance.${index}.financeCategory`)

  return (
    <SelectFieldCustom
      choices={
        financeCategory === 'REVENUE'
          ? REVENUE_FINANCE_TYPE
          : EXPENSE_FINANCE_TYPE
      }
      name={`finance.${index}.transactionType`}
      label=""
      className="lg:col-span-2"
      disabled={financeCategory === ''}
    />
  )
}

export default EventFinance
