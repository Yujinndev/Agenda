/*
  Warnings:

  - You are about to drop the column `groupId` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the `GroupRules` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `userId` on table `GroupMembership` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `GroupMembership` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_groupId_fkey";

-- DropForeignKey
ALTER TABLE "GroupMembership" DROP CONSTRAINT "GroupMembership_userId_fkey";

-- DropForeignKey
ALTER TABLE "GroupRules" DROP CONSTRAINT "GroupRules_groupId_fkey";

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "groupId";

-- AlterTable
ALTER TABLE "Group" ADD COLUMN     "rules" TEXT[];

-- AlterTable
ALTER TABLE "GroupMembership" ALTER COLUMN "userId" SET NOT NULL,
ALTER COLUMN "name" SET NOT NULL;

-- DropTable
DROP TABLE "GroupRules";

-- CreateTable
CREATE TABLE "EventGroup" (
    "eventId" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EventGroup_pkey" PRIMARY KEY ("eventId","groupId")
);

-- CreateIndex
CREATE INDEX "EventGroup_eventId_idx" ON "EventGroup"("eventId");

-- CreateIndex
CREATE INDEX "EventGroup_groupId_idx" ON "EventGroup"("groupId");

-- AddForeignKey
ALTER TABLE "EventGroup" ADD CONSTRAINT "EventGroup_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventGroup" ADD CONSTRAINT "EventGroup_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupMembership" ADD CONSTRAINT "GroupMembership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
