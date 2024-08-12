import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { ArrowLeft } from 'lucide-react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
} from '@/components/ui/form'
import EventCard from '@/components/EventCard'
import FormError from '@/components/ui/formError'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/components/ui/use-toast'
import { useGetEventById } from '@/hooks/api/useGetEventById'
import { QueryClient, useMutation } from '@tanstack/react-query'
import Loading from '@/components/Loading'
import React, { useState } from 'react'
import SuccessDialog from '@/components/SuccessDialog'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { Switch } from '@/components/ui/switch'
import { FaStar } from 'react-icons/fa6'
import useAuth from '@/hooks/useAuth'
import { cn } from '@/lib/utils'

type ResponseFormSchemaType = z.infer<typeof responseFormSchema>
const responseFormSchema = z.discriminatedUnion('withRatings', [
  z.object({
    content: z
      .string()
      .min(10, 'Kindly enter your message or feedback (10 characters minimum)'),
    withRatings: z.literal(false),
  }),
  z.object({
    content: z
      .string()
      .min(10, 'Kindly enter your message or feedback (10 characters minimum)'),
    withRatings: z.literal(true),
    rating: z.string({ invalid_type_error: 'Required' }).min(3, 'Required'),
  }),
])

type DecimalStarRatingProps = {
  totalStars?: number
  precision?: number
  value: string | number
  className?: string
  onChange: (value: string) => void
}
export const DecimalStarRating = React.forwardRef<
  HTMLDivElement,
  DecimalStarRatingProps
>(({ totalStars = 5, precision = 0.5, value, onChange }, ref) => {
  const numericValue =
    typeof value === 'string' ? parseFloat(value) || 0 : value

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, width } = e.currentTarget.getBoundingClientRect()
    const percent = (e.clientX - left) / width
    const numberInStars = percent * totalStars
    const nearestNumber = Math.round(numberInStars / precision) * precision
    const clampedNumber = Math.min(Math.max(nearestNumber, 1), totalStars)
    onChange(clampedNumber.toFixed(2).toString())
  }

  const handleMouseLeave = () => {
    onChange(numericValue.toFixed(2).toString())
  }

  return (
    <div
      ref={ref}
      className="inline-flex mt-2"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {Array.from({ length: totalStars }).map((_, index) => {
        const filled = numericValue - index
        return (
          <FaStar
            key={index}
            className={cn('w-6 h-6 text-amber-400/5', {
              'text-amber-400': filled > 0,
            })}
            style={{
              clipPath:
                filled > 0 && filled < 1
                  ? `inset(0 ${100 - filled * 100}% 0 0)`
                  : undefined,
            }}
          />
        )
      })}
    </div>
  )
})

const FeedbackForm = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const queryClient = new QueryClient()
  const axios = useAxiosPrivate()
  const navigate = useNavigate()
  const { id } = useParams()
  const { auth } = useAuth()

  const { data: eventDetails, isLoading } = useGetEventById(id as string)

  const form = useForm<ResponseFormSchemaType>({
    resolver: zodResolver(responseFormSchema),
    defaultValues: {
      withRatings: false,
      content: '',
    },
  })

  const isWithRatings = form.watch('withRatings')

  const onSubmit = (data: ResponseFormSchemaType) => {
    const { withRatings, ...rest } = data
    mutateAsync({ ...rest })
  }

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (values: Omit<ResponseFormSchemaType, 'withRatings'>) => {
      await axios.post('/api/event/participants/feedback', {
        data: {
          ...values,
          eventId: eventDetails.id,
          userId: auth.userId,
        },
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event', id] })
      setIsOpen(true)
    },
    onError: () => {
      toast({
        title: 'Unable to send response.',
        description:
          'Please try again later, or you may contact the organizer directly',
        variant: 'destructive',
      })
    },
  })

  if (isLoading) {
    return <Loading />
  }

  const hasAlreadySentFeedback = eventDetails.eventFeedbacks?.some(
    (el: any) => el.userId === auth.userId
  )

  if (hasAlreadySentFeedback) {
    return <Navigate to={`/events/detail/${id}`} state={'redirected'} />
  }

  return (
    <div className="pt-4 lg:pt-12 w-full lg:w-4/5">
      <div className="flex items-center gap-4 bg-green-900 p-4 rounded-lg text-white">
        <Button
          variant="ghost"
          size="icon"
          type="button"
          className="rounded-full"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="flex-shrink-0" />
        </Button>
        <h1 className="pt-[2px]">Participant's Feedback</h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 p-2 py-4">
        <div>
          <EventCard event={eventDetails} extendedVariant />
          <SuccessDialog
            isDialogOpen={isOpen}
            navigateTo={`/events/detail/${eventDetails.id}`}
            setIsDialogOpen={setIsOpen}
          />
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="lg:col-span-2 space-y-6"
          >
            <FormField
              control={form.control}
              name="withRatings"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center gap-8 rounded-lg border p-4 px-6">
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        field.onChange(checked)
                        if (checked) {
                          form.setValue('rating', '0')
                        } else {
                          form.unregister('rating')
                        }
                      }}
                    />
                  </FormControl>
                  <div className="space-y-0.5">
                    <Label className="text-base">Add ratings</Label>
                    <FormDescription>
                      Provide feedback by scoring your experience on a scale of
                      1 to 5 stars.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            {isWithRatings && (
              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center gap-8 rounded-lg border p-4 px-6">
                    <Label>Ratings: </Label>
                    <div className="py-2">
                      <div className="flex">
                        <DecimalStarRating
                          {...field}
                          precision={0.5}
                          className="text-green-800"
                        />
                      </div>
                      <FormError errorField={form.formState.errors} />
                    </div>
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <Label>Your Inquiry</Label>
                  <Textarea {...field} className="min-h-[16rem]" />
                  <FormError errorField={form.formState.errors} />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? 'Submitting ...' : 'Submit'}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default FeedbackForm
