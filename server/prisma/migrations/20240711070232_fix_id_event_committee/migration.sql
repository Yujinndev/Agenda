-- DropIndex
DROP INDEX "EventHistoryLog_eventId_idx";

-- AlterTable
ALTER TABLE "EventCommittee" ADD CONSTRAINT "EventCommittee_pkey" PRIMARY KEY ("id");
