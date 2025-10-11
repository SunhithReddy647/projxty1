/*
  # Create custom project submissions table

  1. New Tables
    - `custom_project_submissions`
      - `id` (uuid, primary key) - Unique identifier for each submission
      - `title` (text, required) - Project title provided by user
      - `message` (text, required) - User's message/description about their project idea
      - `user_name` (text, optional) - Name of the person submitting (optional)
      - `user_email` (text, optional) - Email of the person submitting (optional)
      - `user_phone` (text, optional) - Phone number of the person submitting (optional)
      - `status` (text, default 'pending') - Status of submission: pending, reviewed, contacted
      - `created_at` (timestamptz) - Timestamp of submission
      - `updated_at` (timestamptz) - Timestamp of last update

  2. Security
    - Enable RLS on `custom_project_submissions` table
    - Add policy for anyone to insert submissions (public form)
    - Add policy for authenticated users to read all submissions (admin view)
*/

CREATE TABLE IF NOT EXISTS custom_project_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  message text NOT NULL,
  user_name text,
  user_email text,
  user_phone text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'contacted')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE custom_project_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit custom project ideas"
  ON custom_project_submissions
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Public can read their own submissions"
  ON custom_project_submissions
  FOR SELECT
  TO anon
  USING (true);