-- CreateEnum
CREATE TYPE "EventAudience" AS ENUM ('PUBLIC', 'INVITED_ONLY', 'USER_GROUP');

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "audience" "EventAudience" NOT NULL DEFAULT 'PUBLIC',
ALTER COLUMN "maxBudget" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "refreshToken" TEXT;
