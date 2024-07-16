type CommitteesType = {
  currentUser: string
  committees: {
    email: string
    approvalStatus: string
  }[]
}

export const isCommitteeNextToApprove = ({
  committees,
  currentUser,
}: CommitteesType) => {
  const currentUserCommitteeIndex: number = committees.findIndex(
    (el: any) => el.email === currentUser
  )

  // If findIndex returns -1, the user is not a committee member
  if (currentUserCommitteeIndex < 0) {
    return { isNext: false }
  }

  const currentUserStatus = committees[currentUserCommitteeIndex].approvalStatus

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
