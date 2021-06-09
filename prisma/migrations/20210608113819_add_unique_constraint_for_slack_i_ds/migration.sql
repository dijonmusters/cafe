/*
  Warnings:

  - A unique constraint covering the columns `[slackId]` on the table `Team` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slackId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Team.slackId_unique" ON "Team"("slackId");

-- CreateIndex
CREATE UNIQUE INDEX "User.slackId_unique" ON "User"("slackId");
