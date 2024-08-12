import Loading from '@/components/Loading'
import { Link } from 'react-router-dom'
import ResultMessage from '@/components/ui/resultMessage'
import { useGetAllPublicGroups } from '@/hooks/api/useGetAllPublicGroups'
import GroupCard from '@/components/GroupCard'

const GroupsPage = () => {
  const { data: allGroups, isSuccess, isLoading } = useGetAllPublicGroups()

  if (isLoading) {
    return <Loading />
  }

  return (
    <section className="relative w-full py-4 lg:px-0 gap-4 lg:pt-10">
      <div className="bg-green-900 lg:px-8 p-4 lg:pb-4 rounded-md sticky">
        <div className="md:w-2/3 py-2 lg:w-1/2 text-white">
          <h1 className="text-3xl">Connect and Engage with Others</h1>
          <p>New groups are forming everyday—become a member.</p>
        </div>
      </div>

      {isSuccess && allGroups.length > 0 ? (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 pt-8">
          {allGroups.map((group: any) => (
            <Link to={`/groups/browse/p/${group.id}`} key={group.id}>
              <GroupCard group={group} extendedVariant={true} />
            </Link>
          ))}
        </div>
      ) : (
        <ResultMessage label="No groups to show." />
      )}
    </section>
  )
}

export default GroupsPage
