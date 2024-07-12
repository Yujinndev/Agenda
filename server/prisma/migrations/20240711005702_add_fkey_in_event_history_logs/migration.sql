/*
  Warnings:

  - A unique constraint covering the columns `[id,eventId]` on the table `EventHistoryLog` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "EventHistoryLog_id_eventId_key" ON "EventHistoryLog"("id", "eventId");
