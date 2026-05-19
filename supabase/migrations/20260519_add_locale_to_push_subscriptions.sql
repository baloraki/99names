-- Add locale column to push_subscriptions to support language-aware push notification routing.
-- Existing rows will default to NULL; the application treats NULL as 'en'.
ALTER TABLE push_subscriptions
  ADD COLUMN IF NOT EXISTS locale TEXT CHECK (locale IN ('en', 'de', 'tr'));
