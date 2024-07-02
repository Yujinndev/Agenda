import { z } from 'zod'

export const eventDetailsSchema = z.object({
  title: z.string().min(1, 'Kindly enter your Event name'),
  purpose: z.string().min(1, 'Kindly describe your Event'),
  startDateTime: z
    .string()
    .min(1, 'Kindly enter the end date')
    .refine((date) => new Date(date) > new Date(), {
      message: 'Start of event date must be in the future',
    }),
  endDateTime: z
    .string()
    .min(1, 'Kindly enter the end date')
    .refine((date) => new Date(date) > new Date(), {
      message: 'End of event date must be in the future',
    }),
  location: z.string().min(1, `Kindly enter the event's location`),
})

export const eventGuestDetailSchema = z.object({
  estimatedAttendees: z.string().min(1, 'Required'),
  category: z.string().min(1, 'Kindly Select an Event Category'),
  audience: z.string().min(1, 'Kindly Select an Event Publishing Audience'),
})

export const eventGuestPeopleSchema = z.object({
  participants: z.array(
    z.object({
      email: z
        .string()
        .email({
          message: 'Kindly enter valid email',
        })
        .or(z.literal('')),
    })
  ),
})

export const eventBudgetSchema = z.object({
  estimatedExpense: z
    .string()
    .min(1, 'Kindly provide the maximum budget for the event'),
  price: z.string().min(1, 'Kindly provide the price for joining this event'),
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
