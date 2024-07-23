import { useEffect, useState } from 'react'
import { FormProvider } from 'react-hook-form'
import { z } from 'zod'
import {
  eventApprovalSchema,
  eventConfirmationSchema,
  eventDetailsSchema,
  EventFormValues,
  eventGuestDetailSchema,
} from '@/schema/event'
import { Card } from '@/components/ui/card'
import Stepper from '@/components/ui/stepper'
import { Button } from '@/components/ui/button'
import BudgetForm from '@/components/event/BudgetForm'
import DetailsForm from '@/components/event/DetailsForm'
import CompletedForm from '@/components/event/CompletedForm'
import ParticipantsForm from '@/components/event/ParticipantsForm'
import useEventFormStore from '@/services/state/useEventFormStore'
import { usePostEventMutation } from '@/hooks/api/usePostEventMutation'
import useDynamicForm from '@/hooks/useDynamicForm'
import heroImg from '@/assets/hero-image.png'

export const SCHEMAS = [
  eventDetailsSchema,
  eventGuestDetailSchema,
  eventApprovalSchema,
  eventConfirmationSchema,
]

// Create a type that gets the schema type based on the index
export type SchemaArray = typeof SCHEMAS
export type SchemaType<T extends number> = z.infer<SchemaArray[T]>

const NewEvent: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0)
  const STEPS = ['Details Form', 'Participants Form', 'Budget Form', 'Confirm']

  const { updateFormData, resetFormData } = useEventFormStore()

  const { form } = useDynamicForm<SchemaType<typeof activeStep>>({
    schema: SCHEMAS[activeStep],
    dynamicFields: [{ name: 'committees', defaultValue: { email: '' } }],
    formOptions: {
      defaultValues: useEventFormStore.getState().formData,
      shouldUnregister: false,
    },
  })

  const {
    handleSubmit,
    trigger,
    getValues,
    reset,
    formState: { isSubmitting },
  } = form

  // to update form values when eventDetails change
  useEffect(() => {
    reset(useEventFormStore.getState().formData)
  }, [useEventFormStore.getState().formData, reset])

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

  const createEvent = usePostEventMutation('/api/event/create', {
    onSuccess: () => {
      reset()
      resetFormData()
    },
    navigateTo: '/dashboard',
    invalidateQueryKey: ['my-events'],
  })

  const updateFormDataPromise = (
    newData: Partial<EventFormValues>
  ): Promise<void> => {
    return new Promise((resolve) => {
      updateFormData(newData)
      resolve()
    })
  }

  const onSubmit = async () => {
    updateFormDataPromise(getValues()).then(async () => {
      const isStepValid = await trigger()
      if (!isStepValid) return

      const isFinalPage = activeStep === STEPS.length - 1
      if (isFinalPage) {
        createEvent.mutate(useEventFormStore.getState().formData)
      } else {
        setActiveStep((prevActiveStep) => prevActiveStep + 1)
      }
    })
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const handleSaveDraft = async () => {
    let newValues = getValues()

    updateFormDataPromise({ ...newValues, status: 'DRAFT' }).then(async () => {
      const isDraftValid = await trigger('title')
      if (!isDraftValid) return

      createEvent.mutate(useEventFormStore.getState().formData)
    })
  }

  return (
    <Card className="my-8 lg:p-2 grid lg:grid-cols-5 relative lg:min-h-[80vh] h-full w-full">
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
              <div className="lg:pb-12">{getStepContent(activeStep)}</div>

              <div className="flex items-center justify-between gap-4 my-4 lg:px-8 relative lg:absolute lg:-bottom-2 lg:left-0 w-full">
                <Button
                  onClick={() => handleSaveDraft()}
                  disabled={createEvent.isPending}
                  type="button"
                  variant="outline"
                >
                  {createEvent.isPending ? 'Saving ..' : 'Save Draft'}
                </Button>
                <div className="flex gap-2 right-8">
                  {activeStep > 0 && (
                    <Button
                      onClick={handleBack}
                      type="button"
                      variant="secondary"
                      className="px-8"
                    >
                      Back
                    </Button>
                  )}
                  <Button
                    type="submit"
                    className="px-8 w-full"
                    disabled={createEvent.isPending}
                  >
                    {createEvent.isPending || isSubmitting
                      ? 'Saving ..'
                      : activeStep === STEPS.length - 1
                      ? 'Create Event'
                      : 'Next'}
                  </Button>
                </div>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </Card>
  )
}

export default NewEvent