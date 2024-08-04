import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FormProvider } from 'react-hook-form'
import { z } from 'zod'
import {
  eventApprovalSchema,
  eventConfirmationSchema,
  eventDetailsSchema,
  eventGuestDetailSchema,
  EventFormValues,
} from '@/schema/event'
import useAuth from '@/hooks/useAuth'
import useDynamicForm from '@/hooks/useDynamicForm'
import { Card } from '@/components/ui/card'
import Stepper from '@/components/ui/stepper'
import { Button } from '@/components/ui/button'
import BudgetForm from '@/components/event/BudgetForm'
import DetailsForm from '@/components/event/DetailsForm'
import CompletedForm from '@/components/event/CompletedForm'
import ParticipantsForm from '@/components/event/ParticipantsForm'
import useEventFormStore from '@/services/state/useEventFormStore'
import { usePostEventMutation } from '@/hooks/api/usePostEventMutation'
import heroImg from '@/assets/hero-image.png'
import { initialFinanceValues } from '@/components/event/UpdateFinanceDialog'
import { findFromArrayFields } from '@/utils/helpers/findFromArrayFields'
import { findDuplicatesInFieldArray } from '@/utils/helpers/findDuplicatesFromArrayFields'
import FormError from '@/components/ui/formError'

export type SchemaArray = typeof EVENT_FORM_CONFIG
export type SchemaType<T extends number> = z.infer<SchemaArray[T]['schema']>
export const EVENT_FORM_CONFIG = [
  {
    name: 'Event Details',
    schema: eventDetailsSchema,
  },
  {
    name: 'Participants Management',
    schema: eventGuestDetailSchema,
  },
  {
    name: 'Budget Planning',
    schema: eventApprovalSchema,
  },
  {
    name: 'Final Review',
    schema: eventConfirmationSchema,
  },
]

export const STEPS = EVENT_FORM_CONFIG.map((config) => config.name)

const NewEvent: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0)
  const navigate = useNavigate()

  const { updateFormData, resetFormData } = useEventFormStore()
  const { auth } = useAuth()

  const { form } = useDynamicForm<SchemaType<typeof activeStep>>({
    schema: EVENT_FORM_CONFIG[activeStep].schema,
    dynamicFields: [
      { name: 'committees', defaultValue: { email: '' } },
      { name: 'finances', defaultValue: initialFinanceValues },
    ],
    formOptions: {
      defaultValues: useEventFormStore.getState().formData,
      shouldUnregister: false,
    },
  })

  // to update form values when eventDetails change
  useEffect(() => {
    form.reset(useEventFormStore.getState().formData)
  }, [useEventFormStore.getState().formData, form.reset])

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
      form.reset()
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

  const validateFormHelpers = (values: any) => {
    const startDateTime = new Date(values.startDateTime)
    const endDateTime = new Date(values.endDateTime)
    if (startDateTime > endDateTime) {
      form.setError('startDateTime', {
        message:
          'Start Date & Time of Event cannot be later than the End Date & Time',
      })

      return false
    }

    const { isFound } = findFromArrayFields<SchemaType<typeof activeStep>>({
      form: form,
      match: auth.user!,
      arrayField: 'committees',
      key: 'email',
      message: 'Organizer cannot be a committee',
    })
    if (isFound && activeStep === 1) {
      return false
    }

    const { hasDuplicates } = findDuplicatesInFieldArray({
      form,
      arrayField: 'committees',
      key: 'email',
      message:
        'Committees cannot be duplicated! Kindly just edit the other one.',
    })

    if (hasDuplicates && activeStep === 1) {
      return false
    }

    const { hasDuplicates: financesHasDuplicates } = findDuplicatesInFieldArray(
      {
        form,
        arrayField: 'finances',
        key: 'transactionDescription',
        message:
          'Transaction Description cannot be duplicated! Kindly just edit the other one.',
      }
    )

    if (financesHasDuplicates && activeStep === 2) {
      return false
    }

    return true
  }

  const onSubmit = async () => {
    updateFormDataPromise(form.getValues()).then(async () => {
      const values = useEventFormStore.getState().formData

      const isStepValid = await form.trigger()
      if (!isStepValid) return

      const isFormValid = validateFormHelpers(values)
      if (!isFormValid) return

      const isFinalPage = activeStep === STEPS.length - 1
      if (!isFinalPage) {
        return setActiveStep((prevActiveStep) => prevActiveStep + 1)
      }

      createEvent.mutate(useEventFormStore.getState().formData)
    })
  }

  const handleSaveDraft = async () => {
    updateFormDataPromise({ ...form.getValues(), status: 'DRAFT' }).then(
      async () => {
        const values = useEventFormStore.getState().formData
        const isDraftValid = await form.trigger('title')
        if (!isDraftValid) return

        const isFormValid = validateFormHelpers(values)
        if (!isFormValid) return

        createEvent.mutate(values)
      }
    )
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const handleCancel = () => {
    resetFormData()
    navigate(-1)
  }

  return (
    <Card className="my-8 lg:p-2 lg:grid lg:grid-cols-5 relative lg:min-h-[80vh] h-full w-full shadow-none">
      <div className="relative hidden lg:flex w-full rounded-lg col-span-2 justify-center overflow-hidden bg-white z-10">
        <img
          src={heroImg}
          alt="Image"
          className="w-full -ms-4 aspect-square object-contain relative"
        />
      </div>
      <div className="bg-green-900 -m-[2px] border-green-900 border-2 h-[9.5rem] inset-0 absolute rounded-t-lg" />

      <div className="lg:col-span-3 relative p-8 py-4 lg:pt-8 z-10 space-y-10">
        <Stepper steps={STEPS} activeStep={activeStep} />

        <div className="relative">
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="lg:pb-20">
                {getStepContent(activeStep)}
                <FormError errorField={form.formState.errors.root} />
              </div>

              <div className="mt-8 lg:mt-24 flex flex-col-reverse lg:flex-row w-full items-center justify-between gap-y-10 gap-x-24 lg:absolute py-4 border-t-green-900 border-t-[1px] lg:-bottom-2 lg:left-0">
                <Button
                  onClick={() => handleSaveDraft()}
                  disabled={createEvent.isPending}
                  type="button"
                  className="w-full lg:w-[20%]"
                  variant="link"
                >
                  {createEvent.isPending ? 'Saving ..' : 'Save Draft'}
                </Button>
                <div className="flex flex-col w-full lg:flex-row gap-2 right-8">
                  {activeStep > 0 ? (
                    <Button
                      onClick={handleBack}
                      type="button"
                      variant="secondary"
                      className="px-8 w-full lg:w-[50%]"
                    >
                      Back
                    </Button>
                  ) : (
                    <Button
                      onClick={handleCancel}
                      type="button"
                      variant="secondary"
                      className="px-8 w-full lg:w-[70%]"
                    >
                      Cancel
                    </Button>
                  )}
                  <Button
                    type="submit"
                    className="px-8 w-full"
                    disabled={createEvent.isPending}
                  >
                    {createEvent.isPending
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
