import { EventCommitteeInquiry, PrismaClient } from '@prisma/client'
import { createCommitteeInquiry } from '../../data/committee/create-committe-inquiry'
import { createHistoryLogData } from '../../data/history/create-history-log'
import { updateCommitteeData } from '../../data/committee/update-committee'
import { getCommitteesData } from '../../data/committee/get-committees'
import { getCommitteeData } from '../../data/committee/get-committee'
import { updateEventData } from '../../data/event/update-event'
import { sendEmailApprovalService } from '../send-email-approval-service'
import { ForbiddenError } from '../../utils/errors'

export type CommitteeResponseServiceArgs = {
  prisma: PrismaClient
  eventId: string
  committeeEmail: string
  values: EventCommitteeInquiry
}

export const committeeResponseService = async ({
  prisma,
  eventId,
  committeeEmail,
  values,
}: CommitteeResponseServiceArgs) => {
  const response = await prisma.$transaction(async (prismaTx) => {
    const committee = await getCommitteeData({
      prisma: prismaTx,
      committeeEmail,
      eventIds: eventId,
    })

    if (
      committee.approvalStatus === 'REJECTED' ||
      committee.approvalStatus === 'APPROVED'
    ) {
      throw new ForbiddenError(`Committee already ${committee.approvalStatus}`)
    }

    const committeeInquiry = await createCommitteeInquiry({
      prisma: prismaTx,
      eventId,
      committeeEmail,
      values: {
        content: values.content,
        responseType: values.responseType,
      },
    })

    // update eventCommittee in their approval status
    await updateCommitteeData({
      prisma: prismaTx,
      values: { approvalStatus: values.responseType },
      eventId,
      email: committeeEmail,
    })

    const action =
      values.responseType === 'REQUESTING_REVISION'
        ? 'INQUIRED'
        : values.responseType

    await createHistoryLogData({
      prisma: prismaTx,
      values: {
        email: committeeEmail,
        eventId,
        action,
        message: 'Committee response',
        committeeInquiryId: committeeInquiry.id,
      },
    })

    const committees = await getCommitteesData({
      prisma: prismaTx,
      eventIds: eventId,
    })

    // if REQUESTED_REVISION, then update all other committees to. return inquiry
    if (values.responseType === 'REQUESTING_REVISION') {
      return committeeInquiry
    }

    // if REJECTED, then update event status to CANCELLED
    if (values.responseType === 'REJECTED') {
      return await updateEventData({
        prisma: prismaTx,
        id: eventId,
        values: { status: 'CANCELLED' },
      })
    }

    const currentCommitteeIndex: number = committees.findIndex(
      (el: any) => el.email === committeeEmail,
    )

    /* check status of all other committees -> 
        (1) if not lastToApprove, send another email to next committee. 
        (2) if lastToApprove, proceed to update event status to UPCOMING; */
    if (currentCommitteeIndex < committees.length - 1) {
      return await sendEmailApprovalService({
        prisma: prismaTx,
        committeeEmail: committees[currentCommitteeIndex + 1].email,
        eventId,
      })
    }

    return await updateEventData({
      prisma: prismaTx,
      id: eventId,
      values: { status: 'UPCOMING' },
    })
  })

  return response
}
