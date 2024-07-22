import { FaExclamation } from 'react-icons/fa6'
import { Button } from './button'
import { CheckCheckIcon } from 'lucide-react'

type ResultMessageProps = {
  label: string
  variant?: 'failed' | 'success'
}

const ResultMessage = ({ label, variant = 'failed' }: ResultMessageProps) => {
  return (
    <div className="flex flex-col items-center justify-center text-center pt-12 gap-8 text-lg">
      <Button variant="secondary" className="p-8 rounded-full h-28 w-28">
        {variant === 'failed' ? (
          <FaExclamation size={60} />
        ) : (
          <CheckCheckIcon size={60} color="green" />
        )}
      </Button>
      {label}
    </div>
  )
}

export default ResultMessage
