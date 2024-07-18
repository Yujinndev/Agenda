import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { ArrowLeft } from 'lucide-react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import EventCard from '@/components/EventCard'
import FormError from '@/components/ui/formError'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from '@/components/ui/use-toast'
import { useGetEventById } from '@/hooks/api/useGetEventById'
import { EVENT_COMMITTEE_INQUIRIES } from '@/constants/choices'
import { QueryClient, useMutation } from '@tanstack/react-query'
import useAuth from '@/hooks/useAuth'
import Loading from '@/components/Loading'
import { useState } from 'react'
import SuccessDialog from '@/components/SuccessDialog'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'

const responseFormSchema = z.discriminatedUnion('withContent', [
  z.object({
    responseType: z.string(),
    committeeEmail: z.string().email(),
    withContent: z.literal(false),
  }),
  z.object({
    responseType: z.string(),
    committeeEmail: z.string().email(),
    withContent: z.literal(true),
    content: z
      .string()
      .min(
        10,
        'Kindly enter your message or inquiry to the organizer (10 characters minimum)'
      ),
  }),
])

type ResponseFormSchemaType = z.infer<typeof responseFormSchema>

const ResponseForm = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const { auth } = useAuth()
  const axios = useAxiosPrivate()
  const navigate = useNavigate()
  const location = useLocation()
  const queryClient = new QueryClient()

  const searchParams = new URLSearchParams(location.search)
  const id = searchParams.get('id')
  const status = searchParams.get('status')
  const user = searchParams.get('user') || auth.user

  const { data: eventDetails, isLoading } = useGetEventById(id as string)

  const eventCommitteeInquiry = EVENT_COMMITTEE_INQUIRIES.find(
    (inquiry) => inquiry.value === status
  )

  const form = useForm<ResponseFormSchemaType>({
    resolver: zodResolver(responseFormSchema),
    defaultValues: {
      withContent: eventCommitteeInquiry?.value === 'APPROVED' ? false : true,
      responseType: eventCommitteeInquiry?.value,
      committeeEmail: user,
      content: '',
    },
  })

  const isWithContent = form.watch('withContent')

  const onSubmit = (data: ResponseFormSchemaType) => {
    const { withContent, ...rest } = data
    mutateAsync({ ...rest })
  }

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (values: Omit<ResponseFormSchemaType, 'withContent'>) => {
      await axios.post('/api/event/c/response', {
        data: {
          ...values,
          eventId: id,
          token: searchParams?.get('token'),
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

  if (!eventDetails || !eventCommitteeInquiry) {
    return <Navigate to="/not-found" />
  }

  return (
    <div className="grid lg:grid-cols-3 gap-8 pt-12 p-4 w-full lg:w-4/5">
      <EventCard event={eventDetails} extendedVariant />
      <SuccessDialog isDialogOpen={isOpen} setIsDialogOpen={setIsOpen} />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="lg:col-span-2 space-y-6"
        >
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
            <h1 className="pt-[2px]">Response Form</h1>
          </div>
          <FormField
            control={form.control}
            name="responseType"
            render={({ field }) => (
              <FormItem>
                <Label>Your Response/Inquiry type</Label>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a response type" />
                    </SelectTrigger>
                  </FormControl>

                  <SelectContent>
                    <SelectItem value={`${eventCommitteeInquiry?.value}`}>
                      {eventCommitteeInquiry?.label}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="committeeEmail"
            render={({ field }) => (
              <FormItem>
                <Label>Your Email</Label>
                <Input {...field} disabled />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="withContent"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={
                      eventCommitteeInquiry.value === 'APPROVED' ? false : true
                    }
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Add message or inquiry</FormLabel>
                  <FormDescription>
                    You can add any of your questions or appreciation here.
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          {isWithContent && (
            <FormField
              control={form.control}
              name="content"
              shouldUnregister={true}
              render={({ field }) => (
                <FormItem>
                  <Label>Your Inquiry</Label>
                  <Textarea {...field} className="min-h-[16rem]" />
                  <FormError errorField={form.formState.errors} />
                </FormItem>
              )}
            />
          )}
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Submitting ...' : 'Submit'}
          </Button>
        </form>
      </Form>
    </div>
  )
}

export default ResponseForm
