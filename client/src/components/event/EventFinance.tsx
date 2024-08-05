import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { DollarSign, ShoppingBag } from 'lucide-react'
import { formatCurrency } from '@/utils/helpers/formatCurrency'
import { useGetEventById } from '@/hooks/api/useGetEventById'
import ResultMessage from '@/components/ui/resultMessage'
import { Button } from '@/components/ui/button'
import Loading from '@/components/Loading'
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export type FinanceItem = {
  id: number
  financeCategory: 'REVENUE' | 'EXPENSE'
  transactionType: string
  transactionDescription: string
  serviceProvider: string
  estimatedAmount: string
  eventId: string
  actualAmount: string
  updatedAt: string
}

const EventFinances = ({ id }: { id: string }) => {
  const { data, isLoading } = useGetEventById(id)

  if (isLoading) {
    return <Loading />
  }

  const financeData: FinanceItem[] = data.finances

  const totalEstimatedCost =
    financeData.length > 0 &&
    financeData
      .reduce((sum, item) => sum + Number(item.estimatedAmount), 0)
      .toFixed(2)

  const totalActualCost =
    financeData.length > 0 &&
    financeData
      .reduce((sum, item) => sum + Number(item.actualAmount), 0)
      .toFixed(2)

  const totalRevenues =
    financeData.length > 0 &&
    financeData
      .filter((el) => el.financeCategory === 'REVENUE')
      .reduce((sum, item) => sum + Number(item.actualAmount), 0)
      .toFixed(2)

  const totalExpenses =
    financeData.length > 0 &&
    financeData
      .filter((el) => el.financeCategory === 'EXPENSE')
      .reduce((sum, item) => sum + Number(item.actualAmount), 0)
      .toFixed(2)

  const remarks = Math.abs(Number(totalRevenues) - Number(totalExpenses))

  return (
    <div className="relative ml-auto w-full">
      <div className="flex flex-col lg:flex-row gap-2">
        <Card className="relative border w-full lg:w-[20%] rounded-lg overflow-hidden h-max dark:border-neutral-700">
          <h1 className="text-base text-gray-600 uppercase font-semibold bg-gray-50 p-4">
            Ledger
          </h1>

          <div className="h-[1px] bg-gray-200 mb-3" />
          <div className="p-2 px-4">
            <CardContent className="border-t-[1px] py-3 px-0">
              <CardDescription>Estimated Budget:</CardDescription>
              <CardTitle>
                {formatCurrency(Number(data.estimatedExpense))}
              </CardTitle>
            </CardContent>
            <CardContent className="border-t-[1px] py-3 px-0">
              <CardDescription>Total Revenues:</CardDescription>
              <CardTitle>{formatCurrency(Number(totalRevenues))}</CardTitle>
            </CardContent>
            <CardContent className="border-t-[1px] py-3 px-0">
              <CardDescription>Total Expenses:</CardDescription>
              <CardTitle>{formatCurrency(Number(totalExpenses))}</CardTitle>
            </CardContent>
            <CardContent className="border-t-[1px] py-3 px-0">
              <CardDescription>Remarks:</CardDescription>
              <CardTitle
                className={cn('text-green-600', {
                  'text-red-600': remarks > 0,
                })}
              >
                {formatCurrency(remarks)}
              </CardTitle>
            </CardContent>
          </div>
        </Card>

        {financeData && financeData.length > 0 ? (
          <div className="border rounded-lg dark:border-neutral-700 overflow-x-auto h-max">
            <Table className="divide-y divide-gray-200 dark:divide-neutral-700">
              <TableHeader className="bg-gray-50 dark:bg-neutral-700">
                <TableRow>
                  <TableHead className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-400">
                    Finance Category
                  </TableHead>
                  <TableHead className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-400">
                    Transaction Type
                  </TableHead>
                  <TableHead className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-400">
                    Transaction Description
                  </TableHead>
                  <TableHead className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-400">
                    Service Provider
                  </TableHead>
                  <TableHead className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-400">
                    Date of transaction
                  </TableHead>
                  <TableHead className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-400">
                    Estimated Amount
                  </TableHead>
                  <TableHead className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-400">
                    Actual Amount
                  </TableHead>
                  <TableHead className="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase dark:text-neutral-400">
                    Variance
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-200 dark:divide-neutral-700">
                {financeData.map((item: FinanceItem, index: number) => {
                  const variance = Math.abs(
                    Number(item.estimatedAmount) - Number(item.actualAmount)
                  )

                  return (
                    <FinanceRows key={index} item={item} variance={variance} />
                  )
                })}
                <FinanceTotals
                  totalEstimatedCost={Number(totalEstimatedCost)}
                  totalActualCost={Number(totalActualCost)}
                />
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="m-auto">
            <ResultMessage label="No finances to show." />
          </div>
        )}
      </div>
    </div>
  )
}

const FinanceRows = ({
  item,
  variance,
}: {
  item: FinanceItem
  variance: number
}) => {
  return (
    <TableRow>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">
        {item.financeCategory === 'EXPENSE' ? (
          <Button
            type="button"
            variant="destructive"
            className="h-12 w-12 rounded-full"
          >
            <ShoppingBag />
          </Button>
        ) : (
          <Button
            type="button"
            variant="secondary"
            className="h-12 w-12 rounded-full"
          >
            <DollarSign />
          </Button>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">
        {item.transactionType}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">
        {item.transactionDescription}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">
        {item.serviceProvider}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">
        {format(new Date(item.updatedAt), 'MMM dd, hh:mm a')}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">
        {formatCurrency(Number(item.estimatedAmount))}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">
        {formatCurrency(Number(item.actualAmount))}
      </td>
      <td className="px-6 py-4 text-end whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">
        <span
          className={cn('ml-auto text-green-600', {
            'text-red-600': variance < 0,
          })}
        >
          {formatCurrency(variance)}
        </span>
      </td>
    </TableRow>
  )
}

const FinanceTotals = ({
  totalEstimatedCost,
  totalActualCost,
}: {
  totalEstimatedCost: number
  totalActualCost: number
}) => {
  const variance = Math.abs(totalEstimatedCost - totalActualCost)

  return (
    <TableRow>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">
        Total:
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200" />
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200" />
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200" />
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200" />

      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">
        {formatCurrency(totalEstimatedCost)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">
        {formatCurrency(totalActualCost)}
      </td>
      <td className="px-6 py-4 text-end whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">
        <span
          className={cn('ml-auto text-green-600', {
            'text-red-600': variance < 0,
          })}
        >
          {formatCurrency(variance)}
        </span>
      </td>
    </TableRow>
  )
}

export default EventFinances
