export type ApprovalStatus =
  | 'REQUESTING_REVISION'
  | 'ON_HOLD'
  | 'WAITING'
  | 'APPROVED'
export type isNextToApprove = {
  isNext: boolean
  status?: ApprovalStatus
}

export type CommitteesType = {
  currentUser: string
  committees: {
    email: string
    approvalStatus: ApprovalStatus
  }[]
}

export const isCommitteeNextToApprove = ({
  committees,
  currentUser,
}: CommitteesType): isNextToApprove => {
  const currentUserCommitteeIndex: number = committees.findIndex(
    (el: any) => el.email === currentUser
  )

  const revisionCommitteeIndex = committees.findIndex(
    (committee) => committee.approvalStatus === 'REQUESTING_REVISION'
  )

  // If findIndex returns -1, the user is not a committee member
  if (currentUserCommitteeIndex < 0) {
    return { isNext: false }
  }

  if (
    revisionCommitteeIndex > 0 &&
    currentUserCommitteeIndex !== revisionCommitteeIndex
  ) {
    return {
      isNext: true,
      status: 'ON_HOLD',
    }
  }

  const currentUserStatus: ApprovalStatus =
    committees[currentUserCommitteeIndex].approvalStatus

  if (currentUserStatus === 'APPROVED') {
    return {
      isNext: true,
      status: 'APPROVED',
    }
  }

  for (let i = currentUserCommitteeIndex - 1; i >= 0; i--) {
    if (committees[i].approvalStatus !== 'APPROVED') {
      return { isNext: false, status: 'WAITING' }
    }
  }

  return {
    isNext: true,
    status: currentUserStatus,
  }
}
