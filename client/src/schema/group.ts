import { z } from 'zod'

export type GroupDetailsValues = z.infer<typeof detailsSchema>
export const detailsSchema = z.object({
  name: z.string().min(4, 'Kindly enter the name of your group.'),
  description: z.string().min(5, 'Kindly enter the description of your group'),
  visibility: z.string().min(1, 'Kindly select one group visibility'),
  joinPermission: z.string().min(1, 'Kindly select one join permission.'),
  postPermission: z.string().min(1, 'Kindly select one post permission.'),
})

export type GroupRulesValues = z.infer<typeof rulesSchema>
export const rulesSchema = z.object({
  groupRules: z.array(
    z.object({
      rules: z.string().min(5, 'Kindly enter a rule.'),
    })
  ),
})

export const groupFormSchema = detailsSchema.merge(rulesSchema)
export type GroupFormValues = z.infer<typeof groupFormSchema> & {
  creator?: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
}
