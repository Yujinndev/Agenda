/*
  Warnings:

  - The primary key for the `EventHistoryLog` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropIndex
DROP INDEX "Event_organizerId_id_idx";

-- DropIndex
DROP INDEX "EventHistoryLog_eventId_id_idx";

-- AlterTable
ALTER TABLE "EventHistoryLog" DROP CONSTRAINT "EventHistoryLog_pkey",
ADD CONSTRAINT "EventHistoryLog_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE INDEX "Event_organizerId_idx" ON "Event"("organizerId");

-- CreateIndex
CREATE INDEX "EventHistoryLog_eventId_idx" ON "EventHistoryLog"("eventId");
