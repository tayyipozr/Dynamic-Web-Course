/*
  Warnings:

  - You are about to drop the column `carCategoriesId` on the `cars` table. All the data in the column will be lost.
  - You are about to drop the column `modelId` on the `cars` table. All the data in the column will be lost.
  - You are about to drop the `car_categories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `models` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `category` to the `cars` table without a default value. This is not possible if the table is not empty.
  - Added the required column `model` to the `cars` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `cars` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "cars" DROP CONSTRAINT "cars_carCategoriesId_fkey";

-- DropForeignKey
ALTER TABLE "models" DROP CONSTRAINT "models_carId_fkey";

-- AlterTable
ALTER TABLE "cars" DROP COLUMN "carCategoriesId",
DROP COLUMN "modelId",
ADD COLUMN     "category" TEXT NOT NULL,
ADD COLUMN     "model" TEXT NOT NULL,
ADD COLUMN     "price" INTEGER NOT NULL;

-- DropTable
DROP TABLE "car_categories";

-- DropTable
DROP TABLE "models";
