/*
  Warnings:

  - The values [INCOME,EXPENSE] on the enum `FinanceCategory` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `taskCategory` on the `EventBudget` table. All the data in the column will be lost.
  - You are about to drop the column `taskName` on the `EventBudget` table. All the data in the column will be lost.
  - You are about to drop the column `vendor` on the `EventBudget` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[transactionType,eventId]` on the table `EventBudget` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `expenseDescription` to the `EventBudget` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transactionType` to the `EventBudget` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serviceProvider` to the `EventBudget` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "FinanceCategory_new" AS ENUM ('SALARIES', 'RENT', 'UTILITIES', 'SUPPLIES', 'MARKETING', 'TRAVEL', 'MISCELLANEOUS');
ALTER TABLE "EventBudget" ALTER COLUMN "financeCategory" TYPE "FinanceCategory_new" USING ("financeCategory"::text::"FinanceCategory_new");
ALTER TYPE "FinanceCategory" RENAME TO "FinanceCategory_old";
ALTER TYPE "FinanceCategory_new" RENAME TO "FinanceCategory";
DROP TYPE "FinanceCategory_old";
COMMIT;

-- DropIndex
DROP INDEX "EventBudget_taskCategory_eventId_key";

-- AlterTable
ALTER TABLE "EventBudget" DROP COLUMN "taskCategory",
DROP COLUMN "taskName",
DROP COLUMN "vendor",
ADD COLUMN     "expenseDescription" TEXT NOT NULL,
ADD COLUMN     "transactionType" TEXT NOT NULL,
ADD COLUMN     "serviceProvider" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "EventBudget_expenseType_eventId_key" ON "EventBudget"("transactionType", "eventId");
