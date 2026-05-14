-- CreateEnum
CREATE TYPE "Severity" AS ENUM ('low', 'medium', 'high');

-- CreateTable
CREATE TABLE "InterviewReport" (
    "id" TEXT NOT NULL,
    "resume" TEXT NOT NULL,
    "selfDescription" TEXT NOT NULL,
    "matchScore" INTEGER,
    "title" TEXT NOT NULL,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InterviewReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TechnicalQuestion" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "intention" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "reportId" TEXT NOT NULL,

    CONSTRAINT "TechnicalQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BehavioralQuestion" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "intention" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "reportId" TEXT NOT NULL,

    CONSTRAINT "BehavioralQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SkillGap" (
    "id" TEXT NOT NULL,
    "skill" TEXT NOT NULL,
    "severity" "Severity" NOT NULL,
    "reportId" TEXT NOT NULL,

    CONSTRAINT "SkillGap_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PreparationPlan" (
    "id" TEXT NOT NULL,
    "day" TEXT NOT NULL,
    "focus" TEXT NOT NULL,
    "tasks" TEXT[],
    "reportId" TEXT NOT NULL,

    CONSTRAINT "PreparationPlan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "InterviewReport_userId_idx" ON "InterviewReport"("userId");

-- CreateIndex
CREATE INDEX "TechnicalQuestion_reportId_idx" ON "TechnicalQuestion"("reportId");

-- CreateIndex
CREATE INDEX "BehavioralQuestion_reportId_idx" ON "BehavioralQuestion"("reportId");

-- CreateIndex
CREATE INDEX "SkillGap_reportId_idx" ON "SkillGap"("reportId");

-- CreateIndex
CREATE INDEX "PreparationPlan_reportId_idx" ON "PreparationPlan"("reportId");

-- AddForeignKey
ALTER TABLE "InterviewReport" ADD CONSTRAINT "InterviewReport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TechnicalQuestion" ADD CONSTRAINT "TechnicalQuestion_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "InterviewReport"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BehavioralQuestion" ADD CONSTRAINT "BehavioralQuestion_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "InterviewReport"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SkillGap" ADD CONSTRAINT "SkillGap_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "InterviewReport"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PreparationPlan" ADD CONSTRAINT "PreparationPlan_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "InterviewReport"("id") ON DELETE CASCADE ON UPDATE CASCADE;
