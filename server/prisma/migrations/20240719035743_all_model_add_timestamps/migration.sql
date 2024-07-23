/*
  Warnings:

  - You are about to drop the column `date` on the `EventCommitteeInquiry` table. All the data in the column will be lost.
  - You are about to drop the column `actionTime` on the `EventHistoryLog` table. All the data in the column will be lost.
  - You are about to drop the `EventBudget` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updatedAt` to the `EventCommittee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `EventCommitteeInquiry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `EventFeedback` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `EventHistoryLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `EventParticipant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "EventStatus" ADD VALUE 'DRAFT';
ALTER TYPE "EventStatus" ADD VALUE 'FOR_ACKNOWLEDGEMENT';

-- DropForeignKey
ALTER TABLE "EventBudget" DROP CONSTRAINT "EventBudget_eventId_fkey";

-- AlterTable
ALTER TABLE "Event" ALTER COLUMN "startDateTime" DROP NOT NULL,
ALTER COLUMN "endDateTime" DROP NOT NULL,
ALTER COLUMN "location" DROP NOT NULL,
ALTER COLUMN "audience" DROP NOT NULL,
ALTER COLUMN "category" DROP NOT NULL;

-- AlterTable
ALTER TABLE "EventCommittee" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "EventCommitteeInquiry" DROP COLUMN "date",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "EventFeedback" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "EventHistoryLog" DROP COLUMN "actionTime",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "EventParticipant" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "EventBudget";

-- CreateTable
CREATE TABLE "EventFinance" (
    "id" SERIAL NOT NULL,
    "financeCategory" "FinanceCategory" NOT NULL,
    "taskCategory" TEXT NOT NULL,
    "taskName" TEXT NOT NULL,
    "vendor" TEXT NOT NULL,
    "estimatedCost" DECIMAL(65,30) NOT NULL,
    "actualCost" DECIMAL(65,30),
    "eventId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EventFinance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EventFinance_taskCategory_eventId_key" ON "EventFinance"("taskCategory", "eventId");

-- AddForeignKey
ALTER TABLE "EventFinance" ADD CONSTRAINT "EventFinance_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
