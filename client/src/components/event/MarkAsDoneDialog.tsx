import { useState } from 'react'
import { CheckCircle } from 'lucide-react'
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
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { QueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/use-toast'

const MarkAsDoneDialog = ({ id }: { id: string }) => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const queryClient = new QueryClient()
  const axios = useAxiosPrivate()

  const handleContinueClicked = async () => {
    setIsSubmitting(true)

    try {
      await axios.post('/api/event/done', {
        data: {
          eventId: id,
        },
      })

      toast({
        description: 'Event updated successfully!',
        variant: 'success',
      })
      setIsDialogOpen(false)
      return queryClient.invalidateQueries({ queryKey: ['event', id] })
    } catch (error) {
      console.log(error)
      toast({
        title: 'Sorry, failed to update event!',
        description: 'Please try again later.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <AlertDialogTrigger asChild>
        <Button className="relative grid grid-cols-4 gap-4 bg-green-900">
          <CheckCircle size={20} />
          <span>Mark as done</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will prevent you from updating
            the event, and will open feedbacks from participants.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            onClick={() => handleContinueClicked()}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Processing ..' : 'Continue'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default MarkAsDoneDialog
