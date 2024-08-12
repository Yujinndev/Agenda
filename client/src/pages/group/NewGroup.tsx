import { useEffect, useState } from 'react'
import { FormProvider } from 'react-hook-form'
import { z } from 'zod'
import { Card } from '@/components/ui/card'
import Stepper from '@/components/ui/stepper'
import { Button } from '@/components/ui/button'
import useDynamicForm from '@/hooks/useDynamicForm'
import heroImg from '@/assets/hero-image.png'
import useGroupFormStore from '@/services/state/useGroupFormStore'
import {
  groupFormSchema,
  detailsSchema,
  rulesSchema,
  GroupFormValues,
} from '@/schema/group'
import { QueryClient, useMutation } from '@tanstack/react-query'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { useNavigate } from 'react-router-dom'
import { toast } from '@/components/ui/use-toast'
import DetailsForm from '@/components/group/DetailsForm'
import RulesForm from '@/components/group/RulesForm'
import CompletedForm from '@/components/group/CompletedForm'
import { findDuplicatesInFieldArray } from '@/utils/helpers/findDuplicatesFromArrayFields'
import FormError from '@/components/ui/formError'

// Create a type that gets the schema type based on the index
export type SchemaArray = typeof GROUP_FORM_CONFIG
export type SchemaType<T extends number> = z.infer<SchemaArray[T]['schema']>
export const GROUP_FORM_CONFIG = [
  {
    name: 'Group Details',
    schema: detailsSchema,
  },
  {
    name: 'Rules and Regulations',
    schema: rulesSchema,
  },
  {
    name: 'Final Review',
    schema: rulesSchema,
  },
]

export const STEPS = GROUP_FORM_CONFIG.map((config) => config.name)

const NewGroup: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0)
  const axios = useAxiosPrivate()
  const navigate = useNavigate()
  const queryClient = new QueryClient()

  const { updateFormData, resetFormData } = useGroupFormStore()

  const { form } = useDynamicForm<SchemaType<typeof activeStep>>({
    schema: groupFormSchema,
    formOptions: {
      defaultValues: useGroupFormStore.getState().formData,
      shouldUnregister: false,
    },
  })

  const {
    handleSubmit,
    getValues,
    reset,
    formState: { isSubmitting },
  } = form

  // to update form values when eventDetails change
  useEffect(() => {
    reset(useGroupFormStore.getState().formData)
  }, [useGroupFormStore.getState().formData, reset])

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <DetailsForm />
      case 1:
        return <RulesForm />
      case 2:
        return <CompletedForm />
      default:
        return 'Unknown step'
    }
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const createGroup = useMutation({
    mutationFn: async (data: any) => {
      const response = await axios.post('/api/group/create', {
        data,
      })
      return response.data
    },
    onSuccess: () => {
      toast({
        description: 'Your group has been created.',
        variant: 'success',
      })
      reset()
      resetFormData()
      navigate('/groups/my-groups')
      return queryClient.invalidateQueries({ queryKey: ['group'] })
    },
    onError: (error: any) => {
      console.log(error)

      toast({
        title: 'Sorry, failed!',
        description: 'Please try again later.',
        variant: 'destructive',
      })
    },
  })

  const updateFormDataPromise = (
    newData: Partial<GroupFormValues>
  ): Promise<void> => {
    return new Promise((resolve) => {
      updateFormData(newData)
      resolve()
    })
  }

  const onSubmit = async () => {
    updateFormDataPromise(getValues()).then(async () => {
      const { hasDuplicates } = findDuplicatesInFieldArray({
        form,
        arrayField: 'groupRules',
        key: 'rules',
        message: 'Rules cannot be duplicated! Kindly just edit the other one.',
      })

      if (hasDuplicates && activeStep === 1) return

      const isFinalPage = activeStep === STEPS.length - 1
      if (!isFinalPage) {
        return setActiveStep((prevActiveStep) => prevActiveStep + 1)
      }

      await createGroup.mutateAsync(useGroupFormStore.getState().formData)
    })
  }

  const handleCancel = () => {
    resetFormData()
    navigate(-1)
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
              <div className="lg:pb-12 min-h-80">
                {getStepContent(activeStep)}
                <FormError errorField={form.formState.errors.root} />
              </div>

              <div className="mt-8 lg:mt-24 flex flex-col-reverse lg:flex-row w-full items-center justify-between gap-y-10 gap-x-24 lg:absolute py-4 border-t-green-900 border-t-[1px] lg:-bottom-2 lg:left-0">
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
                    disabled={createGroup.isPending}
                  >
                    {createGroup.isPending || isSubmitting
                      ? 'Saving ..'
                      : activeStep === STEPS.length - 1
                      ? 'Create Group'
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

export default NewGroup
