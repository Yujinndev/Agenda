import React, { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import BudgetForm from '@/components/event/BudgetForm'
import DetailsForm from '@/components/event/DetailsForm'
import ParticipantsForm from '@/components/event/ParticipantsForm'
import {
  eventBudgetSchema,
  eventConfirmationSchema,
  eventDetailsSchema,
  eventGuestsSchema,
} from '@/schema/event'
import heroImg from '@/assets/hero-image.png'
import useEventFormStore from '@/services/state/useEventFormStore'
import CompletedForm from '@/components/event/CompletedForm'
import { Check } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import { useNavigate } from 'react-router-dom'

// Define the form data type based on all schemas
type FormData = z.infer<typeof eventDetailsSchema> &
  z.infer<typeof eventGuestsSchema> &
  z.infer<typeof eventBudgetSchema> &
  z.infer<typeof eventConfirmationSchema>

const SCHEMAS = [
  eventDetailsSchema,
  eventGuestsSchema,
  eventBudgetSchema,
  eventConfirmationSchema,
]

const NewEvent: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0)
  const { toast } = useToast()
  const navigate = useNavigate()

  const steps = [
    'Details Form',
    'Participants Form',
    'Budget Form',
    'Confirm',
  ] as const

  const {
    formData: eventDetails,
    updateFormData,
    resetFormData,
  } = useEventFormStore()

  const form = useForm<FormData>({
    shouldUnregister: false,
    defaultValues: eventDetails,
    resolver: zodResolver(SCHEMAS[activeStep]),
    mode: 'onChange',
  })

  const { handleSubmit, trigger, getValues, reset } = form
  // Use useEffect to update form values when eventDetails change
  useEffect(() => {
    reset(eventDetails)
  }, [eventDetails, reset])

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <DetailsForm />
      case 1:
        return <ParticipantsForm />
      case 2:
        return <BudgetForm />
      case 3:
        return <CompletedForm />
      default:
        return 'Unknown step'
    }
  }

  const onSubmit = (data: FormData) => {
    if (activeStep === steps.length - 1) {
      toast({
        description: 'Your event has been created.',
        variant: 'success',
      })
      navigate('/events', { replace: true })
      reset()
      resetFormData()
      console.log(eventDetails)
      // Handle final submission
    } else {
      handleNext()
    }
  }

  const handleNext = async () => {
    const isStepValid = await trigger()
    updateFormData(getValues())

    if (isStepValid) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1)
    }
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  return (
    <Card className="m-4 p-2 grid lg:grid-cols-5 relative lg:min-h-[80vh] w-full">
      <div className="relative hidden lg:flex w-full rounded-lg col-span-2 justify-center overflow-hidden bg-white z-10">
        <img
          src={heroImg}
          alt="Image"
          className="w-full -ms-10 aspect-square object-contain relative"
        />
      </div>
      <div className="bg-slate-100 h-[9.5rem] inset-0 absolute rounded-t-lg" />

      <div className="col-span-3 relative p-8 py-4 lg:pt-8 z-10">
        <nav className="pb-8" aria-label="Progress">
          <ol
            role="list"
            className="space-y-4 flex justify-between items-center md:space-x-8 md:space-y-0 relative"
          >
            {steps.map((step, index) => (
              <React.Fragment key={step}>
                <li className="hidden md:block md:flex-1 ubuntu-bold">
                  {activeStep >= index ? (
                    <div className="group flex w-full flex-col border-l-4 border-primary py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                      <div className="rounded-full flex items-center justify-center bg-primary h-6 w-6">
                        <p className="text-white">
                          {activeStep === index ? (
                            `${index + 1}`
                          ) : (
                            <Check size={16} />
                          )}
                        </p>
                      </div>
                      <span className="text pt-2 font-medium">{step}</span>
                    </div>
                  ) : (
                    <div className="group flex w-full flex-col border-l-4 border-gray-400 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                      <div className="rounded-full flex items-center justify-center bg-white border h-6 w-6">
                        <p className="text-gray-400">{index + 1}</p>
                      </div>
                      <span className="text pt-2 font-medium text-gray-400">
                        {step}
                      </span>
                    </div>
                  )}
                </li>

                <div className="md:hidden w-full h-1 absolute bg-black" />
                <li
                  key={step}
                  className="md:hidden md:flex-1 ubuntu-bold relative z-50"
                >
                  {activeStep >= index ? (
                    <React.Fragment>
                      <div className="rounded-full bg-primary h-12 w-12 flex items-center justify-center">
                        <p className="text-white">
                          {activeStep === index ? (
                            `${index + 1}`
                          ) : (
                            <Check size={16} />
                          )}
                        </p>
                      </div>
                      <span className="inset-x-0 mt-2 text-center absolute text-sm font-medium">
                        {step}
                      </span>
                    </React.Fragment>
                  ) : (
                    <div className="rounded-full flex items-center justify-center bg-white border h-12 w-12">
                      <p className="text-gray-400">{index + 1}</p>
                    </div>
                  )}
                </li>
              </React.Fragment>
            ))}
          </ol>
        </nav>

        <article className="mt-8">
          <FormProvider {...form}>
            <form onSubmit={handleSubmit(onSubmit)}>
              {getStepContent(activeStep)}

              <div className="flex justify-end gap-4 my-8 pt-16 relative lg:absolute lg:-bottom-4 lg:right-8">
                {activeStep > 0 && (
                  <Button
                    onClick={handleBack}
                    type="button"
                    variant="outline"
                    className="px-8"
                  >
                    Back
                  </Button>
                )}
                <Button type="submit" className="px-8">
                  {activeStep === steps.length - 1 ? 'Submit' : 'Next'}
                </Button>
              </div>
            </form>
          </FormProvider>
        </article>
      </div>
    </Card>
  )
}

export default NewEvent
