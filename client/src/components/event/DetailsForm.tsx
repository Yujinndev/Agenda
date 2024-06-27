import { TextFieldCustom } from '../ui/TextFieldCustom'

const DetailsForm = () => {
  return (
    <div className="grid gap-2 lg:gap-4">
      <TextFieldCustom name="title" label="Title" placeholder="Glow Run 2024" />
      <TextFieldCustom
        name="purpose"
        label="Purpose"
        placeholder="Ready, Set, GLOW! Join us to ignite the LORMANIAN Glow in the greatest comeback of Glow Run."
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
      <TextFieldCustom name="location" label="Venue Location" />
    </div>
  )
}

export default DetailsForm
