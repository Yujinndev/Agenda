import {
  GROUP_VISIBILITY,
  JOIN_PERMISSION,
  POST_PERMISSION,
} from '@/constants/choices'
import { Card, CardContent, CardDescription, CardTitle } from '../ui/card'
import useGroupFormStore from '@/services/state/useGroupFormStore'

const CompletedGroupForm = () => {
  const { formData } = useGroupFormStore()
  const {
    name,
    description,
    visibility,
    joinPermission,
    postPermission,
    grouprules,
  } = formData
  const getVisibility = GROUP_VISIBILITY.find((el) => el.value === visibility)
  const getJoinPermission = JOIN_PERMISSION.find(
    (el) => el.value === joinPermission
  )
  const getPostPermission = POST_PERMISSION.find(
    (el) => el.value === postPermission
  )
  return (
    <Card className="border-0 grid gap-2 py-4 shadow-none bg-transparent">
      <CardContent className="border-b-[1px] px-0">
        <CardDescription>Group Name:</CardDescription>
        <CardTitle>{name}</CardTitle>
      </CardContent>
      <CardContent className="border-b-[1px] px-0">
        <CardDescription>Description:</CardDescription>
        <CardTitle>{description}</CardTitle>
      </CardContent>
      <div className="grid lg:grid-cols-2 border-b-[1px]">
        <CardContent className="px-0">
          <CardDescription>Group Visibility:</CardDescription>
          <CardTitle>{getVisibility?.label}</CardTitle>
        </CardContent>
        <CardContent className="border-b-[1px] px-0">
          <CardDescription>Join Permission:</CardDescription>
          <CardTitle>{getJoinPermission?.label}</CardTitle>
        </CardContent>
      </div>
      <CardContent className="border-b-[1px] px-0">
        <CardDescription>Post Permission:</CardDescription>
        <CardTitle>{getPostPermission?.label}</CardTitle>
      </CardContent>

      {grouprules.length > 0 && (
        <CardContent className="border-b-[1px] px-0">
          <CardDescription>Rule/s:</CardDescription>
          <CardTitle>
            <ol>
              {grouprules.map((item) => (
                <li key={item.rules}>* {item.rules}</li>
              ))}
            </ol>
          </CardTitle>
        </CardContent>
      )}
    </Card>
  )
}

export default CompletedGroupForm
