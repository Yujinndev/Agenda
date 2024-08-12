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
} from '@/components/ui/form'
import EventCard from '@/components/EventCard'
import { Label } from '@/components/ui/label'
import { toast } from '@/components/ui/use-toast'
import { useGetEventById } from '@/hooks/api/useGetEventById'
import { EVENT_COMMITTEE_INQUIRIES } from '@/constants/choices'
import { QueryClient, useMutation } from '@tanstack/react-query'
import useAuth from '@/hooks/useAuth'
import Loading from '@/components/Loading'
import { useState } from 'react'
import SuccessDialog from '@/components/SuccessDialog'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { Switch } from '@/components/ui/switch'
import { TextFieldCustom } from '@/components/ui/TextFieldCustom'
import { SelectFieldCustom } from '@/components/ui/SelectFieldCustom'

type ResponseFormSchemaType = z.infer<typeof responseFormSchema>
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
        1,
        'Kindly enter your message or inquiry to the organizer (10 characters minimum)'
      ),
  }),
])

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
      await axios.post('/api/event/approval/response', {
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
        <h1 className="pt-[2px]">Committee's Response</h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 p-2 py-4 pt-6">
        <div>
          <EventCard event={eventDetails} extendedVariant />
          <SuccessDialog isDialogOpen={isOpen} setIsDialogOpen={setIsOpen} />
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="lg:col-span-2 space-y-6"
          >
            <SelectFieldCustom
              name="responseType"
              label="Your Response/Inquiry type"
              placeholder="Select a response type"
              choices={[eventCommitteeInquiry]}
              disabled
            />

            <TextFieldCustom
              name="committeeEmail"
              label="Your Email"
              disabled
            />

            <FormField
              control={form.control}
              name="withContent"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center gap-8 rounded-lg border p-4 px-6">
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={
                        eventCommitteeInquiry.value === 'APPROVED'
                          ? false
                          : true
                      }
                    />
                  </FormControl>
                  <div className="space-y-0.5">
                    <Label className="text-base">Add message or inquiry</Label>
                    <FormDescription>
                      You can add any of your questions or appreciation here.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            {isWithContent && (
              <TextFieldCustom
                name="content"
                label="Your Inquiry"
                fieldType="text-area"
              />
            )}
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? 'Submitting ...' : 'Submit'}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default ResponseForm
