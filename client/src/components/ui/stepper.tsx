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
    <nav className="pb-12 lg:pb-4" aria-label="Progress">
      <ol
        role="list"
        className="space-y-4 flex justify-between items-center md:space-x-8 md:space-y-0 relative"
      >
        {steps.map((step, index) => (
          <React.Fragment key={step}>
            <li className="hidden md:block md:flex-1 ubuntu-bold">
              {activeStep >= index ? (
                <div className="group flex w-full flex-col border-l-4 border-amber-300 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                  <div className="rounded-full flex items-center justify-center bg-amber-300 h-6 w-6">
                    {activeStep === index ? (
                      <p className="pt-1">{index + 1}</p>
                    ) : (
                      <Check size={16} />
                    )}
                  </div>
                  <span className="text pt-2 text-amber-300 font-medium">
                    {step}
                  </span>
                </div>
              ) : (
                <div className="group flex w-full flex-col border-l-4 border-gray-300 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                  <div className="rounded-full flex items-center justify-center bg-gray-300 border h-6 w-6">
                    <p className="pt-1">{index + 1}</p>
                  </div>
                  <span className="text pt-2 font-medium text-gray-300">
                    {step}
                  </span>
                </div>
              )}
            </li>

            <div className="md:hidden w-full h-1 absolute bg-white" />
            <li
              key={step}
              className="md:hidden md:flex-1 ubuntu-bold relative z-50"
            >
              {activeStep >= index ? (
                <React.Fragment>
                  <div className="rounded-full h-12 w-12 flex items-center justify-center bg-amber-300">
                    {activeStep === index ? (
                      <p>{index + 1}</p>
                    ) : (
                      <Check size={16} />
                    )}
                  </div>
                  <span className="inset-x-0 mt-2 text-center absolute text-sm text-amber-300 font-medium">
                    {step}
                  </span>
                </React.Fragment>
              ) : (
                <div className="rounded-full flex items-center justify-center bg-gray-300 border h-12 w-12">
                  <p className="bg-gray-300">{index + 1}</p>
                </div>
              )}
            </li>
          </React.Fragment>
        ))}
      </ol>
    </nav>
  )
}

export default Stepper
