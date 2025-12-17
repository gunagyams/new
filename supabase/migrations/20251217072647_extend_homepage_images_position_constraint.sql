/*
  # Extend Homepage Images Position Constraint

  1. Changes
    - Updates the position check constraint to allow positions 0-9 (was 0-8)
    - Enables the Philosophy section's detail image (position 9) to be managed

  2. Security
    - No security changes
*/

ALTER TABLE homepage_images DROP CONSTRAINT IF EXISTS homepage_images_position_check;

ALTER TABLE homepage_images ADD CONSTRAINT homepage_images_position_check 
  CHECK ((position >= 0) AND (position <= 9));