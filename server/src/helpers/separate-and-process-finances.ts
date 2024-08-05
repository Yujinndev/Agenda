import { Decimal } from '@prisma/client/runtime/library'
import { Finances } from '../services/event/update-event-finances-service'

type ProcessedFinances = {
  toCreate: Finances[]
  toUpdate: Finances[]
  toRemove: Finances[]
  unchanged: Finances[]
  duplicateDescriptions: string[]
}

export const processFinances = (
  newValues: Finances[],
  existingValues: Finances[],
): ProcessedFinances => {
  const result: ProcessedFinances = {
    toCreate: [],
    toUpdate: [],
    toRemove: [],
    unchanged: [],
    duplicateDescriptions: [],
  }

  const descriptionSet = new Set<string>()
  const existingFinanceMap = new Map(
    existingValues.map((f) => [f.transactionDescription, f]),
  )

  for (const newValue of newValues) {
    if (descriptionSet.has(newValue.transactionDescription)) {
      result.duplicateDescriptions.push(newValue.transactionDescription)
      continue
    }

    descriptionSet.add(newValue.transactionDescription)

    const values = {
      ...newValue,
      estimatedAmount: parsedDecimalValue(newValue.estimatedAmount),
      actualAmount: parsedDecimalValue(newValue.actualAmount),
    }

    const existingFinance = existingFinanceMap.get(
      newValue.transactionDescription,
    )

    if (!existingFinance) {
      result.toCreate.push(values)
    } else if (isFinanceUpdated(values, existingFinance)) {
      result.toUpdate.push({
        ...values,
        id: existingFinance.id,
      })
    } else {
      result.unchanged.push(existingFinance)
    }

    existingFinanceMap.delete(newValue.transactionDescription)
  }

  result.toRemove = Array.from(existingFinanceMap.values())
  return result
}

export const parsedDecimalValue = (value: any) => {
  return value?.toString() !== '' ? new Decimal(value) : new Decimal(0)
}

export const isFinanceUpdated = (
  newValues: Finances,
  existingValues: Finances,
): boolean => {
  const keysToCompare: (keyof Finances)[] = [
    'financeCategory',
    'transactionType',
    'serviceProvider',
    'estimatedAmount',
    'actualAmount',
  ]

  return keysToCompare.some(
    (key) => newValues[key]?.toString() !== existingValues[key]?.toString(),
  )
}
