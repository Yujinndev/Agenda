import { format } from 'date-fns'
import { Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { MdAdminPanelSettings } from 'react-icons/md'
import { Card, CardContent } from '@/components/ui/card'
import { useGetGroupById } from '@/hooks/api/useGetGroupById'
import { POST_PERMISSION } from '@/constants/choices'
import MarkdownFormat from '@/utils/MarkdownFormat'
import useAuth from '@/hooks/useAuth'

const GroupOverview = ({ id }: { id: string }) => {
  const { data } = useGetGroupById(id)
  const { auth } = useAuth()

  const convertStartDate = data.createdAt ? new Date(data.createdAt) : 0
  const creator = `${data?.members[0].user?.firstName} ${data?.members[0].user?.lastName}`
  const creatorEmail = data?.members[0].user?.email

  const createdAt = data.createdAt
    ? format(new Date(data.createdAt), 'PP')
    : undefined

  const groupPostPermission = POST_PERMISSION.find(
    (el) => el.value === data.postPermission
  )

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="flex flex-col gap-4">
        <Card className="shadow-none rounded-lg relative p-4 max-h-96">
          <img
            src="https://st2.depositphotos.com/3591429/6312/i/450/depositphotos_63124153-Word-Group-on-a-Brick-wall.jpg"
            alt="Example Image"
            className="w-full h-full rounded-lg"
            loading="lazy"
          />

          <CardContent className="absolute -mt-20 flex items-center gap-2">
            <div className="flex flex-col items-center justify-center rounded-sm border bg-white px-4 py-2">
              <p className="-mb-1 text-sm">{format(convertStartDate, 'MMM')}</p>
              <p className="mb-0 text-xl font-black">
                {format(convertStartDate, 'dd')}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-none">
          <CardContent className="flex flex-col gap-2 p-8">
            <h1 className="text-xl font-black">Published on:</h1>
            <div className="ms-6 flex items-center gap-4 text-base lg:text-lg">
              <Calendar size={24} className="flex-shrink-0" />
              <div className="flex gap-2">{createdAt}</div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-none">
          <CardContent className="flex gap-2 p-8">
            <h1 className="text-xl font-black">No. of members:</h1>
            <p className="text-lg lg:text-justify lg:text-xl">
              {data.members.length}
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-none">
          <CardContent className="flex gap-2 p-8">
            <h1 className="text-xl font-black">Who can post:</h1>
            <p className="text-lg lg:text-justify lg:text-xl">
              {groupPostPermission?.label ?? 'Unset'}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-4">
        <Card className="shadow-none">
          <CardContent className="flex items-center gap-4 p-8">
            <Button
              type="button"
              size="icon"
              variant="secondary"
              className="p-8 rounded-full pointer-events-none"
            >
              <MdAdminPanelSettings size={40} className="flex-shrink-0" />
            </Button>
            <div className="grid">
              <h1 className="text-xl font-black">Creator:</h1>
              <p className="text-lg lg:text-justify lg:text-xl">
                {creator} {creatorEmail === auth.user && '(You)'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-none md:min-h-[18rem] lg:min-h-[20rem] h-full">
          <CardContent className="flex flex-col gap-2 p-8">
            <div>
              <h1 className="text-xl font-black">About:</h1>
              <div className="ms-8 text-lg lg:text lg:text-xl">
                <MarkdownFormat details={data.description} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-none h-full">
          <CardContent className="flex flex-col gap-2 p-8">
            <h1 className="text-xl font-black">Rules:</h1>
            {data.rules.length > 0 ? (
              data.rules.map((rule: string) => (
                <div
                  className="ms-8 text-lg lg:text-justify lg:text-xl"
                  key={rule}
                >
                  <li>{rule}</li>
                </div>
              ))
            ) : (
              <p className="ms-8 text-lg lg:text-justify lg:text-xl">
                No rules have been set for this group.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default GroupOverview
