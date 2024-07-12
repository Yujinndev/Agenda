/*
  Warnings:

  - The primary key for the `EventCommittee` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- CreateEnum
CREATE TYPE "ResponseType" AS ENUM ('REQUESTING_REVISION', 'REJECTED', 'APPROVED');

-- CreateEnum
CREATE TYPE "HistoryAction" AS ENUM ('CREATED', 'UPDATED', 'INQUIRED', 'REJECTED', 'APPROVED', 'DELETED');

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "details" TEXT,
ALTER COLUMN "purpose" DROP NOT NULL;

-- AlterTable
ALTER TABLE "EventCommittee" DROP CONSTRAINT "EventCommittee_pkey",
ADD CONSTRAINT "EventCommittee_pkey" PRIMARY KEY ("email");

-- CreateTable
CREATE TABLE "EventSentEmailCommittee" (
    "id" SERIAL NOT NULL,
    "isSent" BOOLEAN NOT NULL,
    "committeeEmail" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EventSentEmailCommittee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventCommitteeInquiry" (
    "id" SERIAL NOT NULL,
    "committeeEmail" TEXT NOT NULL,
    "content" TEXT,
    "responseType" "ResponseType" NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EventCommitteeInquiry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventHistoryLog" (
    "id" SERIAL NOT NULL,
    "eventId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "oldValues" TEXT,
    "newValues" TEXT,
    "action" "HistoryAction" NOT NULL,
    "actionTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EventHistoryLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EventSentEmailCommittee_id_key" ON "EventSentEmailCommittee"("id");

-- AddForeignKey
ALTER TABLE "EventCommitteeInquiry" ADD CONSTRAINT "EventCommitteeInquiry_committeeEmail_fkey" FOREIGN KEY ("committeeEmail") REFERENCES "EventCommittee"("email") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventHistoryLog" ADD CONSTRAINT "EventHistoryLog_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
