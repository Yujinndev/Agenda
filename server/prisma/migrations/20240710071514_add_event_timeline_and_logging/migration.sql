/*
  Warnings:

  - The primary key for the `EventCommittee` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `committeeEventId` to the `EventCommitteeInquiry` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "EventCommitteeInquiry" DROP CONSTRAINT "EventCommitteeInquiry_committeeEmail_fkey";

-- AlterTable
ALTER TABLE "EventCommittee" DROP CONSTRAINT "EventCommittee_pkey";

-- AlterTable
ALTER TABLE "EventCommitteeInquiry" ADD COLUMN     "committeeEventId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "EventCommitteeInquiry" ADD CONSTRAINT "EventCommitteeInquiry_committeeEmail_committeeEventId_fkey" FOREIGN KEY ("committeeEmail", "committeeEventId") REFERENCES "EventCommittee"("email", "eventId") ON DELETE RESTRICT ON UPDATE CASCADE;
