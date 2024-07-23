-- AlterEnum
ALTER TYPE "HistoryAction" ADD VALUE 'SUBMITTED';

-- AlterTable
ALTER TABLE "EventHistoryLog" ADD COLUMN     "committeeInquiryId" INTEGER;

-- AlterTable
ALTER TABLE "EventSentEmailCommittee" ADD COLUMN     "messageId" TEXT;

-- AddForeignKey
ALTER TABLE "EventHistoryLog" ADD CONSTRAINT "EventHistoryLog_committeeInquiryId_fkey" FOREIGN KEY ("committeeInquiryId") REFERENCES "EventCommitteeInquiry"("id") ON DELETE SET NULL ON UPDATE CASCADE;
