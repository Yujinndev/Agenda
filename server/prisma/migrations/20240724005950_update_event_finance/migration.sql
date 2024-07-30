/*
  Warnings:

  - The values [INCOME] on the enum `FinanceCategory` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `actualCost` on the `EventFinance` table. All the data in the column will be lost.
  - You are about to drop the column `estimatedCost` on the `EventFinance` table. All the data in the column will be lost.
  - You are about to drop the column `taskCategory` on the `EventFinance` table. All the data in the column will be lost.
  - You are about to drop the column `taskName` on the `EventFinance` table. All the data in the column will be lost.
  - You are about to drop the column `vendor` on the `EventFinance` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[transactionDescription,eventId]` on the table `EventFinance` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `estimatedAmount` to the `EventFinance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serviceProvider` to the `EventFinance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transactionDescription` to the `EventFinance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transactionType` to the `EventFinance` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "FinanceCategory_new" AS ENUM ('REVENUE', 'EXPENSE');
ALTER TABLE "EventFinance" ALTER COLUMN "financeCategory" TYPE "FinanceCategory_new" USING ("financeCategory"::text::"FinanceCategory_new");
ALTER TYPE "FinanceCategory" RENAME TO "FinanceCategory_old";
ALTER TYPE "FinanceCategory_new" RENAME TO "FinanceCategory";
DROP TYPE "FinanceCategory_old";
COMMIT;

-- DropIndex
DROP INDEX "EventFinance_taskCategory_eventId_key";

-- AlterTable
ALTER TABLE "EventFinance" DROP COLUMN "actualCost",
DROP COLUMN "estimatedCost",
DROP COLUMN "taskCategory",
DROP COLUMN "taskName",
DROP COLUMN "vendor",
ADD COLUMN     "actualAmount" DECIMAL(65,30),
ADD COLUMN     "estimatedAmount" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "serviceProvider" TEXT NOT NULL,
ADD COLUMN     "transactionDescription" TEXT NOT NULL,
ADD COLUMN     "transactionType" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "EventFinance_transactionDescription_eventId_key" ON "EventFinance"("transactionDescription", "eventId");
