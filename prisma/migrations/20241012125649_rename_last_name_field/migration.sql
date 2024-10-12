/*
  Warnings:

  - You are about to drop the column `last_lame` on the `contacts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "contacts" DROP COLUMN "last_lame",
ADD COLUMN     "last_name" VARCHAR(100);
