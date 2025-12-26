-- Create owners table
CREATE TABLE public.owners (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  city TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create pets table
CREATE TABLE public.pets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID NOT NULL REFERENCES public.owners(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  species TEXT NOT NULL,
  breed TEXT,
  birth_date DATE,
  weight DECIMAL(5,2),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create visits table
CREATE TABLE public.visits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pet_id UUID NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  doctor_id UUID REFERENCES auth.users(id),
  visit_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reason TEXT NOT NULL,
  diagnosis TEXT,
  treatment TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'scheduled',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.owners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visits ENABLE ROW LEVEL SECURITY;

-- Owners table policies
CREATE POLICY "Admins can manage all owners"
ON public.owners FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Doctors can view all owners"
ON public.owners FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'doctor'));

CREATE POLICY "Doctors can insert owners"
ON public.owners FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'doctor'));

CREATE POLICY "Doctors can update owners"
ON public.owners FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'doctor'));

CREATE POLICY "Customers can view their own owner record"
ON public.owners FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Pets table policies
CREATE POLICY "Admins can manage all pets"
ON public.pets FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Doctors can view all pets"
ON public.pets FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'doctor'));

CREATE POLICY "Doctors can insert pets"
ON public.pets FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'doctor'));

CREATE POLICY "Doctors can update pets"
ON public.pets FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'doctor'));

CREATE POLICY "Customers can view their own pets"
ON public.pets FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.owners
    WHERE owners.id = pets.owner_id
    AND owners.user_id = auth.uid()
  )
);

-- Visits table policies
CREATE POLICY "Admins can manage all visits"
ON public.visits FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Doctors can view all visits"
ON public.visits FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'doctor'));

CREATE POLICY "Doctors can insert visits"
ON public.visits FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'doctor'));

CREATE POLICY "Doctors can update visits"
ON public.visits FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'doctor'));

CREATE POLICY "Customers can view their own pet visits"
ON public.visits FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.pets
    JOIN public.owners ON owners.id = pets.owner_id
    WHERE pets.id = visits.pet_id
    AND owners.user_id = auth.uid()
  )
);

-- Create triggers for updated_at
CREATE TRIGGER update_owners_updated_at
  BEFORE UPDATE ON public.owners
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_pets_updated_at
  BEFORE UPDATE ON public.pets
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_visits_updated_at
  BEFORE UPDATE ON public.visits
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();