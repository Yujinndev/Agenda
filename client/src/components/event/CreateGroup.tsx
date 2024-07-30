import { GROUP_CATEGORY } from '@/constants/choices'
import { SelectFieldCustom } from '../ui/SelectFieldCustom'
import { TextFieldCustom } from '../ui/TextFieldCustom'

const CreateGroup = () => {
  return (
    <div className="grid gap-2 lg:gap-4">
      <TextFieldCustom
        name="groupName"
        label="Group Name"
        placeholder="Lorma Inc."
      />
      <TextFieldCustom
        name="groupDescription"
        label="Description"
        placeholder="Lorma Inc. is a vibrant community dedicated to fostering innovation, collaboration, and growth. Join us to connect with like-minded individuals, share ideas, and be part of a supportive network that drives"
      />
      <div className="grid lg:grid-cols-3 gap-2 w-full">
        <SelectFieldCustom
          name="groupCategory"
          choices={GROUP_CATEGORY}
          label="Group Category"
          placeholder="What category does this group fall under?"
          className="lg:col-span-2"
        />
        <TextFieldCustom
          name="numberOfMembers"
          label="Number of Members"
          placeholder="No. of Member/s"
          type="number"
        />
      </div>
    </div>
  )
}

export default CreateGroup
