import {
  GROUP_VISIBILITY,
  JOIN_PERMISSION,
  POST_PERMISSION,
} from '@/constants/choices'
import { SelectFieldCustom } from '@/components/ui/SelectFieldCustom'
import { TextFieldCustom } from '@/components/ui/TextFieldCustom'

const DetailsForm = () => {
  return (
    <div className="grid gap-2 lg:gap-4">
      <TextFieldCustom
        name="name"
        label="Group Name"
        placeholder="Lorma Inc."
      />
      <TextFieldCustom
        name="description"
        label="Description"
        placeholder="Lorma Inc. is a vibrant community dedicated to fostering innovation, collaboration, and growth. Join us to connect with like-minded individuals, share ideas, and be part of a supportive network that drives"
      />
      <div className="grid lg:grid-cols-4 gap-2 w-full">
        <SelectFieldCustom
          name="visibility"
          choices={GROUP_VISIBILITY}
          label="Group Visiblity"
          placeholder="Who can view this group?"
          className="lg:col-span-4"
        />
        <SelectFieldCustom
          name="joinPermission"
          choices={JOIN_PERMISSION}
          label="Join Permission"
          placeholder="Set joining permission for this group"
          className="lg:col-span-2"
        />
        <SelectFieldCustom
          name="postPermission"
          choices={POST_PERMISSION}
          label="Post Permission"
          placeholder="Set posting permission for this group"
          className="lg:col-span-2"
        />
      </div>
    </div>
  )
}

export default DetailsForm
