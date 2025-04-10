/*
  Warnings:

  - A unique constraint covering the columns `[codigo]` on the table `lotes` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `codigo` to the `lotes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "lotes" ADD COLUMN     "codigo" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "lotes_codigo_key" ON "lotes"("codigo");
