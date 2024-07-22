import { TextFieldCustom } from '../ui/TextFieldCustom'
import { SelectFieldCustom } from '../ui/SelectFieldCustom'
import { CATEGORY_CHOICES, EVENT_AUDIENCE } from '@/constants/choices'

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
          placeholder="What category does this event fall under?"
          className="lg:col-span-2"
        />
      </div>

      <SelectFieldCustom
        name="audience"
        choices={EVENT_AUDIENCE}
        label="Event Sharing and Privacy"
        placeholder="Who can view this event?"
      />
    </div>
  )
}

export default ParticipantsForm
