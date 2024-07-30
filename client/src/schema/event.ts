import { z } from 'zod'

export type EventDetailsFormValues = z.infer<typeof eventDetailsSchema>
export const eventDetailsSchema = z.object({
  title: z
    .string({ required_error: "Kindly enter your Event's Title" })
    .min(3, 'Title must contain at least 3 character(s)'),
  details: z
    .string({ required_error: "Kindly enter your Event's Detail" })
    .min(25, 'Detail must contain at least 25 character(s)'),
  purpose: z
    .string({ required_error: "Kindly enter your Event's Purpose" })
    .min(25, 'Purpose must contain at least 25 character(s)'),
  location: z
    .string({ required_error: "Kindly enter the Event's location" })
    .min(5, 'Location must contain at least 5 character(s)'),
  startDateTime: z
    .string()
    .min(1, "Kindly enter your Event's Start Date and Time")
    .refine((date) => new Date(date) > new Date(), {
      message: 'Start date time of the event must be in the future',
    }),
  endDateTime: z
    .string()
    .min(1, "Kindly enter your Event's End Date and Time")
    .refine((date) => new Date(date) > new Date(), {
      message: 'End date time of the event must be in the future',
    }),
})

export type EventCommitteeFormValues = z.infer<typeof eventCommitteeSchema>
export const eventCommitteeSchema = z.object({
  committees: z.array(
    z.object({
      email: z.string().email({
        message: "Kindly enter Committee's valid email",
      }),
    })
  ),
})

export type EventGuestsDetailFormValues = z.infer<typeof eventGuestDetailSchema>
export const eventGuestDetailSchema = z
  .object({
    estimatedAttendees: z
      .string({ invalid_type_error: 'Required' })
      .min(1, "Kindly enter your Event's Estimated Attendees"),
    category: z
      .string({ invalid_type_error: 'Required' })
      .min(1, "Kindly select your Event's Category"),
    audience: z
      .string({ invalid_type_error: 'Required' })
      .min(1, "Kindly select your Event's Publishing Audience"),
  })
  .merge(eventCommitteeSchema)

export type EventStatus = (typeof EVENT_STATUS_OPTIONS)[number]
const EVENT_STATUS_OPTIONS = [
  'DRAFT',
  'FOR_ACKNOWLEDGEMENT',
  'FOR_APPROVAL',
  'UPCOMING',
  'ON_HOLD',
  'DONE',
  'RESCHEDULED',
  'CANCELLED',
] as const

export type EventConfirmationFormValues = z.infer<
  typeof eventConfirmationSchema
>
export const eventConfirmationSchema = z.object({
  status: z.enum(EVENT_STATUS_OPTIONS),
})

export type EventFinanceFormValues = z.infer<typeof eventFinanceSchema>
export const eventFinanceSchema = z.object({
  finances: z.array(
    z.object({
      eventId: z.string(),
      financeCategory: z.string().min(1, 'Required'),
      transactionType: z.string().min(3, 'Required'),
      transactionDescription: z.string().min(3, 'Required'),
      serviceProvider: z.string().min(3, 'Required'),
      estimatedAmount: z.string().min(1, 'Required'),
      actualAmount: z.string().nullable(),
    })
  ),
})

export const eventBudgetSchema = z.object({
  estimatedExpense: z
    .string({ invalid_type_error: 'Required' })
    .min(1, "Kindly enter your Event's maximum budget"),
  price: z
    .string({ invalid_type_error: 'Required' })
    .min(1, "Kindly enter your Event's joining price"),
})

export type EventApprovalFormValues = z.infer<typeof eventApprovalSchema>
export const eventApprovalSchema = eventBudgetSchema.merge(eventFinanceSchema)

// for zustand store
export const eventFormSchema = eventDetailsSchema
  .merge(eventGuestDetailSchema)
  .merge(eventBudgetSchema)
  .merge(eventCommitteeSchema)
  .merge(eventFinanceSchema)
  .merge(eventConfirmationSchema)
export type EventFormValues = z.infer<typeof eventFormSchema>
