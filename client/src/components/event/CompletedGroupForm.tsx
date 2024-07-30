import { GROUP_CATEGORY } from '@/constants/choices'
import { Card, CardContent, CardDescription, CardTitle } from '../ui/card'
import useEventGroupStore from '@/services/state/useEventGroupStore'

const CompletedGroupForm = () => {
  const { formData } = useEventGroupStore()
  const { groupName, groupDescription, groupCategory, numberOfMembers } =
    formData

  const getCategory = GROUP_CATEGORY.find((el) => el.value === groupCategory)
  return (
    <Card className="border-0 grid gap-2 py-4 shadow-none bg-transparent">
      <CardContent className="border-b-[1px] px-0">
        <CardDescription>Group Name:</CardDescription>
        <CardTitle>{groupName}</CardTitle>
      </CardContent>
      <CardContent className="border-b-[1px] px-0">
        <CardDescription>Description:</CardDescription>
        <CardTitle>{groupDescription}</CardTitle>
      </CardContent>
      <CardContent className="px-0">
        <CardDescription>Group Category:</CardDescription>
        <CardTitle>{getCategory?.label}</CardTitle>
      </CardContent>
      <CardContent className="border-b-[1px] px-0">
        <CardDescription>Number of Members:</CardDescription>
        <CardTitle>{numberOfMembers}</CardTitle>
      </CardContent>
    </Card>
  )
}

export default CompletedGroupForm
