-- CreateEnum
CREATE TYPE "LogLevel" AS ENUM ('INFO', 'WARN', 'ERROR', 'DEBUG');

-- CreateEnum
CREATE TYPE "LogStatus" AS ENUM ('SUCCESS', 'FAILED');

-- CreateTable
CREATE TABLE "SystemLog" (
    "id" TEXT NOT NULL,
    "level" "LogLevel" NOT NULL DEFAULT 'INFO',
    "source" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "metadata" JSONB,
    "path" TEXT,
    "method" TEXT,
    "statusCode" INTEGER,
    "duration" INTEGER,
    "ip" TEXT,
    "userAgent" TEXT,
    "status" "LogStatus" NOT NULL DEFAULT 'SUCCESS',
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SystemLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SystemLog_level_idx" ON "SystemLog"("level");

-- CreateIndex
CREATE INDEX "SystemLog_source_idx" ON "SystemLog"("source");

-- CreateIndex
CREATE INDEX "SystemLog_action_idx" ON "SystemLog"("action");

-- CreateIndex
CREATE INDEX "SystemLog_userId_idx" ON "SystemLog"("userId");

-- CreateIndex
CREATE INDEX "SystemLog_createdAt_idx" ON "SystemLog"("createdAt");

-- CreateIndex
CREATE INDEX "SystemLog_status_idx" ON "SystemLog"("status");

-- AddForeignKey
ALTER TABLE "SystemLog" ADD CONSTRAINT "SystemLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
