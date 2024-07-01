import { cn } from '@/lib/utils'

const Loading = () => {
  return (
    <div className=" flex min-h-[90vh] flex-col items-center justify-center">
      <LoadingSpinner />
      <h1 className="pt-4 font-mono">Loading ..</h1>
    </div>
  )
}

const LoadingSpinner = ({
  className,
}: {
  className?: React.HTMLAttributes<HTMLDivElement>
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="154"
      height="154"
      viewBox="0 0 24 24"
      fill="none"
      stroke="green"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('animate-spin', className)}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  )
}
export default Loading
