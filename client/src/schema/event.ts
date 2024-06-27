import { z } from 'zod'

export const eventDetailsSchema = z.object({
  title: z.string().min(1, 'Kindly enter your Event name'),
  purpose: z.string().min(1, 'Kindly describe your Event'),
  startDateTime: z.string().refine((date) => new Date(date) > new Date(), {
    message: 'State of event date must be in the future',
  }),
  endDateTime: z.string().refine((date) => new Date(date) > new Date(), {
    message: 'End of event date must be in the future',
  }),
  location: z.string().min(1, `Kindly enter the event's location`),
})

export const eventGuestDetailSchema = z.object({
  maxAttendees: z
    .string()
    .min(1, 'Kindly provide the maximum number of attendee/s'),
  category: z.enum(['PUBLIC', 'PRIVATE']),
})

export const eventGuestPeopleSchema = z.object({
  guests: z.array(
    z.object({
      email: z.string().email({
        message: 'Kindly enter valid email',
      }),
    })
  ),
})

export const eventBudgetSchema = z.object({
  maxBudget: z
    .string()
    .min(1, 'Kindly provide the maximum budget for the event'),
})

export const eventConfirmationSchema = z.object({
  status: z.string().min(1),
})

export const eventGuestsSchema = eventGuestDetailSchema.merge(
  eventGuestPeopleSchema
)

export const eventFormSchema = eventDetailsSchema
  .merge(eventGuestDetailSchema)
  .merge(eventGuestPeopleSchema)
  .merge(eventBudgetSchema)
  .merge(eventConfirmationSchema)

export type EventDetailsFormValues = z.infer<typeof eventDetailsSchema>
export type EventGuestsDetailFormValues = z.infer<typeof eventGuestDetailSchema>
export type EventGuestsFormValues = z.infer<typeof eventGuestPeopleSchema>
export type EventBudgetFormValues = z.infer<typeof eventBudgetSchema>
export type EventConfirmationFormValues = z.infer<
  typeof eventConfirmationSchema
>
export type EventFormValues = z.infer<typeof eventFormSchema>
