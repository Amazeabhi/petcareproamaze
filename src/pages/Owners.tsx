import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Users, 
  Plus, 
  Search, 
  Phone, 
  Mail, 
  MapPin,
  PawPrint,
  MoreVertical
} from "lucide-react";

const owners = [
  { 
    id: 1, 
    name: "John Smith", 
    email: "john.smith@email.com", 
    phone: "+1 (555) 123-4567",
    address: "123 Oak Street, Springfield",
    pets: ["Max (Golden Retriever)", "Whiskers (Cat)"],
    totalVisits: 12
  },
  { 
    id: 2, 
    name: "Emily Davis", 
    email: "emily.davis@email.com", 
    phone: "+1 (555) 234-5678",
    address: "456 Maple Avenue, Riverside",
    pets: ["Bella (Labrador)"],
    totalVisits: 8
  },
  { 
    id: 3, 
    name: "Robert Wilson", 
    email: "robert.wilson@email.com", 
    phone: "+1 (555) 345-6789",
    address: "789 Pine Road, Lakewood",
    pets: ["Charlie (Beagle)", "Luna (Persian Cat)", "Nemo (Fish)"],
    totalVisits: 15
  },
  { 
    id: 4, 
    name: "Jessica Brown", 
    email: "jessica.brown@email.com", 
    phone: "+1 (555) 456-7890",
    address: "321 Elm Street, Hillside",
    pets: ["Coco (Poodle)"],
    totalVisits: 6
  },
  { 
    id: 5, 
    name: "David Miller", 
    email: "david.miller@email.com", 
    phone: "+1 (555) 567-8901",
    address: "654 Cedar Lane, Parkview",
    pets: ["Rocky (German Shepherd)", "Milo (Siamese Cat)"],
    totalVisits: 20
  },
  { 
    id: 6, 
    name: "Sarah Taylor", 
    email: "sarah.taylor@email.com", 
    phone: "+1 (555) 678-9012",
    address: "987 Birch Avenue, Greenfield",
    pets: ["Daisy (Yorkshire Terrier)"],
    totalVisits: 4
  },
];

const Owners = () => {
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
          <Button variant="hero">
            <Plus className="w-4 h-4 mr-2" />
            Add Owner
          </Button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input 
            placeholder="Search owners by name, email, or phone..." 
            className="pl-10 h-12 text-base"
          />
        </div>

        {/* Owners Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {owners.map((owner, index) => (
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
                      {owner.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <CardTitle className="text-lg">{owner.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{owner.totalVisits} visits</p>
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
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="w-4 h-4" />
                    <span>{owner.phone}</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 mt-0.5" />
                    <span>{owner.address}</span>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-border/50">
                  <p className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                    <PawPrint className="w-4 h-4 text-primary" />
                    Pets ({owner.pets.length})
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {owner.pets.map((pet) => (
                      <span 
                        key={pet}
                        className="px-3 py-1 rounded-full bg-secondary text-sm text-secondary-foreground"
                      >
                        {pet}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Owners;
