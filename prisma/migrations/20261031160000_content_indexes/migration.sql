-- DropIndex
DROP INDEX "BlogPost_status_idx";

-- DropIndex
DROP INDEX "BlogPost_slug_idx";

-- DropIndex
DROP INDEX "CaseStudy_status_idx";

-- DropIndex
DROP INDEX "CaseStudy_slug_idx";

-- DropIndex
DROP INDEX "CaseStudy_sortOrder_idx";

-- DropIndex
DROP INDEX "Plan_sortOrder_idx";

-- CreateIndex
CREATE INDEX "Account_userId_idx" ON "Account"("userId");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE INDEX "RolePermission_permissionId_idx" ON "RolePermission"("permissionId");

-- CreateIndex
CREATE INDEX "UserRole_roleId_idx" ON "UserRole"("roleId");

-- CreateIndex
CREATE INDEX "BlogPost_status_deleted_publishedAt_idx" ON "BlogPost"("status", "deleted", "publishedAt");

-- CreateIndex
CREATE INDEX "BlogPost_authorId_idx" ON "BlogPost"("authorId");

-- CreateIndex
CREATE INDEX "CaseStudy_status_deleted_sortOrder_idx" ON "CaseStudy"("status", "deleted", "sortOrder");

-- CreateIndex
CREATE INDEX "CaseStudy_authorId_idx" ON "CaseStudy"("authorId");

-- CreateIndex
CREATE INDEX "CaseStudy_customerId_idx" ON "CaseStudy"("customerId");

-- CreateIndex
CREATE INDEX "CaseStudyTechnology_technologyId_idx" ON "CaseStudyTechnology"("technologyId");

-- CreateIndex
CREATE INDEX "CaseStudyTool_toolId_idx" ON "CaseStudyTool"("toolId");

-- CreateIndex
CREATE INDEX "MediaAsset_createdBy_idx" ON "MediaAsset"("createdBy");

-- CreateIndex
CREATE INDEX "LeadNote_leadId_idx" ON "LeadNote"("leadId");

-- CreateIndex
CREATE INDEX "LeadNote_authorId_idx" ON "LeadNote"("authorId");

-- CreateIndex
CREATE INDEX "BookingNote_bookingId_idx" ON "BookingNote"("bookingId");

-- CreateIndex
CREATE INDEX "BookingNote_authorId_idx" ON "BookingNote"("authorId");

-- CreateIndex
CREATE INDEX "Plan_active_sortOrder_idx" ON "Plan"("active", "sortOrder");

