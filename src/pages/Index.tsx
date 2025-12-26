import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  PawPrint, 
  Users, 
  Calendar, 
  Stethoscope, 
  Heart,
  Shield,
  Clock,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";
import heroPets from "@/assets/hero-pets.jpg";

const features = [
  {
    icon: Users,
    title: "Owner Management",
    description: "Keep track of pet owners with detailed profiles and contact information."
  },
  {
    icon: PawPrint,
    title: "Pet Records",
    description: "Comprehensive pet profiles with medical history and important details."
  },
  {
    icon: Calendar,
    title: "Visit Scheduling",
    description: "Easy appointment booking and visit history tracking."
  },
  {
    icon: Stethoscope,
    title: "Vet Directory",
    description: "Access to our qualified veterinarians and their specializations."
  }
];

const stats = [
  { value: "2,500+", label: "Happy Pets" },
  { value: "1,200+", label: "Pet Owners" },
  { value: "15+", label: "Expert Vets" },
  { value: "10,000+", label: "Visits Completed" }
];

const Index = () => {
  return (
    <Layout showNavbar={true}>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-10" />
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <div className="space-y-8 animate-slide-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <Heart className="w-4 h-4" />
                Care for Every Paw
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground leading-tight">
                Welcome to{" "}
                <span className="text-gradient">PetCare Pro</span>
                <br />
                Veterinary Clinic
              </h1>
              
              <p className="text-lg text-muted-foreground max-w-xl">
                Your trusted partner in pet healthcare. PetCare Pro provides comprehensive 
                veterinary services with love and expertise for your furry family members.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link to="/dashboard">
                  <Button variant="hero" size="xl">
                    Get Started
                    <ArrowRight className="w-5 h-5 ml-1" />
                  </Button>
                </Link>
                <Link to="/vets">
                  <Button variant="glass" size="xl">
                    Meet Our Vets
                  </Button>
                </Link>
              </div>
              
              {/* Trust badges */}
              <div className="flex items-center gap-6 pt-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="w-5 h-5 text-primary" />
                  <span>Licensed & Certified</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-5 h-5 text-primary" />
                  <span>24/7 Emergency Care</span>
                </div>
              </div>
            </div>
            
            {/* Hero Image */}
            <div className="relative animate-slide-in-right">
              <div className="absolute -inset-4 gradient-hero rounded-3xl opacity-20 blur-3xl" />
              <div className="relative rounded-3xl overflow-hidden shadow-hover">
                <img 
                  src={heroPets} 
                  alt="Happy pets at HappyPaws clinic" 
                  className="w-full h-auto object-cover"
                />
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-4 -left-4 bg-card rounded-2xl p-4 shadow-soft animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl gradient-warm flex items-center justify-center">
                    <PawPrint className="w-6 h-6 text-accent-foreground" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">98%</p>
                    <p className="text-sm text-muted-foreground">Satisfaction</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y border-border/50 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={stat.label} 
                className="text-center animate-scale-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <p className="text-3xl md:text-4xl font-extrabold text-primary">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Comprehensive Pet Care Management
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need to manage your veterinary clinic efficiently 
              and provide the best care for your patients.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card 
                key={feature.title} 
                hover
                className="animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader>
                  <div className="w-14 h-14 rounded-2xl gradient-hero flex items-center justify-center mb-4 shadow-soft">
                    <feature.icon className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="relative rounded-3xl overflow-hidden">
            <div className="absolute inset-0 gradient-hero" />
            <div className="relative px-8 py-16 md:py-20 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-primary-foreground/80 max-w-xl mx-auto mb-8">
                Join thousands of pet owners who trust PetCare Pro for their 
                pet's healthcare needs.
                Join thousands of pet owners who trust HappyPaws for their 
                pet's healthcare needs.
              </p>
              <Link to="/dashboard">
                <Button variant="glass" size="xl" className="bg-primary-foreground/20 hover:bg-primary-foreground/30 text-primary-foreground border-primary-foreground/30">
                  Explore Dashboard
                  <ArrowRight className="w-5 h-5 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-hero flex items-center justify-center">
                <PawPrint className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-bold text-foreground">PetCare Pro</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 PetCare Pro. Built with love for pets.
            </p>
          </div>
        </div>
      </footer>
    </Layout>
  );
};

export default Index;
