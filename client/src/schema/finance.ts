import { z } from 'zod'

export const eventFinanceSchema = z.object({
  finance: z.array(
    z.object({
      eventId: z.string(),
      financeCategory: z.string().min(1, 'Kindly select one finance category'),
      transactionType: z.string().min(3, 'Kindly select one transaction type'),
      transactionDescription: z
        .string()
        .min(3, 'Kindly enter the transaction description'),
      serviceProvider: z.string().min(3, 'Kindly enter the service provider'),
      estimatedAmount: z
        .string()
        .min(1, 'Kindly provide the estimated amount for this item'),
      actualAmount: z
        .string()
        .min(1, 'Kindly provide the actual amount for this item'),
    })
  ),
})

export type EventFinanceFormValues = z.infer<typeof eventFinanceSchema>
