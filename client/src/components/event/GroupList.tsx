import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import ResultMessage from '@/components/ui/resultMessage'
import { UserGroup } from '@/types/group'
import { MdAdminPanelSettings } from 'react-icons/md'
import { FaUsers } from 'react-icons/fa'

const GroupList = ({
  groups,
  selectedFilter,
}: {
  groups: UserGroup[]
  selectedFilter: string
}) => {
  return (
    <div className="overflow flex flex-col gap-4">
      {groups.length > 0 ? (
        groups.map((el) => {
          return (
            <motion.div
              key={el.id}
              whileHover={{ scale: 1.005 }}
              whileTap={{ scale: 0.95 }}
              className="relative flex-1 bg-white transition-all ease-linear"
            >
              <Link to={`/events/group-detail/${el.id}`}>
                <Card
                  className={cn('relative flex h-36', {
                    'bg-primary/10': selectedFilter === 'PUBLIC',
                    'bg-red-700/10': selectedFilter === 'PRIVATE',
                  })}
                >
                  <img
                    src="https://sb.ecobnb.net/app/uploads/sites/3/2021/09/event-plan.jpg"
                    alt="Example Image"
                    className="hidden lg:flex aspect-square w-3/12 relative"
                  />
                  <CardContent className="relative flex flex-1 items-center gap-4 p-8">
                    <div className="w-full">
                      <p className="line-clamp-1 text-[17px] font-bold dark:text-gray-300">
                        {el.name}
                      </p>
                      <p className="mt-1 line-clamp-1 text-[14px]">
                        {el.description}
                      </p>
                      <div className="flex flex-col flex-wrap gap-x-4 lg:flex-row">
                        <div className="mt-1 flex items-center gap-2 text-lg lg:mt-2">
                          <MdAdminPanelSettings
                            size={18}
                            className="flex-shrink-0"
                          />
                          <p className="mt-1 line-clamp-1 text-[14px] font-semibold">
                            {el.members.length > 0 && el.members[0].user
                              ? `${el.members[0].user.firstName} ${el.members[0].user.lastName}`
                              : 'Unknown'}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 text-lg lg:mt-2">
                          <FaUsers size={18} className="flex-shrink-0" />
                          <p className="mt-1 line-clamp-1 text-[14px]">
                            {el.members.length}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          )
        })
      ) : (
        <ResultMessage label="No events to show." />
      )}
    </div>
  )
}

export default GroupList
