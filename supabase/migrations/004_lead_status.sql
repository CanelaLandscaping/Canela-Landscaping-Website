-- Migration: Convert contact_submissions status to Enum

-- 1. Create the enum type if it doesn't already exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'lead_status') THEN
        CREATE TYPE lead_status AS ENUM ('New', 'Read', 'Contacted');
    END IF;
END $$;

-- 2. Modify the contact_submissions table
-- We drop the default first to avoid the casting error the user encountered
ALTER TABLE public.contact_submissions ALTER COLUMN status DROP DEFAULT;

-- 3. Change the column type with explicit casting
ALTER TABLE public.contact_submissions 
    ALTER COLUMN status TYPE lead_status 
    USING (
        CASE 
            WHEN status ILIKE 'New' THEN 'New'::lead_status
            WHEN status ILIKE 'Read' THEN 'Read'::lead_status
            WHEN status ILIKE 'Contacted' THEN 'Contacted'::lead_status
            ELSE 'New'::lead_status
        END
    );

-- 4. Re-apply the default value with the new type
ALTER TABLE public.contact_submissions ALTER COLUMN status SET DEFAULT 'New'::lead_status;
