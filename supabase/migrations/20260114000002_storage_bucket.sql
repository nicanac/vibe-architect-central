-- Create storage bucket for tool logos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'tool-logos',
  'tool-logos',
  true,
  2097152, -- 2MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
) ON CONFLICT (id) DO NOTHING;

-- Note: RLS is already enabled on storage.objects by default in Supabase
-- The policies below manage access to the tool-logos bucket

-- Policy: Anyone can view tool logos
CREATE POLICY "Public can view tool logos"
ON storage.objects FOR SELECT
USING (bucket_id = 'tool-logos');

-- Policy: Authenticated users can upload to their folder
CREATE POLICY "Authenticated users can upload tool logos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'tool-logos'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Users can update their own uploads
CREATE POLICY "Users can update own tool logos"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'tool-logos'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Users can delete their own uploads
CREATE POLICY "Users can delete own tool logos"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'tool-logos'
  AND (storage.foldername(name))[1] = auth.uid()::text
);
