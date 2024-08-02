import { useNavigate } from 'react-router-dom'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import ResultMessage from '@/components/ui/resultMessage'

export type DialogProps = {
  isDialogOpen: boolean
  navigateTo?: string
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const SuccessDialog = ({
  isDialogOpen,
  navigateTo = '/',
  setIsDialogOpen,
}: DialogProps) => {
  const navigate = useNavigate()
  const handleClose = () => {
    setIsDialogOpen(false)
    navigate(navigateTo, { replace: true })
  }

  return (
    <Dialog open={isDialogOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogTitle />
        <DialogHeader>
          <ResultMessage
            label="Thank you, response sent to organizer!"
            variant="success"
          />
          <DialogDescription className="text-sm text-center py-4 text-gray-500 font-extralight">
            You may also use agenda for your own events, for any Events! you can
            use our budgeting and invitations; you name it. We all have it!
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="justify-end">
          <DialogClose asChild>
            <Button onClick={() => handleClose()}>Continue</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default SuccessDialog
