import React, { FC, useEffect, useState } from 'react'
import { FormProvider } from 'react-hook-form'
import { z } from 'zod'
import { Card } from '@/components/ui/card'
import Stepper from '@/components/ui/stepper'
import { Button } from '@/components/ui/button'
import useDynamicForm from '@/hooks/useDynamicForm'
import heroImg from '@/assets/hero-image.png'
import CreateGroup from '@/components/event/CreateGroup'
import CompletedGroupForm from '@/components/event/CompletedGroupForm'
import useGroupFormStore from '@/services/state/useGroupFormStore'
import {
  eventGroupSchema,
  EventGroupDetailsValues,
  eventGroupRulesSchema,
} from '@/schema/group'
import { QueryClient, useMutation } from '@tanstack/react-query'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { useNavigate } from 'react-router-dom'
import { toast } from '@/components/ui/use-toast'
import CreateGroupRules from '@/components/event/CreateGroupRules'

export const SCHEMAS = [eventGroupSchema, eventGroupRulesSchema]

// Create a type that gets the schema type based on the index
export type SchemaArray = typeof SCHEMAS
export type SchemaType<T extends number> = z.infer<SchemaArray[T]>

const NewGroup: FC = () => {
  const [activeStep, setActiveStep] = useState(0)
  const STEPS = ['Details Form', 'Rules Form', 'Confirm']
  const axios = useAxiosPrivate()
  const navigate = useNavigate()
  const queryClient = new QueryClient()

  const { updateFormData, resetFormData } = useGroupFormStore()

  const { form } = useDynamicForm<SchemaType<typeof activeStep>>({
    schema: eventGroupSchema,
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
        return <CreateGroup />
      case 1:
        return <CreateGroupRules />
      case 2:
        return <CompletedGroupForm />
      default:
        return 'Unknown step'
    }
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const createGroup = useMutation({
    mutationFn: async (data: any) => {
      const response = await axios.post('/api/event/create-group', {
        data: {
          ...data,
        },
      })
      return response.data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['group'] })
      toast({
        description: 'Your group has been created.',
        variant: 'success',
      })
      reset()
      resetFormData()
      navigate('/events/group')
    },
  })

  const updateFormDataPromise = (
    newData: Partial<EventGroupDetailsValues>
  ): Promise<void> => {
    return new Promise((resolve) => {
      updateFormData(newData)
      resolve()
    })
  }

  const onSubmit = async () => {
    updateFormDataPromise(getValues()).then(async () => {
      const isFinalPage = activeStep === STEPS.length - 1
      if (isFinalPage) {
        const result = await createGroup.mutateAsync(
          useGroupFormStore.getState().formData
        )
        // console.log('Mutation result:', result)
        updateFormData({ creator: result.creator })
      } else {
        setActiveStep((prevActiveStep) => prevActiveStep + 1)
      }
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
function mutationFn(variables: any): Promise<void> {
  throw new Error('Function not implemented.')
}
