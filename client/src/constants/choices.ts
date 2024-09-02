export const EVENT_CATEGORIES = [
  { label: 'Draft', value: 'DRAFT' },
  { label: 'On hold', value: 'ON_HOLD' },
  { label: 'Pending', value: 'FOR_APPROVAL' },
  { label: 'Upcoming', value: 'UPCOMING' },
  { label: 'Done', value: 'DONE' },
  { label: 'Cancelled', value: 'CANCELLED' },
]

export const EVENT_COMMITTEE_INQUIRIES = [
  { label: 'Created', value: 'CREATED' },
  { label: 'Updated', value: 'UPDATED' },
  { label: 'Rejected', value: 'REJECTED' },
  { label: 'Approved', value: 'APPROVED' },
  { label: 'Submitted', value: 'SUBMITTED' },
  { label: 'Published', value: 'PUBLISHED' },
  { label: 'Requesting Revision', value: 'REQUESTING_REVISION' },
  { label: 'On hold - Requested for Revision', value: 'ON_HOLD' },
]

export const EVENT_AUDIENCE = [
  {
    label: 'Open to All',
    value: 'PUBLIC',
  },
  {
    label: 'Within my group',
    value: 'USER_GROUP',
  },
  {
    label: 'Only Me',
    value: 'ONLY_ME',
  },
  {
    label: 'Invited Persons Only',
    value: 'INVITED_ONLY',
    isDisabled: true,
  },
]

export const CATEGORY_CHOICES = [
  { label: 'For Personal', value: 'PERSONAL' },
  { label: 'For Community', value: 'COMMUNITY' },
  { label: 'For School', value: 'SCHOOL' },
  { label: 'For Work', value: 'WORK' },
]

export const FINANCE_CATEGORY = [
  { label: 'Revenue', value: 'REVENUE' },
  { label: 'Expense', value: 'EXPENSE' },
]

export const FINANCE_TYPE = [
  { label: 'Sponsorship', value: 'SPONSORSHIP', category: 'REVENUE' },
  { label: 'Sales', value: 'SALES', category: 'REVENUE' },
  { label: 'Advertising', value: 'ADVERTISING', category: 'REVENUE' },
  { label: 'Others', value: 'OTHERS', category: 'REVENUE' },
  { label: 'Travel', value: 'TRAVEL', category: 'EXPENSE' },
  { label: 'Utilities', value: 'UTILITIES', category: 'EXPENSE' },
  { label: 'Supplies', value: 'SUPPLIES', category: 'EXPENSE' },
  { label: 'Salaries', value: 'SALARIES', category: 'EXPENSE' },
  { label: 'Rent', value: 'RENT', category: 'EXPENSE' },
  { label: 'Marketing', value: 'MARKETING', category: 'EXPENSE' },
  { label: 'Miscellaneous', value: 'MISCELLANEOUS', category: 'EXPENSE' },
]

export const GROUP_VISIBILITY = [
  { label: 'Public', value: 'PUBLIC' },
  { label: 'Private', value: 'PRIVATE' },
]

export const JOIN_PERMISSION = [
  { label: 'Anyone Can Join', value: 'ANYONE_CAN_JOIN' },
  { label: 'Requires Approval', value: 'APPROVAL_REQUIRED', isDisabled: true },
  { label: 'Invited Persons Only', value: 'INVITE_ONLY', isDisabled: true },
]

export const POST_PERMISSION = [
  { label: 'All Members', value: 'ALL_MEMBERS' },
  { label: 'Moderators Only', value: 'MODERATORS_ONLY', isDisabled: true },
]
