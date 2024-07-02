import { TextFieldCustom } from '../ui/TextFieldCustom'

const BudgetForm = () => {
  return (
    <div className="grid gap-4">
      <TextFieldCustom
        name="estimatedExpense"
        label="Estimated Expenses"
        type="number"
      />
      <TextFieldCustom
        name="price"
        label="Joining Fee / Ticket Price"
        type="number"
      />
    </div>
  )
}

export default BudgetForm
