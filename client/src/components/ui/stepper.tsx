import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'
import React from 'react'

const Stepper = ({
  steps,
  activeStep,
}: {
  steps: string[]
  activeStep: number
}) => {
  return (
    <nav className="pb-12 lg:pb-4 md:py-6 lg:pt-0" aria-label="Progress">
      <ol
        role="list"
        className="space-y-4 flex justify-between items-center md:space-x-8 md:space-y-0 relative"
      >
        {steps.map((step, index) => (
          <React.Fragment key={step}>
            <li className="hidden md:block md:flex-1 ubuntu-bold">
              <div
                className={cn(
                  'group flex w-full flex-col border-l-4 border-gray-300 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4',
                  {
                    'border-amber-300': activeStep >= index,
                  }
                )}
              >
                <div
                  className={cn(
                    'rounded-full flex items-center justify-center bg-gray-300 h-6 w-6',
                    {
                      'bg-amber-300': activeStep >= index,
                    }
                  )}
                >
                  {activeStep <= index ? (
                    <p className="pt-1">{index + 1}</p>
                  ) : (
                    <Check size={16} />
                  )}
                </div>
                <span
                  className={cn(
                    'text pt-2 text-gray-300 font-medium line-clamp-1',
                    {
                      'text-amber-300': activeStep >= index,
                    }
                  )}
                >
                  {step}
                </span>
              </div>
            </li>

            <div className="md:hidden w-full h-1 absolute bg-white" />
            <li
              key={step}
              className="md:hidden md:flex-1 ubuntu-bold relative z-50 space-y-3"
            >
              <div
                className={cn(
                  'rounded-full h-12 w-12 flex items-center justify-center bg-gray-300',
                  {
                    'bg-amber-300': activeStep >= index,
                  }
                )}
              >
                {activeStep <= index ? (
                  <p className="pt-0">{index + 1}</p>
                ) : (
                  <Check size={16} />
                )}
              </div>
              {activeStep >= index && (
                <span
                  className={cn(
                    'absolute text-sm text-center text-balance text-amber-300 font-medium',
                    {
                      '-inset-x-4': index === 1,
                    }
                  )}
                >
                  {step}
                </span>
              )}
            </li>
          </React.Fragment>
        ))}
      </ol>
    </nav>
  )
}

export default Stepper
