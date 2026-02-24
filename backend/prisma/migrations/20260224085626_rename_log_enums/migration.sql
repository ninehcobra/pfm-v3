/*
  Warnings:

  - The `level` column on the `SystemLog` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `SystemLog` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "SystemLogLevel" AS ENUM ('INFO', 'WARN', 'ERROR', 'DEBUG');

-- CreateEnum
CREATE TYPE "SystemLogStatus" AS ENUM ('SUCCESS', 'FAILED');

-- AlterTable
ALTER TABLE "SystemLog" DROP COLUMN "level",
ADD COLUMN     "level" "SystemLogLevel" NOT NULL DEFAULT 'INFO',
DROP COLUMN "status",
ADD COLUMN     "status" "SystemLogStatus" NOT NULL DEFAULT 'SUCCESS';

-- DropEnum
DROP TYPE "LogLevel";

-- DropEnum
DROP TYPE "LogStatus";

-- CreateIndex
CREATE INDEX "SystemLog_level_idx" ON "SystemLog"("level");

-- CreateIndex
CREATE INDEX "SystemLog_status_idx" ON "SystemLog"("status");
