interface Committees {
  currentUser: string
  committees: {
    email: string
    approvalStatus: string
  }[]
}

export const isCommitteeNextToApprove = ({
  committees,
  currentUser,
}: Committees) => {
  const currentUserCommitteeIndex = committees.findIndex(
    (el: any) => el.email === currentUser
  )

  // the findIndex returns -1 if not found, means that it is not a committee
  if (currentUserCommitteeIndex < 0) {
    return { isNext: false }
  }

  if (committees[currentUserCommitteeIndex].approvalStatus === 'APPROVED') {
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
    status: committees[currentUserCommitteeIndex].approvalStatus,
  }
}
