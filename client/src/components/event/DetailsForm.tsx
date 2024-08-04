import { TextFieldCustom } from '@/components/ui/TextFieldCustom'

const DetailsForm = () => {
  return (
    <div className="grid gap-2 lg:gap-4">
      <TextFieldCustom name="title" label="Title" placeholder="Glow Run 2024" />
      <TextFieldCustom
        name="details"
        label="Details"
        fieldType="text-area"
        placeholder="Ready, Set, GLOW! Join us to ignite the LORMANIAN Glow in the greatest comeback of Glow Run."
      />
      <TextFieldCustom
        name="purpose"
        label="Purpose"
        fieldType="text-area"
        placeholder="To organize a fun and engaging nighttime running event that combines fitness with entertainment."
      />
      <TextFieldCustom
        name="location"
        label="Venue Location"
        placeholder="Lorma Colleges, Inc."
      />
      <div className="grid lg:grid-cols-2 gap-4">
        <TextFieldCustom
          name="startDateTime"
          label="Start Date & Time of Event"
          type="datetime-local"
        />
        <TextFieldCustom
          name="endDateTime"
          label="End Date & Time of Event"
          type="datetime-local"
        />
      </div>
    </div>
  )
}

export default DetailsForm
