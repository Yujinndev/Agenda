import { type PrismaClient } from '@prisma/client'
import { getEventsData } from '../../data/event/get-events'
import { getUserData } from '../../data/user/get-user'

export type GetPublicEventsServiceArgs = {
  prisma: PrismaClient
  page: number
  userToken: string
}
export const getPublicEventsService = async ({
  prisma,
  page,
  userToken,
}: GetPublicEventsServiceArgs) => {
  const events = await prisma.$transaction(async (prismaTx) => {
    let user

    if (userToken !== '') {
      user = await getUserData({
        prisma: prismaTx,
        refreshToken: userToken,
      }).catch((error) => console.log(error))
    }

    return await getEventsData({
      prisma,
      page,
      where: {
        AND: [
          { audience: { equals: 'PUBLIC' } },
          { status: { equals: 'UPCOMING' } },
          { organizerId: { not: user?.id } },
        ],
      },
      limit: 16,
      sortBy: 'startDateTime',
      orderBy: 'asc',
      include: { participants: true, organizer: true },
    })
  })

  return events
}
