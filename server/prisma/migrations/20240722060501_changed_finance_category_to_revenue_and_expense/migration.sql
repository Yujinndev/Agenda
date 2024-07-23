/*
  Warnings:

  - The values [SALARIES,RENT,UTILITIES,SUPPLIES,MARKETING,TRAVEL,MISCELLANEOUS] on the enum `FinanceCategory` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "FinanceCategory_new" AS ENUM ('REVENUE', 'EXPENSE');
ALTER TABLE "EventBudget" ALTER COLUMN "financeCategory" TYPE "FinanceCategory_new" USING ("financeCategory"::text::"FinanceCategory_new");
ALTER TYPE "FinanceCategory" RENAME TO "FinanceCategory_old";
ALTER TYPE "FinanceCategory_new" RENAME TO "FinanceCategory";
DROP TYPE "FinanceCategory_old";
COMMIT;
