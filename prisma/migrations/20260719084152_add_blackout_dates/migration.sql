-- CreateTable
CREATE TABLE "BlackoutDate" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BlackoutDate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BlackoutDate_workspaceId_idx" ON "BlackoutDate"("workspaceId");

-- CreateIndex
CREATE INDEX "BlackoutDate_workspaceId_enabled_idx" ON "BlackoutDate"("workspaceId", "enabled");

-- CreateIndex
CREATE INDEX "BlackoutDate_workspaceId_startDate_idx" ON "BlackoutDate"("workspaceId", "startDate");

-- CreateIndex
CREATE INDEX "BlackoutDate_workspaceId_endDate_idx" ON "BlackoutDate"("workspaceId", "endDate");

-- CreateIndex
CREATE INDEX "BlackoutDate_workspaceId_enabled_startDate_endDate_idx" ON "BlackoutDate"("workspaceId", "enabled", "startDate", "endDate");

-- AddForeignKey
ALTER TABLE "BlackoutDate" ADD CONSTRAINT "BlackoutDate_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
