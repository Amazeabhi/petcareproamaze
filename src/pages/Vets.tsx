import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Stethoscope, 
  Plus,
  Star,
  Phone,
  Mail,
  Calendar,
  Clock,
  Award
} from "lucide-react";

const veterinarians = [
  { 
    id: 1, 
    name: "Dr. Sarah Johnson",
    specialty: "General Practice",
    experience: "12 years",
    rating: 4.9,
    reviews: 156,
    email: "sarah.johnson@happypaws.com",
    phone: "+1 (555) 111-2222",
    availability: "Mon-Fri, 9AM-5PM",
    image: "SJ"
  },
  { 
    id: 2, 
    name: "Dr. Michael Chen",
    specialty: "Surgery & Emergency",
    experience: "15 years",
    rating: 4.8,
    reviews: 203,
    email: "michael.chen@happypaws.com",
    phone: "+1 (555) 222-3333",
    availability: "Mon-Sat, 8AM-6PM",
    image: "MC"
  },
  { 
    id: 3, 
    name: "Dr. Emma White",
    specialty: "Dentistry",
    experience: "8 years",
    rating: 4.9,
    reviews: 98,
    email: "emma.white@happypaws.com",
    phone: "+1 (555) 333-4444",
    availability: "Tue-Fri, 10AM-6PM",
    image: "EW"
  },
  { 
    id: 4, 
    name: "Dr. James Brown",
    specialty: "Dermatology",
    experience: "10 years",
    rating: 4.7,
    reviews: 87,
    email: "james.brown@happypaws.com",
    phone: "+1 (555) 444-5555",
    availability: "Mon-Thu, 9AM-4PM",
    image: "JB"
  },
  { 
    id: 5, 
    name: "Dr. Lisa Martinez",
    specialty: "Cardiology",
    experience: "14 years",
    rating: 4.9,
    reviews: 124,
    email: "lisa.martinez@happypaws.com",
    phone: "+1 (555) 555-6666",
    availability: "Mon-Fri, 8AM-5PM",
    image: "LM"
  },
  { 
    id: 6, 
    name: "Dr. David Kim",
    specialty: "Orthopedics",
    experience: "11 years",
    rating: 4.8,
    reviews: 142,
    email: "david.kim@happypaws.com",
    phone: "+1 (555) 666-7777",
    availability: "Wed-Sun, 9AM-5PM",
    image: "DK"
  },
];

const Vets = () => {
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
          <Button variant="hero">
            <Plus className="w-4 h-4 mr-2" />
            Add Veterinarian
          </Button>
        </div>

        {/* Vets Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {veterinarians.map((vet, index) => (
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
                    <span className="text-2xl font-bold text-primary">{vet.image}</span>
                  </div>
                </div>
              </div>
              
              <CardHeader className="pt-12">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{vet.name}</CardTitle>
                    <p className="text-sm text-primary font-medium">{vet.specialty}</p>
                  </div>
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-500/10">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-semibold text-yellow-600">{vet.rating}</span>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Award className="w-4 h-4 text-primary" />
                    <span>{vet.experience}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Star className="w-4 h-4 text-primary" />
                    <span>{vet.reviews} reviews</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    <span className="truncate">{vet.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="w-4 h-4" />
                    <span>{vet.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{vet.availability}</span>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-border/50 flex gap-2">
                  <Button variant="outline" className="flex-1">
                    View Profile
                  </Button>
                  <Button variant="hero" className="flex-1">
                    <Calendar className="w-4 h-4 mr-1" />
                    Book
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

export default Vets;
