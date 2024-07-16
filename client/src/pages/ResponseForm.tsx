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

const noMessageSchema = z.object({
  responseType: z.string(),
  email: z.string().email(),
  withContent: z.literal(false),
})

const withMessageSchema = z.object({
  responseType: z.string(),
  email: z.string().email(),
  withContent: z.literal(true),
  content: z.string().min(25, {
    message:
      'Kindly enter your message or inquiry to the organizer (20 characters)',
  }),
})

const responseFormSchema = z.discriminatedUnion('withContent', [
  noMessageSchema,
  withMessageSchema,
])

type ResponseFormSchemaType = z.infer<typeof responseFormSchema>

const ResponseForm = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const searchParams = new URLSearchParams(location.search)

  const id = searchParams.get('id')
  const status = searchParams.get('status')
  const user = searchParams.get('user') as string

  const eventCommitteeInquiry = EVENT_COMMITTEE_INQUIRIES.find(
    (inquiry) => inquiry.value === status
  )

  if (!eventCommitteeInquiry || !id) {
    return <Navigate to="/" />
  }

  const { data, isSuccess, isError } = useGetEventById(id)

  if (isError) {
    return <Navigate to="/" />
  }

  const form = useForm<ResponseFormSchemaType>({
    resolver: zodResolver(responseFormSchema),
    defaultValues: {
      responseType: eventCommitteeInquiry?.value,
      email: user,
      withContent: eventCommitteeInquiry.value === 'APPROVED' ? false : true,
      content: '',
    },
  })

  const isWithContent = form.watch('withContent')

  const onSubmit = (data: ResponseFormSchemaType) => {
    toast({
      title: 'You submitted the following values:',
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })
  }

  return (
    <div className="grid lg:grid-cols-3 gap-8 pt-12 p-4 w-full lg:w-4/5">
      {isSuccess && <EventCard event={data} extendedVariant />}

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
            name="email"
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
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  )
}

export default ResponseForm
