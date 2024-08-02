import { useState } from 'react'
import { useFormContext, useWatch, Controller } from 'react-hook-form'
import { TextFieldCustom } from '../ui/TextFieldCustom'
import { SelectFieldCustom } from '../ui/SelectFieldCustom'
import { Button } from '../ui/button'
import { Checkbox } from '../ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog'
import { CATEGORY_CHOICES, EVENT_AUDIENCE } from '@/constants/choices'
import { useGetUserGroups } from '@/hooks/api/useGetUserGroups'
import ResultMessage from '../ui/resultMessage'
import { motion } from 'framer-motion'
import useAuth from '@/hooks/useAuth'

const ParticipantsForm = () => {
  const { control } = useFormContext()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { data: groups, isSuccess } = useGetUserGroups()
  const { auth } = useAuth()

  const audience = useWatch({
    control,
    name: 'audience',
  })

  const handleOpenDialog = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
  }

  return (
    <div className="grid gap-4">
      <div className="grid lg:grid-cols-3 gap-2 w-full">
        <TextFieldCustom
          name="estimatedAttendees"
          label="Estimated Attendees"
          placeholder="No. of Attendee/s"
          type="number"
        />
        <SelectFieldCustom
          name="category"
          choices={CATEGORY_CHOICES}
          label="Event Category"
          placeholder="What category does this event fall under?"
          className="lg:col-span-2"
        />
      </div>
      <SelectFieldCustom
        name="audience"
        choices={EVENT_AUDIENCE}
        label="Event Sharing and Privacy"
        placeholder="Who can view this event?"
      />
      {audience === 'USER_GROUP' && (
        <Button type="button" onClick={handleOpenDialog}>
          Select Groups
        </Button>
      )}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Select Groups</DialogTitle>
          </DialogHeader>
          <div className="flex-grow overflow-y-auto pr-2">
            {isSuccess && groups.length > 0 ? (
              groups.map((group: any) => (
                <motion.div
                  key={group.id}
                  whileHover={{ scale: 1.005 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative flex items-center justify-between bg-white p-4 transition-all ease-linear mb-2"
                >
                  <div>
                    <p className="font-bold">{group.name}</p>
                    <p className="text-sm text-gray-600">
                      Admin: {group?.members[0].user?.firstName}{' '}
                      {group?.members[0].user?.lastName}
                      {group?.members[0].user?.email === auth.user && ' (You)'}
                    </p>
                  </div>
                  <Controller
                    name={`selectedGroups.${group.id}`}
                    control={control}
                    defaultValue={false}
                    render={({ field }) => (
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                </motion.div>
              ))
            ) : (
              <ResultMessage label="No groups to show." />
            )}
          </div>
          <DialogFooter>
            <Button onClick={handleCloseDialog}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ParticipantsForm
