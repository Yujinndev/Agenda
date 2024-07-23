export interface Participant {
  email: string
  eventId?: string
  name?: string
}

export interface FinanceProps {
  id?: string
  eventId: string
  financeCategory: FinanceCategory
  transactionType: ExpenseType
  transactionDescription: string
  serviceProvider: string
  estimatedAmount: string
  actualAmount: string
}

enum FinanceCategory {
  REVENUE = 'REVENUE',
  EXPENSE = 'EXPENSE',
}

enum ExpenseType {
  SALARIES = 'SALARIES',
  RENT = 'RENT',
  UTILITIES = 'UTILITIES',
  SUPPLIES = 'SUPPLIES',
  MARKETING = 'MARKETING',
  TRAVEL = 'TRAVEL',
  MISCELLANEOUS = 'MISCELLANEOUS',
  SPONSORSHIP = 'SPONSORSHIP',
  SALES = 'SALES',
  ADVERTISING = 'ADVERTISING',
  OTHERS = 'OTHERS',
}
