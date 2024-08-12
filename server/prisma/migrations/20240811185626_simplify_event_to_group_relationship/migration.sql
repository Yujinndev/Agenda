/*
  Warnings:

  - You are about to drop the column `userGroupId` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `numberOfMembers` on the `Group` table. All the data in the column will be lost.
  - You are about to drop the column `rulesId` on the `GroupRules` table. All the data in the column will be lost.
  - You are about to drop the `EventUserGroup` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "EventUserGroup" DROP CONSTRAINT "EventUserGroup_eventId_fkey";

-- DropForeignKey
ALTER TABLE "EventUserGroup" DROP CONSTRAINT "EventUserGroup_userGroupId_fkey";

-- DropForeignKey
ALTER TABLE "GroupRules" DROP CONSTRAINT "GroupRules_rulesId_fkey";

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "userGroupId",
ADD COLUMN     "groupId" TEXT;

-- AlterTable
ALTER TABLE "Group" DROP COLUMN "numberOfMembers",
ADD COLUMN     "eventsCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "membersCount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "GroupRules" DROP COLUMN "rulesId";

-- DropTable
DROP TABLE "EventUserGroup";

-- AddForeignKey
ALTER TABLE "GroupRules" ADD CONSTRAINT "GroupRules_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE SET NULL ON UPDATE CASCADE;
