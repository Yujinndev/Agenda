import { TextFieldCustom } from '../ui/TextFieldCustom'
import { SelectFieldCustom } from '../ui/SelectFieldCustom'

const CATEGORY_CHOICES = [
  { value: 'PERSONAL', title: 'Personal' },
  { value: 'COMMUNITY', title: 'Community' },
  { value: 'SCHOOL', title: 'School' },
  { value: 'WORK', title: 'Work' },
]

const AUDIENCE_CHOICES = [
  { value: 'PUBLIC', title: 'Public' },
  { value: 'INVITED_ONLY', title: 'Only to Invited People' },
  { value: 'USER_GROUP', title: 'My Groups' },
  { value: 'ONLY_ME', title: 'Only Me' },
]

const ParticipantsForm = () => {
  return (
    <div className="grid gap-4">
      <div className="grid lg:grid-cols-3 gap-2 w-full">
        <TextFieldCustom
          name="estimatedAttendees"
          label="Estimated Attendees"
          placeholder="No. of Attendee/s"
          type="number"
        />
        <SelectFieldCustom
          name="category"
          choices={CATEGORY_CHOICES}
          label="Event Category"
          placeholder="Who can view this event?"
          className="lg:col-span-2"
        />
      </div>

      <SelectFieldCustom
        name="audience"
        choices={AUDIENCE_CHOICES}
        label="Event Sharing and Privacy"
        placeholder="Who can view this event?"
      />
    </div>
  )
}

export default ParticipantsForm
