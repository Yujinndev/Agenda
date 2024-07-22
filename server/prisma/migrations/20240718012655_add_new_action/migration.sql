-- AlterEnum
ALTER TYPE "HistoryAction" ADD VALUE 'PUBLISHED';

-- AlterTable
ALTER TABLE "EventHistoryLog" ALTER COLUMN "email" DROP NOT NULL;
