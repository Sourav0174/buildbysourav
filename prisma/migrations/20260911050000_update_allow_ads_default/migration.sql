-- AlterTable
ALTER TABLE "Post" ALTER COLUMN "allowAds" SET DEFAULT false;

-- Ensure all existing posts have allowAds set to false
UPDATE "Post" SET "allowAds" = false WHERE "allowAds" = true;
