/*
  Warnings:

  - You are about to drop the column `actualCost` on the `EventBudget` table. All the data in the column will be lost.
  - You are about to drop the column `estimatedCost` on the `EventBudget` table. All the data in the column will be lost.
  - You are about to drop the column `expenseDescription` on the `EventBudget` table. All the data in the column will be lost.
  - Added the required column `estimatedAmount` to the `EventBudget` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transactionDescription` to the `EventBudget` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EventBudget" DROP COLUMN "actualCost",
DROP COLUMN "estimatedCost",
DROP COLUMN "expenseDescription",
ADD COLUMN     "actualAmount" DECIMAL(65,30),
ADD COLUMN     "estimatedAmount" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "transactionDescription" TEXT NOT NULL;

-- RenameIndex
ALTER INDEX "EventBudget_expenseType_eventId_key" RENAME TO "EventBudget_transactionType_eventId_key";
