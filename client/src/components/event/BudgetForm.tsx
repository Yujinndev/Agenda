import { TextFieldCustom } from '../ui/TextFieldCustom'

const BudgetForm = () => {
  return (
    <div className="grid gap-4">
      <TextFieldCustom
        name="maxBudget"
        label="Max Budget"
        type="number"
        placeholder="20000"
      />
    </div>
  )
}

export default BudgetForm
