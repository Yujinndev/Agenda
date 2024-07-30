export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('fil-ph', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2,
  }).format(value)
}
