-- CreateEnum
CREATE TYPE "ApprovalStatus" AS ENUM ('WAITING', 'REQUESTING_REVISION', 'REJECTED', 'APPROVED');

-- CreateTable
CREATE TABLE "EventCommittee" (
    "id" SERIAL NOT NULL,
    "userId" TEXT,
    "eventId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "approvalStatus" "ApprovalStatus" NOT NULL DEFAULT 'WAITING',

    CONSTRAINT "EventCommittee_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EventCommittee_email_eventId_key" ON "EventCommittee"("email", "eventId");

-- AddForeignKey
ALTER TABLE "EventCommittee" ADD CONSTRAINT "EventCommittee_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventCommittee" ADD CONSTRAINT "EventCommittee_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
