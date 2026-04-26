-- Policy: Allow authenticated users (admins) to delete contact submissions
CREATE POLICY "Allow authenticated deletes" 
ON public.contact_submissions FOR DELETE 
TO authenticated 
USING (true);
