import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  PawPrint, 
  Search,
  Calendar,
  Heart,
  MoreVertical,
  Loader2
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { RegisterPetDialog } from "@/components/forms/RegisterPetDialog";
import { format } from "date-fns";

interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string | null;
  birth_date: string | null;
  weight: number | null;
  notes: string | null;
  created_at: string;
  owners: { first_name: string; last_name: string } | null;
}

const getSpeciesEmoji = (species: string) => {
  switch (species.toLowerCase()) {
    case "dog": return "🐕";
    case "cat": return "🐈";
    case "bird": return "🐦";
    case "rabbit": return "🐰";
    default: return "🐾";
  }
};

const calculateAge = (birthDate: string | null): string => {
  if (!birthDate) return "Unknown";
  const birth = new Date(birthDate);
  const now = new Date();
  const years = now.getFullYear() - birth.getFullYear();
  if (years < 1) {
    const months = (now.getFullYear() - birth.getFullYear()) * 12 + now.getMonth() - birth.getMonth();
    return `${months} month${months !== 1 ? 's' : ''}`;
  }
  return `${years} year${years !== 1 ? 's' : ''}`;
};

const Pets = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [speciesFilter, setSpeciesFilter] = useState<string>("all");

  const fetchPets = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("pets")
      .select(`
        id,
        name,
        species,
        breed,
        birth_date,
        weight,
        notes,
        created_at,
        owners!inner(first_name, last_name)
      `)
      .order("name");

    if (data && !error) {
      const formattedPets = data.map(pet => ({
        ...pet,
        owners: pet.owners as { first_name: string; last_name: string } | null
      }));
      setPets(formattedPets);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchPets();
  }, []);

  const filteredPets = pets.filter(pet => {
    const matchesSearch = 
      pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pet.breed?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${pet.owners?.first_name} ${pet.owners?.last_name}`.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSpecies = speciesFilter === "all" || pet.species.toLowerCase() === speciesFilter.toLowerCase();
    
    return matchesSearch && matchesSpecies;
  });

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl gradient-warm flex items-center justify-center">
                <PawPrint className="w-6 h-6 text-accent-foreground" />
              </div>
              Pets Registry
            </h1>
            <p className="text-muted-foreground mt-2">View and manage all registered pets</p>
          </div>
          <RegisterPetDialog onSuccess={fetchPets} />
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input 
              placeholder="Search pets by name, breed, or owner..." 
              className="pl-10 h-12 text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button 
              variant={speciesFilter === "all" ? "default" : "outline"}
              onClick={() => setSpeciesFilter("all")}
            >
              All
            </Button>
            <Button 
              variant={speciesFilter === "dog" ? "default" : "secondary"}
              onClick={() => setSpeciesFilter("dog")}
            >
              Dogs
            </Button>
            <Button 
              variant={speciesFilter === "cat" ? "default" : "secondary"}
              onClick={() => setSpeciesFilter("cat")}
            >
              Cats
            </Button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filteredPets.length === 0 ? (
          <div className="text-center py-12">
            <PawPrint className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No pets found. Register your first pet to get started.</p>
          </div>
        ) : (
          /* Pets Grid */
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPets.map((pet, index) => (
              <Card 
                key={pet.id} 
                hover
                className="animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CardHeader className="flex flex-row items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl gradient-hero flex items-center justify-center text-3xl">
                      {getSpeciesEmoji(pet.species)}
                    </div>
                    <div>
                      <CardTitle className="text-xl">{pet.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{pet.breed || pet.species}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-600">
                        Healthy
                      </span>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Species</p>
                      <p className="text-sm font-medium text-foreground">{pet.species}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Age</p>
                      <p className="text-sm font-medium text-foreground">{calculateAge(pet.birth_date)}</p>
                    </div>
                    {pet.weight && (
                      <div>
                        <p className="text-xs text-muted-foreground">Weight</p>
                        <p className="text-sm font-medium text-foreground">{pet.weight} kg</p>
                      </div>
                    )}
                    <div>
                      <p className="text-xs text-muted-foreground">Owner</p>
                      <p className="text-sm font-medium text-foreground">
                        {pet.owners ? `${pet.owners.first_name} ${pet.owners.last_name}` : "Unknown"}
                      </p>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-border/50 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>Added: {format(new Date(pet.created_at), "MMM d, yyyy")}</span>
                    </div>
                    <Button variant="ghost" size="sm" className="text-primary">
                      <Heart className="w-4 h-4 mr-1" />
                      Details
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

export default Pets;
