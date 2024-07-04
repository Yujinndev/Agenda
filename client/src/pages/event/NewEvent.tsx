import React, { useEffect, useState } from 'react'
import { QueryClient, useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useToast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  eventBudgetSchema,
  eventConfirmationSchema,
  eventDetailsSchema,
  eventGuestsSchema,
} from '@/schema/event'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import CompletedForm from '@/components/event/CompletedForm'
import BudgetForm from '@/components/event/BudgetForm'
import DetailsForm from '@/components/event/DetailsForm'
import ParticipantsForm from '@/components/event/ParticipantsForm'
import useEventFormStore from '@/services/state/useEventFormStore'
import heroImg from '@/assets/hero-image.png'
import Stepper from '@/components/ui/stepper'

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
  const queryClient = new QueryClient()

  const [activeStep, setActiveStep] = useState(0)
  const { toast } = useToast()
  const navigate = useNavigate()
  const api = useAxiosPrivate()

  const STEPS = ['Details Form', 'Participants Form', 'Budget Form', 'Confirm']

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

  const createEvent = useMutation({
    mutationFn: async () => {
      try {
        await api.post('/event/create', {
          data: {
            ...eventDetails,
            startDateTime: new Date(eventDetails.startDateTime),
            endDateTime: new Date(eventDetails.endDateTime),
          },
        })
      } catch (error) {
        console.log(error)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myEvents'] })

      toast({
        description: 'Your event has been created.',
        variant: 'success',
      })

      reset()
      resetFormData()
      navigate('/dashboard', { replace: true })
    },
  })

  const onSubmit = () => {
    if (activeStep === STEPS.length - 1) {
      createEvent.mutate()
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
    <Card className="m-4 p-2 grid lg:grid-cols-5 relative lg:min-h-[80vh] h-full w-full">
      <div className="relative hidden lg:flex w-full rounded-lg col-span-2 justify-center overflow-hidden bg-white z-10">
        <img
          src={heroImg}
          alt="Image"
          className="w-full -ms-4 aspect-square object-contain relative"
        />
      </div>
      <div className="bg-green-900 h-[9.5rem] inset-0 absolute rounded-t-lg" />

      <div className="col-span-3 relative p-8 py-4 lg:pt-8 z-10">
        <Stepper steps={STEPS} activeStep={activeStep} />

        <div className="mt-8">
          <FormProvider {...form}>
            <form onSubmit={handleSubmit(onSubmit)}>
              {getStepContent(activeStep)}

              <div className="flex justify-center gap-4 my-6 relative lg:absolute lg:bottom-0 lg:right-6">
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
                <Button type="submit" className="px-8 w-full">
                  {activeStep === STEPS.length - 1 ? 'Submit' : 'Next'}
                </Button>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </Card>
  )
}

export default NewEvent
