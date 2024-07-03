/*
  Warnings:

  - You are about to drop the column `maxBudget` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `updateAt` on the `EventBudget` table. All the data in the column will be lost.
  - Changed the type of `category` on the `Event` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `updatedAt` to the `EventBudget` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `EventParticipant` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "EventCategory" AS ENUM ('PERSONAL', 'COMMUNITY', 'SCHOOL', 'WORK');

-- AlterEnum
ALTER TYPE "EventAudience" ADD VALUE 'ONLY_ME';

-- DropForeignKey
ALTER TABLE "EventParticipant" DROP CONSTRAINT "EventParticipant_userId_fkey";

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "maxBudget",
ADD COLUMN     "estimatedAttendees" INTEGER,
ADD COLUMN     "estimatedExpense" DECIMAL(65,30),
ADD COLUMN     "price" DECIMAL(65,30) DEFAULT 0,
DROP COLUMN "category",
ADD COLUMN     "category" "EventCategory" NOT NULL,
ALTER COLUMN "status" DROP NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'UPCOMING';

-- AlterTable
ALTER TABLE "EventBudget" DROP COLUMN "updateAt",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "EventParticipant" ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "name" TEXT,
ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "EventParticipant" ADD CONSTRAINT "EventParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
