-- This is an empty migration.

ALTER TABLE "Unit" ADD CONSTRAINT "rentAmount" CHECK ("rentAmount" > 0);

ALTER TABLE "Unit" ADD CONSTRAINT "deposit" CHECK ("deposit" > 0);