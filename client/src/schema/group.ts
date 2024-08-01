import { z } from 'zod'

export const eventGroupSchema = z.object({
  name: z.string().min(5, 'Kindly enter the name of your group.'),
  description: z.string().min(5, 'Kindly enter the description of your group'),
  visibility: z.string().min(1, 'Kindly select one group visibility'),
  joinPermission: z.string().min(1, 'Kindly select one join permission.'),
  postPermission: z.string().min(1, 'Kindly select one post permission.'),
})

export const eventGroupRulesSchema = z.object({
  grouprules: z.array(
    z.object({
      rules: z.string().min(5, 'Kindly enter a rule.'),
    })
  ),
})

export type EventGroupValues = z.infer<typeof eventGroupSchema> & {
  creator?: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
}
export type EventGroupRulesValues = z.infer<typeof eventGroupRulesSchema>

export const eventGroupDetailsSchema = eventGroupSchema.merge(
  eventGroupRulesSchema
)
export type EventGroupDetailsValues = z.infer<
  typeof eventGroupDetailsSchema
> & {
  creator?: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
}
