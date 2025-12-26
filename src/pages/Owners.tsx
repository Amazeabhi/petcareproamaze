import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Users, 
  Search, 
  Phone, 
  Mail, 
  MapPin,
  PawPrint,
  MoreVertical,
  Loader2
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AddOwnerDialog } from "@/components/forms/AddOwnerDialog";

interface Owner {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  address: string | null;
  city: string | null;
  pets: { id: string; name: string; species: string }[];
}

const Owners = () => {
  const [owners, setOwners] = useState<Owner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchOwners = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("owners")
      .select(`
        id,
        first_name,
        last_name,
        email,
        phone,
        address,
        city,
        pets(id, name, species)
      `)
      .order("first_name");

    if (data && !error) {
      setOwners(data as Owner[]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchOwners();
  }, []);

  const filteredOwners = owners.filter(owner => {
    const fullName = `${owner.first_name} ${owner.last_name}`.toLowerCase();
    const search = searchTerm.toLowerCase();
    return (
      fullName.includes(search) ||
      owner.email.toLowerCase().includes(search) ||
      owner.phone?.includes(search)
    );
  });

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl gradient-hero flex items-center justify-center">
                <Users className="w-6 h-6 text-primary-foreground" />
              </div>
              Pet Owners
            </h1>
            <p className="text-muted-foreground mt-2">Manage pet owner profiles and contact information</p>
          </div>
          <AddOwnerDialog onSuccess={fetchOwners} />
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input 
            placeholder="Search owners by name, email, or phone..." 
            className="pl-10 h-12 text-base"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filteredOwners.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No owners found. Add your first owner to get started.</p>
          </div>
        ) : (
          /* Owners Grid */
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOwners.map((owner, index) => (
              <Card 
                key={owner.id} 
                hover
                className="animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CardHeader className="flex flex-row items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                      <span className="text-xl font-bold text-primary">
                        {owner.first_name[0]}{owner.last_name[0]}
                      </span>
                    </div>
                    <div>
                      <CardTitle className="text-lg">{owner.first_name} {owner.last_name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{owner.pets.length} pet(s)</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="w-4 h-4" />
                      <span>{owner.email}</span>
                    </div>
                    {owner.phone && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="w-4 h-4" />
                        <span>{owner.phone}</span>
                      </div>
                    )}
                    {(owner.address || owner.city) && (
                      <div className="flex items-start gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4 mt-0.5" />
                        <span>{[owner.address, owner.city].filter(Boolean).join(", ")}</span>
                      </div>
                    )}
                  </div>
                  
                  {owner.pets.length > 0 && (
                    <div className="pt-4 border-t border-border/50">
                      <p className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                        <PawPrint className="w-4 h-4 text-primary" />
                        Pets ({owner.pets.length})
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {owner.pets.map((pet) => (
                          <span 
                            key={pet.id}
                            className="px-3 py-1 rounded-full bg-secondary text-sm text-secondary-foreground"
                          >
                            {pet.name} ({pet.species})
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Owners;
