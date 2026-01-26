/*
  # Remove Media Fields from Services Table

  1. Changes
    - Drop `media_url` column from services table
    - Drop `media_type` column from services table
    
  These fields are no longer needed as background video will be section-level, not per-service.
*/

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'services' AND column_name = 'media_url'
  ) THEN
    ALTER TABLE services DROP COLUMN media_url;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'services' AND column_name = 'media_type'
  ) THEN
    ALTER TABLE services DROP COLUMN media_type;
  END IF;
END $$;