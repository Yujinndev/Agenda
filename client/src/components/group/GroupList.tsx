import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import ResultMessage from '@/components/ui/resultMessage'
import { MdAdminPanelSettings } from 'react-icons/md'
import { FaUsers } from 'react-icons/fa'

const GroupList = ({ groups }: { groups: any[] }) => {
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
              <Link to={`/groups/detail/${el.id}`}>
                <div className="relative flex flex-col lg:flex-row h-72 pb-8 lg:pb-0 lg:h-36 border-slate-100 border-[1px] rounded-lg overflow-hidden">
                  <div className="relative h-[50%] lg:h-full lg:w-3/12">
                    <img
                      src="https://st2.depositphotos.com/3591429/6312/i/450/depositphotos_63124153-Word-Group-on-a-Brick-wall.jpg"
                      alt="Image"
                      className="w-full h-full"
                      loading="lazy"
                    />
                  </div>
                  <div className="relative flex flex-1 items-center gap-4 px-4 py-6 lg:p-8">
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
                  </div>
                </div>
              </Link>
            </motion.div>
          )
        })
      ) : (
        <ResultMessage label="No groups to show." />
      )}
    </div>
  )
}

export default GroupList
