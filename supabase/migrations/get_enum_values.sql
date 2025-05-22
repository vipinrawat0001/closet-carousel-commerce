
-- Function to retrieve enum values dynamically
CREATE OR REPLACE FUNCTION public.get_enum_values(enum_name text)
RETURNS text[] 
LANGUAGE plpgsql
AS $$
DECLARE
  values text[];
BEGIN
  EXECUTE format('SELECT array_agg(enumlabel) FROM pg_enum WHERE enumtypid = ''%I''::regtype', enum_name) 
  INTO values;
  RETURN values;
END;
$$;
