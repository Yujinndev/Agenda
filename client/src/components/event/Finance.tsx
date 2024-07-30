import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { useQuery } from '@tanstack/react-query'
import React, { useMemo, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table'

interface FinanceProps {
  id: string
}

interface FinanceItem {
  financeCategory: string
  transactionType: string
  transactionDescription: string
  serviceProvider: string
  estimatedAmount: string
  actualAmount: string
  eventId: string
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('fil-ph', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2,
  }).format(value)
}

const isMobile = () => window.innerWidth <= 640

const Finance: React.FC<FinanceProps> = ({ id }) => {
  const axios = useAxiosPrivate()
  const [filter, setFilter] = useState<'EXPENSE' | 'REVENUE' | null>(null)

  const { data: financeData } = useQuery<FinanceItem[]>({
    queryKey: ['eventFinance', id],
    queryFn: async () => {
      const response = await axios.get(`/api/event/me/c/finance/${id}`)
      return response.data
    },
  })

  const calculateTotalAmount = (data: FinanceItem[] = [], category: string) => {
    return Number(
      data
        .filter((el) => el.financeCategory === category)
        .reduce((sum, el) => sum + Number(el.actualAmount), 0)
        .toFixed(2)
    )
  }

  const totalActualAmountOfExpense = (data: FinanceItem[] = []) =>
    calculateTotalAmount(data, 'EXPENSE')
  const totalActualAmountOfRevenue = (data: FinanceItem[] = []) =>
    calculateTotalAmount(data, 'REVENUE')

  const calculateTotalVariance = (data: FinanceItem[] = []) => {
    return totalActualAmountOfExpense(data) - totalActualAmountOfRevenue(data)
  }

  const calculateItemVariance = (data: FinanceItem) => {
    const estimatedAmount = Number(data.estimatedAmount)
    const actualAmount = Number(data.actualAmount)
    return (estimatedAmount - actualAmount).toFixed(2)
  }

  const getVarianceTextColor = (variance: number) => {
    return variance <= 0 ? 'text-green-900' : 'text-red-900'
  }

  const filterCategory = () => {
    setFilter((prevFilter) =>
      prevFilter === 'REVENUE' ? 'EXPENSE' : 'REVENUE'
    )
  }

  const sortedFinanceData = useMemo(() => {
    if (!financeData || !filter) return financeData
    return [...financeData].sort((a, b) => {
      if (a.financeCategory === filter && b.financeCategory !== filter)
        return -1
      if (a.financeCategory !== filter && b.financeCategory === filter) return 1
      return 0
    })
  }, [financeData, filter])

  const renderTableRow = (el: FinanceItem, index: number) => (
    <React.Fragment key={index}>
      <TableRow
        className={`py-4 text-gray-700 flex flex-col md:table-row text-base ${
          index % 2 === 0 ? 'md:bg-slate-200' : ''
        }`}
      >
        {isMobile() ? (
          <>
            <TableCell className="flex justify-between">
              <span className="font-bold">Finance Category</span>
              <span className="mr-4">{el.financeCategory}</span>
            </TableCell>
            <TableCell className="flex justify-between">
              <span className="font-bold">Transaction Type</span>
              <span>{el.transactionType}</span>
            </TableCell>
            <TableCell className="flex justify-between">
              <span className="font-bold">Transaction Description</span>
              <span className="ml-36">{el.transactionDescription}</span>
            </TableCell>
            <TableCell className="flex justify-between">
              <span className="font-bold">Service Provider</span>
              <span>{el.serviceProvider}</span>
            </TableCell>
            <TableCell className="flex justify-between">
              <span className="font-bold">Estimated Amount</span>
              <span>{formatCurrency(parseFloat(el.estimatedAmount))}</span>
            </TableCell>
            <TableCell className="flex justify-between">
              <span className="font-bold">Actual Amount</span>
              <span>{formatCurrency(parseFloat(el.actualAmount))}</span>
            </TableCell>
            <TableCell className="flex justify-between">
              <span className="font-bold">Variance</span>
              <span
                className={`${getVarianceTextColor(
                  Number(calculateItemVariance(el))
                )}`}
              >
                {formatCurrency(parseFloat(calculateItemVariance(el)))}
              </span>
            </TableCell>
          </>
        ) : (
          <>
            <TableCell className="pl-2">{el.financeCategory}</TableCell>
            <TableCell className="pl-2">{el.transactionType}</TableCell>
            <TableCell className="justify-end pr-2">
              {el.transactionDescription}
            </TableCell>
            <TableCell className="pr-2">{el.serviceProvider}</TableCell>
            <TableCell className="text-[14px]">
              {formatCurrency(parseFloat(el.estimatedAmount))}
            </TableCell>
            <TableCell className="text-[14px]">
              {formatCurrency(parseFloat(el.actualAmount))}
            </TableCell>
            <TableCell
              className={`py-4 text-[14px] ${getVarianceTextColor(
                Number(calculateItemVariance(el))
              )}`}
            >
              {formatCurrency(parseFloat(calculateItemVariance(el)))}
            </TableCell>
          </>
        )}
      </TableRow>
      {isMobile() && <hr className="mb-6 border-y-1 border-y-gray-900" />}
    </React.Fragment>
  )

  const renderTotals = () => {
    const totalVariance = calculateTotalVariance(financeData)

    return (
      <>
        <hr className="-mb-6 border-y-2 border-y-gray-600 lg:block hidden" />
        <div className="font-bold text-gray-700 -mt-6 lg:pt-10 text-lg">
          <div className="flex justify-between mb-2">
            <span>Totals:</span>
            <span className="ml-auto">
              {formatCurrency(totalActualAmountOfExpense(financeData))}
            </span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="ml-auto">
              {formatCurrency(totalActualAmountOfRevenue(financeData))}
            </span>
          </div>
          <div className="flex justify-between">
            <span className={`ml-auto ${getVarianceTextColor(totalVariance)}`}>
              {formatCurrency(calculateTotalVariance(financeData))}
            </span>
          </div>
        </div>
      </>
    )
  }

  return (
    <div>
      <Table className="w-full text-left mb-8">
        <TableHeader className="hidden md:table-header-group">
          <TableRow className="text-gray-700 font-bold uppercase py-4 text-[12px] lg:text-sm">
            <TableHead className="pt-6 pr-6 pl-2" onClick={filterCategory}>
              Finance Category
            </TableHead>
            <TableHead className="pt-6 pr-6">Transaction Type</TableHead>
            <TableHead className="pt-6 pr-6">Transaction Description</TableHead>
            <TableHead className="pt-6 pr-6">Service Provider</TableHead>
            <TableHead className="pt-6 pr-6">Estimated Amount</TableHead>
            <TableHead className="pt-6 pr-6">Actual Amount</TableHead>
            <TableHead className="pt-6 pr-6">Variance</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="font-[550]">
          {sortedFinanceData && sortedFinanceData.length > 0 ? (
            sortedFinanceData.map(renderTableRow)
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-4">
                No finance data available
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {sortedFinanceData && sortedFinanceData.length > 0 && renderTotals()}
    </div>
  )
}

export default Finance
