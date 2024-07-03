export interface Participant {
  email: string
  eventId?: string
  name?: string
}

export interface EventProps {
  title: string
  purpose: string
  startDateTime: string
  endDateTime: string
  location: string
  estimatedAttendees: string
  category: EventCategory
  audience: EventAudience
  price: string
  participants: any
  estimatedExpense: string
  status: EventStatus
  email: string
  userId: string
}

enum EventCategory {
  PERSONAL = 'PERSONAL',
  COMMUNITY = 'COMMUNITY',
  SCHOOL = 'SCHOOL',
  WORK = 'WORK',
}

enum EventStatus {
  FOR_APPROVAL = 'FOR_APPROVAL',
  UPCOMING = 'UPCOMING',
  DONE = 'DONE',
  RESCHEDULED = 'RESCHEDULED',
  CANCELLED = 'CANCELLED',
}

enum EventAudience {
  PUBLIC = 'PUBLIC',
  INVITED_ONLY = 'INVITED_ONLY',
  USER_GROUP = 'USER_GROUP',
  ONLY_ME = 'ONLY_ME',
}
