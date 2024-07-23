import { useState } from 'react'
import { Send } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { QueryClient } from '@tanstack/react-query'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { toast } from '../ui/use-toast'

const SendApprovalDialog = ({
  id,
  committees,
}: {
  id: string
  committees: []
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)
  const queryClient = new QueryClient()
  const axios = useAxiosPrivate()

  const handleContinueClicked = async () => {
    try {
      await axios.post('/api/event/send-request', {
        data: {
          eventId: id,
          committees,
        },
      })

      queryClient.invalidateQueries({ queryKey: ['event', id] })
      toast({
        description: 'Sent approval successfully!',
        variant: 'success',
      })
      setIsDialogOpen(false)
    } catch (error) {
      console.log(error)
      toast({
        title: 'Sorry, failed to send approval!',
        description: 'Please try again later.',
        variant: 'destructive',
      })
    }
  }

  return (
    <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <AlertDialogTrigger asChild>
        <Button className="relative grid grid-cols-4 gap-4" variant="secondary">
          <Send size={20} />
          <span>Send Approval</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will prevent you from updating
            the event, and will wait for the response from the committees.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button onClick={() => handleContinueClicked()}>Continue</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default SendApprovalDialog
