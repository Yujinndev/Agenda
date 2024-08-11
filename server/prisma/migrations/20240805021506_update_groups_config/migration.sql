/*
  Warnings:

  - You are about to drop the `UserGroup` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `email` to the `GroupMembership` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_userGroupId_fkey";

-- DropForeignKey
ALTER TABLE "GroupMembership" DROP CONSTRAINT "GroupMembership_groupId_fkey";

-- DropForeignKey
ALTER TABLE "GroupMembership" DROP CONSTRAINT "GroupMembership_userId_fkey";

-- AlterTable
ALTER TABLE "GroupMembership" ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "name" TEXT,
ALTER COLUMN "userId" DROP NOT NULL;

-- DropTable
DROP TABLE "UserGroup";

-- DropEnum
DROP TYPE "JoinPermission";

-- CreateTable
CREATE TABLE "Group" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "numberOfMembers" INTEGER,
    "description" TEXT NOT NULL,
    "joinPermission" TEXT,
    "postPermission" "PostPermission" DEFAULT 'ALL_MEMBERS',
    "visibility" "GroupVisibility" DEFAULT 'PUBLIC',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventUserGroup" (
    "eventId" TEXT NOT NULL,
    "userGroupId" TEXT NOT NULL,
    "groupName" TEXT NOT NULL,
    "creatorName" TEXT NOT NULL,

    CONSTRAINT "EventUserGroup_pkey" PRIMARY KEY ("eventId","userGroupId")
);

-- CreateTable
CREATE TABLE "GroupRules" (
    "id" SERIAL NOT NULL,
    "rulesId" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "GroupRules_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Group_name_key" ON "Group"("name");

-- CreateIndex
CREATE UNIQUE INDEX "GroupRules_groupId_description_key" ON "GroupRules"("groupId", "description");

-- AddForeignKey
ALTER TABLE "EventUserGroup" ADD CONSTRAINT "EventUserGroup_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventUserGroup" ADD CONSTRAINT "EventUserGroup_userGroupId_fkey" FOREIGN KEY ("userGroupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupMembership" ADD CONSTRAINT "GroupMembership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupMembership" ADD CONSTRAINT "GroupMembership_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupRules" ADD CONSTRAINT "GroupRules_rulesId_fkey" FOREIGN KEY ("rulesId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
