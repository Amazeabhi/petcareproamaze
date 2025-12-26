import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  PawPrint, 
  Plus, 
  Search,
  Calendar,
  Heart,
  MoreVertical
} from "lucide-react";

const pets = [
  { 
    id: 1, 
    name: "Max", 
    species: "Dog",
    breed: "Golden Retriever", 
    age: "3 years",
    owner: "John Smith",
    lastVisit: "Dec 20, 2024",
    status: "Healthy",
    color: "Golden"
  },
  { 
    id: 2, 
    name: "Bella", 
    species: "Dog",
    breed: "Labrador", 
    age: "2 years",
    owner: "Emily Davis",
    lastVisit: "Dec 18, 2024",
    status: "Vaccination Due",
    color: "Black"
  },
  { 
    id: 3, 
    name: "Charlie", 
    species: "Dog",
    breed: "Beagle", 
    age: "5 years",
    owner: "Robert Wilson",
    lastVisit: "Dec 15, 2024",
    status: "Under Treatment",
    color: "Tricolor"
  },
  { 
    id: 4, 
    name: "Whiskers", 
    species: "Cat",
    breed: "Persian", 
    age: "4 years",
    owner: "John Smith",
    lastVisit: "Dec 10, 2024",
    status: "Healthy",
    color: "White"
  },
  { 
    id: 5, 
    name: "Luna", 
    species: "Cat",
    breed: "Siamese", 
    age: "1 year",
    owner: "David Miller",
    lastVisit: "Dec 22, 2024",
    status: "Healthy",
    color: "Cream"
  },
  { 
    id: 6, 
    name: "Rocky", 
    species: "Dog",
    breed: "German Shepherd", 
    age: "6 years",
    owner: "David Miller",
    lastVisit: "Dec 5, 2024",
    status: "Checkup Due",
    color: "Black & Tan"
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Healthy":
      return "bg-green-500/10 text-green-600";
    case "Vaccination Due":
      return "bg-yellow-500/10 text-yellow-600";
    case "Under Treatment":
      return "bg-red-500/10 text-red-600";
    case "Checkup Due":
      return "bg-blue-500/10 text-blue-600";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const getSpeciesEmoji = (species: string) => {
  return species === "Dog" ? "🐕" : species === "Cat" ? "🐈" : "🐾";
};

const Pets = () => {
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
          <Button variant="hero">
            <Plus className="w-4 h-4 mr-2" />
            Register Pet
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input 
              placeholder="Search pets by name, breed, or owner..." 
              className="pl-10 h-12 text-base"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline">All</Button>
            <Button variant="secondary">Dogs</Button>
            <Button variant="secondary">Cats</Button>
          </div>
        </div>

        {/* Pets Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pets.map((pet, index) => (
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
                    <p className="text-sm text-muted-foreground">{pet.breed}</p>
                    <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(pet.status)}`}>
                      {pet.status}
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
                    <p className="text-sm font-medium text-foreground">{pet.age}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Color</p>
                    <p className="text-sm font-medium text-foreground">{pet.color}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Owner</p>
                    <p className="text-sm font-medium text-foreground">{pet.owner}</p>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-border/50 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>Last visit: {pet.lastVisit}</span>
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
      </div>
    </Layout>
  );
};

export default Pets;
