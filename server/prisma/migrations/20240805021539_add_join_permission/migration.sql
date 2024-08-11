/*
  Warnings:

  - The `joinPermission` column on the `Group` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "JoinPermission" AS ENUM ('ANYONE_CAN_JOIN', 'APPROVAL_REQUIRED', 'INVITE_ONLY');

-- AlterTable
ALTER TABLE "Group" DROP COLUMN "joinPermission",
ADD COLUMN     "joinPermission" "JoinPermission" DEFAULT 'ANYONE_CAN_JOIN';
