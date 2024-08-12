import { z } from 'zod'

export type EventDetailsFormValues = z.infer<typeof eventDetailsSchema>
export const eventDetailsSchema = z.object({
  title: z.string().min(1, { message: "Kindly enter your Event's Title" }),
  details: z.string().min(1, { message: "Kindly enter your Event's Detail" }),
  purpose: z.string().min(1, { message: "Kindly enter your Event's Purpose" }),
  location: z.string().min(1, { message: "Kindly enter the Event's location" }),
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
      .min(1, { message: "Kindly enter your Event's Estimated Attendees" }),
    category: z
      .string({ invalid_type_error: 'Required' })
      .min(1, { message: "Kindly select your Event's Category" }),
    audience: z
      .string({ invalid_type_error: 'Required' })
      .min(1, { message: "Kindly select your Event's Publishing Audience" }),
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
      financeCategory: z.string().min(1, { message: 'Required' }),
      transactionType: z.string().min(1, { message: 'Required' }),
      transactionDescription: z.string().min(1, { message: 'Required' }),
      serviceProvider: z.string().min(1, { message: 'Required' }),
      estimatedAmount: z.string().min(1, { message: 'Required' }),
      actualAmount: z.string().nullable(),
    })
  ),
})

export const eventBudgetSchema = z.object({
  estimatedExpense: z
    .string({ invalid_type_error: 'Required' })
    .min(1, { message: "Kindly enter your Event's maximum budget" }),
  price: z
    .string({ invalid_type_error: 'Required' })
    .min(1, { message: "Kindly enter your Event's joining price" }),
})

export type SelectedGroups = z.infer<typeof selectedGroupsSchema>
export const selectedGroupsSchema = z.object({
  groupId: z.string(),
  name: z.string(),
  creatorName: z.string(),
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
