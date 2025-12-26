import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Stethoscope, 
  Star,
  Phone,
  Mail,
  Clock,
  Award,
  Loader2
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AddVetDialog } from "@/components/forms/AddVetDialog";

interface Vet {
  id: string;
  first_name: string;
  last_name: string;
  specialty: string;
  email: string;
  phone: string | null;
  experience_years: number | null;
  availability: string | null;
}

const Vets = () => {
  const [vets, setVets] = useState<Vet[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchVets = async () => {
    setIsLoading(true);
    try {
      const session = await supabase.auth.getSession();
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/veterinarians?select=*&order=first_name`,
        {
          headers: {
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            Authorization: `Bearer ${session.data.session?.access_token}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setVets(data as Vet[]);
      }
    } catch (e) {
      console.error("Failed to fetch vets", e);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchVets();
  }, []);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <Stethoscope className="w-6 h-6 text-blue-600" />
              </div>
              Our Veterinarians
            </h1>
            <p className="text-muted-foreground mt-2">Meet our team of experienced and caring veterinary professionals</p>
          </div>
          <AddVetDialog onSuccess={fetchVets} />
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : vets.length === 0 ? (
          <div className="text-center py-12">
            <Stethoscope className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No veterinarians found. Add your first veterinarian to get started.</p>
          </div>
        ) : (
          /* Vets Grid */
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vets.map((vet, index) => (
              <Card 
                key={vet.id}
                hover
                className="animate-slide-up overflow-hidden"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Header with gradient */}
                <div className="h-20 gradient-hero relative">
                  <div className="absolute -bottom-10 left-6">
                    <div className="w-20 h-20 rounded-2xl bg-card border-4 border-card flex items-center justify-center shadow-soft">
                      <span className="text-2xl font-bold text-primary">
                        {vet.first_name[0]}{vet.last_name[0]}
                      </span>
                    </div>
                  </div>
                </div>
                
                <CardHeader className="pt-12">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">Dr. {vet.first_name} {vet.last_name}</CardTitle>
                      <p className="text-sm text-primary font-medium">{vet.specialty}</p>
                    </div>
                    <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-500/10">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-semibold text-yellow-600">5.0</span>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    {vet.experience_years && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Award className="w-4 h-4 text-primary" />
                        <span>{vet.experience_years} years</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="w-4 h-4" />
                      <span className="truncate">{vet.email}</span>
                    </div>
                    {vet.phone && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="w-4 h-4" />
                        <span>{vet.phone}</span>
                      </div>
                    )}
                    {vet.availability && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>{vet.availability}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="pt-4 border-t border-border/50 flex gap-2">
                    <Button variant="outline" className="flex-1">
                      View Profile
                    </Button>
                    <Button variant="hero" className="flex-1">
                      Book
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Vets;
