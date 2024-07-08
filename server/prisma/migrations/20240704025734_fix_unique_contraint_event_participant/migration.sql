/*
  Warnings:

  - A unique constraint covering the columns `[email,eventId]` on the table `EventParticipant` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "EventParticipant_userId_eventId_key";

-- CreateIndex
CREATE UNIQUE INDEX "EventParticipant_email_eventId_key" ON "EventParticipant"("email", "eventId");
