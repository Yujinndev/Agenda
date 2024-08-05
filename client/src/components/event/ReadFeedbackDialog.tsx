import { format } from 'date-fns'
import { MessageSquareDotIcon } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { DecimalStarRating } from '@/pages/event/FeedbackForm'

export type Feedback = {
  user: string
  content: string
  rating?: string
  time: string
}

const ReadFeedbackDialog = ({ user, content, rating, time }: Feedback) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="relative flex gap-4 w-full" variant="secondary">
          <MessageSquareDotIcon size={20} />
          <span>Read Feedback</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[80dvh] md:max-w-[25dvw] p-8 overflow-hidden">
        <DialogHeader>
          <DialogTitle>Read Feedback</DialogTitle>
          <DialogDescription>
            Review and reflect on the feedback provided.
          </DialogDescription>
        </DialogHeader>
        <div className="h-[1px] w-full bg-gray-900" />

        <Card className="p-4 space-y-2 bg-gray-800 border-gray-700 text-white">
          <div className="flex flex-col gap-2">
            {rating && (
              <DecimalStarRating value={Number(rating)} onChange={() => {}} />
            )}
            <div className="flex items-center gap-2">
              <small className="-mt-1">by:</small>
              <h2 className="text-xl font-bold tracking-tight">{user}</h2>
            </div>
          </div>
          <div className="h-[1px] w-full bg-white/10" />
          <p className="font-extralight text-lg py-4">{content}</p>
          <div className="h-[1px] w-full bg-white/10" />

          <p className="text-sm text-muted-foreground">
            {format(new Date(time), 'PPp')}
          </p>
        </Card>
      </DialogContent>
    </Dialog>
  )
}

export default ReadFeedbackDialog
