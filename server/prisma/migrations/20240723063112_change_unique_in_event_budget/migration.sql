/*
  Warnings:

  - A unique constraint covering the columns `[transactionDescription,eventId]` on the table `EventBudget` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "EventBudget_transactionType_eventId_key";

-- CreateIndex
CREATE UNIQUE INDEX "EventBudget_transactionDescription_eventId_key" ON "EventBudget"("transactionDescription", "eventId");
