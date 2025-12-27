-- Create veterinarians table
CREATE TABLE public.veterinarians (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  specialty TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  experience_years INTEGER,
  availability TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.veterinarians ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Admins can manage all veterinarians" 
ON public.veterinarians 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Doctors can view all veterinarians" 
ON public.veterinarians 
FOR SELECT 
USING (has_role(auth.uid(), 'doctor'::app_role));

CREATE POLICY "Doctors can insert veterinarians" 
ON public.veterinarians 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'doctor'::app_role));

CREATE POLICY "Customers can view veterinarians" 
ON public.veterinarians 
FOR SELECT 
USING (has_role(auth.uid(), 'customer'::app_role));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_veterinarians_updated_at
BEFORE UPDATE ON public.veterinarians
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();