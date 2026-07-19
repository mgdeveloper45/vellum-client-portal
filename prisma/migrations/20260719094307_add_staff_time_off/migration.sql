-- CreateTable
CREATE TABLE "StaffTimeOff" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "staffId" TEXT NOT NULL,
    "reason" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StaffTimeOff_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "StaffTimeOff_workspaceId_idx" ON "StaffTimeOff"("workspaceId");

-- CreateIndex
CREATE INDEX "StaffTimeOff_staffId_idx" ON "StaffTimeOff"("staffId");

-- CreateIndex
CREATE INDEX "StaffTimeOff_workspaceId_staffId_idx" ON "StaffTimeOff"("workspaceId", "staffId");

-- CreateIndex
CREATE INDEX "StaffTimeOff_workspaceId_enabled_idx" ON "StaffTimeOff"("workspaceId", "enabled");

-- CreateIndex
CREATE INDEX "StaffTimeOff_startDate_idx" ON "StaffTimeOff"("startDate");

-- CreateIndex
CREATE INDEX "StaffTimeOff_endDate_idx" ON "StaffTimeOff"("endDate");

-- AddForeignKey
ALTER TABLE "StaffTimeOff" ADD CONSTRAINT "StaffTimeOff_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StaffTimeOff" ADD CONSTRAINT "StaffTimeOff_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
