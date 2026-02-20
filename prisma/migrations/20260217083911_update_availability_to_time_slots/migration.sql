/*
  Custom migration to convert availability from startTime/endTime to individual time slots
  
  Warnings:
  - You are about to drop the column `endTime` on the `Availability` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `Availability` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[doctorId,dayOfWeek,time]` on the table `Availability` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `time` to the `Availability` table without a default value. This is not possible if the table is not empty.
*/

-- Step 1: Create backup table with old data
CREATE TABLE "Availability_backup" AS SELECT * FROM "Availability";

-- Step 2: Drop existing Availability table
DROP TABLE "Availability";

-- Step 3: Recreate Availability table with new schema
CREATE TABLE "Availability" (
    "id" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "time" TEXT NOT NULL,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Availability_pkey" PRIMARY KEY ("id")
);

-- Step 4: Add foreign key constraint
ALTER TABLE "Availability" ADD CONSTRAINT "Availability_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Step 5: Generate 30-minute time slots from old data
WITH RECURSIVE time_slots AS (
  -- Base case: start with startTime for each availability record
  SELECT 
    "doctorId",
    "dayOfWeek",
    "isAvailable",
    "createdAt",
    "updatedAt",
    "startTime" as time,
    "startTime",
    "endTime"
  FROM "Availability_backup"
  
  UNION ALL
  
  -- Recursive case: add 30 minutes to generate next slot
  SELECT 
    "doctorId",
    "dayOfWeek",
    "isAvailable",
    "createdAt",
    "updatedAt",
    TO_CHAR((TO_TIMESTAMP(time, 'HH24:MI')::TIME + INTERVAL '30 minutes'), 'HH24:MI') as time,
    "startTime",
    "endTime"
  FROM time_slots
  WHERE TO_TIMESTAMP(time, 'HH24:MI')::TIME + INTERVAL '30 minutes' < TO_TIMESTAMP("endTime", 'HH24:MI')::TIME
)
-- Insert expanded slots into new table
INSERT INTO "Availability" (id, "doctorId", "dayOfWeek", time, "isAvailable", "createdAt", "updatedAt")
SELECT 
  gen_random_uuid(),
  "doctorId",
  "dayOfWeek",
  time,
  "isAvailable",
  "createdAt",
  "updatedAt"
FROM time_slots;

-- Step 6: Drop backup table
DROP TABLE "Availability_backup";

-- Step 7: Create unique constraint
CREATE UNIQUE INDEX "Availability_doctorId_dayOfWeek_time_key" ON "Availability"("doctorId", "dayOfWeek", "time");
