import React, { useMemo } from 'react'

interface FinanceProps {
  data: {
    finance: FinanceItem[]
  }
}

interface FinanceItem {
  financeCategory: string
  transactionType: string
  transactionDescription: string
  serviceProvider: string
  estimatedAmount: string
  actualAmount: string
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('fil-ph', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2,
  }).format(value)
}

const isMobile = () => window.innerWidth <= 640

const Finance: React.FC<FinanceProps> = ({ data }) => {
  const financeData = data?.finance

  const logAmounts = (data: FinanceItem[]) => {
    data.forEach((item) => {
      console.log(
        `Estimated Amount: ${item.estimatedAmount}, Actual Amount: ${item.actualAmount}`
      )
    })
  }

  if (financeData && financeData.length > 0) {
    logAmounts(financeData)
  }

  const totalEstimatedCost = (data: FinanceItem[]) => {
    return data
      .reduce((sum, el) => sum + Number(el.estimatedAmount), 0)
      .toFixed(2)
  }

  const totalActualCost = (data: FinanceItem[]) => {
    return data.reduce((sum, el) => sum + Number(el.actualAmount), 0).toFixed(2)
  }

  const calculateVariance = (data: FinanceItem[]) => {
    const estimatedAmount = Number(totalEstimatedCost(data))
    const actualAmount = Number(totalActualCost(data))
    return Math.abs(estimatedAmount - actualAmount)
  }

  const calculateItemVariance = (data: FinanceItem) => {
    const estimatedAmount = Number(data.estimatedAmount)
    const actualAmount = Number(data.actualAmount)
    return (estimatedAmount - actualAmount).toFixed(2)
  }

  const getVarianceTextColor = (variance: number) => {
    return variance >= 0 ? 'text-green-900' : 'text-red-900'
  }

  const estimatedCost = useMemo(
    () => parseFloat(totalEstimatedCost(financeData)),
    [financeData]
  )
  const actualCost = useMemo(
    () => parseFloat(totalActualCost(financeData)),
    [financeData]
  )
  const variance = useMemo(() => calculateVariance(financeData), [financeData])

  const renderTableRow = (el: FinanceItem, index: number) => (
    <React.Fragment key={index}>
      <tr
        className={`py-4 text-gray-700 flex flex-col md:table-row text-base gap-4 ${
          index % 2 === 0 ? 'md:bg-slate-200' : ''
        }`}
      >
        {isMobile() ? (
          <>
            <td className="flex justify-between">
              <span className="font-bold">Finance Category</span>
              <span>{el.financeCategory}</span>
            </td>
            <td className="flex justify-between">
              <span className="font-bold">Transaction Type</span>
              <span>{el.transactionType}</span>
            </td>
            <td className="flex justify-between">
              <span className="font-bold">Transaction Description</span>
              <span className="ml-36">{el.transactionDescription}</span>
            </td>
            <td className="flex justify-between">
              <span className="font-bold">Service Provider</span>
              <span>{el.serviceProvider}</span>
            </td>
            <td className="flex justify-between">
              <span className="font-bold">Estimated Amount</span>
              <span>{formatCurrency(parseFloat(el.estimatedAmount))}</span>
            </td>
            <td className="flex justify-between">
              <span className="font-bold">Actual Amount</span>
              <span>{formatCurrency(parseFloat(el.actualAmount))}</span>
            </td>
            <td className="flex justify-between">
              <span className="font-bold">Variance</span>
              <span
                className={`${getVarianceTextColor(
                  Number(calculateItemVariance(el))
                )}`}
              >
                {formatCurrency(parseFloat(calculateItemVariance(el)))}
              </span>
            </td>
          </>
        ) : (
          <>
            <td className="pl-2">{el.financeCategory}</td>
            <td className="pl-2">{el.transactionType}</td>
            <td className="justify-end pr-2">{el.transactionDescription}</td>
            <td className="pr-2">{el.serviceProvider}</td>
            <td className="text-[14px]">
              {formatCurrency(parseFloat(el.estimatedAmount))}
            </td>
            <td className="text-[14px]">
              {formatCurrency(parseFloat(el.actualAmount))}
            </td>
            <td
              className={`py-4 text-[14px] ${getVarianceTextColor(
                Number(calculateItemVariance(el))
              )}`}
            >
              {formatCurrency(parseFloat(calculateItemVariance(el)))}
            </td>
          </>
        )}
      </tr>
      {isMobile() && <hr className="mb-6 border-y-1 border-y-gray-900" />}
    </React.Fragment>
  )

  const renderTotals = () => (
    <>
      <hr className="-mb-6 border-y-2 border-y-gray-600 lg:block hidden" />
      <div className="font-bold text-gray-700 -mt-6 lg:pt-10 text-lg">
        <div className="flex justify-between mb-2">
          <span>Totals:</span>
          <span className="ml-auto">{formatCurrency(estimatedCost)}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="ml-auto">{formatCurrency(actualCost)}</span>
        </div>
        <div className="flex justify-between">
          <span className={`ml-auto ${getVarianceTextColor(variance)}`}>
            {formatCurrency(variance)}
          </span>
        </div>
      </div>
    </>
  )

  return (
    <div>
      <table className="w-full text-left mb-8">
        <thead className="hidden md:table-header-group">
          <tr className="text-gray-700 font-bold uppercase py-4 text-[12px] lg:text-base">
            <th className="pt-6 pr-6 pl-2">Finance Category</th>
            <th className="pt-6 pr-6">Transaction Type</th>
            <th className="pt-6 pr-6">Transaction Description</th>
            <th className="pt-6 pr-6">Service Provider</th>
            <th className="pt-6 pr-6">Estimated Amount</th>
            <th className="pt-6 pr-6">Actual Amount</th>
            <th className="pt-6 pr-6">Variance</th>
          </tr>
        </thead>
        <tbody className="font-[550]">
          {financeData && financeData.length > 0 ? (
            financeData.map(renderTableRow)
          ) : (
            <tr>
              <td colSpan={7} className="text-center py-4">
                No finance data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {financeData && financeData.length > 0 && renderTotals()}
    </div>
  )
}

export default Finance
