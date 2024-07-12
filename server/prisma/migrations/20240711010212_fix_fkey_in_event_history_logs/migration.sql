/*
  Warnings:

  - The primary key for the `EventHistoryLog` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropIndex
DROP INDEX "EventHistoryLog_id_eventId_key";

-- AlterTable
ALTER TABLE "EventHistoryLog" DROP CONSTRAINT "EventHistoryLog_pkey",
ADD CONSTRAINT "EventHistoryLog_pkey" PRIMARY KEY ("eventId");

-- CreateIndex
CREATE INDEX "EventHistoryLog_eventId_id_idx" ON "EventHistoryLog"("eventId", "id");
