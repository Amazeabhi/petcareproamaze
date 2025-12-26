import { useEffect, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  PawPrint, 
  Calendar, 
  Stethoscope,
  TrendingUp,
  Clock,
  Plus,
  ArrowRight,
  Loader2
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface DashboardStats {
  totalOwners: number;
  totalPets: number;
  totalVisits: number;
  totalDoctors: number;
}

interface Visit {
  id: string;
  reason: string;
  visit_date: string;
  status: string;
  pet: {
    name: string;
    owner: {
      first_name: string;
      last_name: string;
    };
  };
}

interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string | null;
}

const Dashboard = () => {
  const { user, role, isAdmin, isDoctor, isCustomer } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({ 
    totalOwners: 0, 
    totalPets: 0, 
    totalVisits: 0,
    totalDoctors: 0 
  });
  const [recentVisits, setRecentVisits] = useState<Visit[]>([]);
  const [myPets, setMyPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        // Fetch stats based on role
        if (isAdmin || isDoctor) {
          const [ownersRes, petsRes, visitsRes, doctorsRes] = await Promise.all([
            supabase.from("owners").select("id", { count: "exact", head: true }),
            supabase.from("pets").select("id", { count: "exact", head: true }),
            supabase.from("visits").select("id", { count: "exact", head: true }),
            supabase.from("user_roles").select("id", { count: "exact", head: true }).eq("role", "doctor")
          ]);

          setStats({
            totalOwners: ownersRes.count || 0,
            totalPets: petsRes.count || 0,
            totalVisits: visitsRes.count || 0,
            totalDoctors: doctorsRes.count || 0
          });

          // Fetch recent visits with pet and owner info
          const { data: visitsData } = await supabase
            .from("visits")
            .select(`
              id,
              reason,
              visit_date,
              status,
              pet:pets(
                name,
                owner:owners(first_name, last_name)
              )
            `)
            .order("visit_date", { ascending: false })
            .limit(5);

          if (visitsData) {
            setRecentVisits(visitsData as unknown as Visit[]);
          }
        } else if (isCustomer) {
          // Customer sees only their own data
          const { data: ownerData } = await supabase
            .from("owners")
            .select("id")
            .eq("user_id", user.id)
            .maybeSingle();

          if (ownerData) {
            const [petsRes, visitsRes] = await Promise.all([
              supabase.from("pets").select("*").eq("owner_id", ownerData.id),
              supabase.from("visits").select(`
                id,
                reason,
                visit_date,
                status,
                pet:pets(
                  name,
                  owner:owners(first_name, last_name)
                )
              `).order("visit_date", { ascending: false }).limit(5)
            ]);

            setMyPets(petsRes.data || []);
            setStats({
              totalOwners: 1,
              totalPets: petsRes.data?.length || 0,
              totalVisits: 0,
              totalDoctors: 0
            });
            
            if (visitsRes.data) {
              setRecentVisits(visitsRes.data as unknown as Visit[]);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, role, isAdmin, isDoctor, isCustomer]);

  const getRoleDisplayName = () => {
    if (isAdmin) return "Administrator";
    if (isDoctor) return "Veterinarian";
    return "Pet Owner";
  };

  const dashboardStats = isCustomer ? [
    { 
      title: "My Pets", 
      value: stats.totalPets.toString(), 
      icon: PawPrint,
      color: "bg-accent/10 text-accent"
    },
    { 
      title: "My Visits", 
      value: recentVisits.length.toString(), 
      icon: Calendar,
      color: "bg-green-500/10 text-green-600"
    },
  ] : [
    { 
      title: "Total Owners", 
      value: stats.totalOwners.toString(), 
      icon: Users,
      color: "bg-primary/10 text-primary"
    },
    { 
      title: "Registered Pets", 
      value: stats.totalPets.toString(), 
      icon: PawPrint,
      color: "bg-accent/10 text-accent"
    },
    { 
      title: "Total Visits", 
      value: stats.totalVisits.toString(), 
      icon: Calendar,
      color: "bg-green-500/10 text-green-600"
    },
    { 
      title: "Active Doctors", 
      value: stats.totalDoctors.toString(), 
      icon: Stethoscope,
      color: "bg-blue-500/10 text-blue-600"
    },
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return `Today, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {user?.user_metadata?.full_name || user?.email}! 
              <span className="ml-2 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
                {getRoleDisplayName()}
              </span>
            </p>
          </div>
          {(isAdmin || isDoctor) && (
            <div className="flex gap-3">
              <Button variant="outline">
                <Calendar className="w-4 h-4 mr-2" />
                View Calendar
              </Button>
              <Link to="/visits">
                <Button variant="hero">
                  <Plus className="w-4 h-4 mr-2" />
                  New Appointment
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className={`grid gap-6 mb-8 ${isCustomer ? 'sm:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-4'}`}>
          {dashboardStats.map((stat, index) => (
            <Card 
              key={stat.title} 
              hover
              className="animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-foreground">{stat.value}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Visits / My Pets for Customers */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{isCustomer ? "My Pets" : "Recent Visits"}</CardTitle>
              <Link to={isCustomer ? "/pets" : "/visits"}>
                <Button variant="ghost" size="sm">
                  View All
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {isCustomer && myPets.length > 0 ? (
                <div className="space-y-4">
                  {myPets.map((pet) => (
                    <div 
                      key={pet.id}
                      className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl gradient-hero flex items-center justify-center">
                          <PawPrint className="w-6 h-6 text-primary-foreground" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{pet.name}</p>
                          <p className="text-sm text-muted-foreground">{pet.species} {pet.breed && `• ${pet.breed}`}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : recentVisits.length > 0 ? (
                <div className="space-y-4">
                  {recentVisits.map((visit) => (
                    <div 
                      key={visit.id}
                      className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl gradient-hero flex items-center justify-center">
                          <PawPrint className="w-6 h-6 text-primary-foreground" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{visit.pet?.name || "Unknown Pet"}</p>
                          <p className="text-sm text-muted-foreground">
                            Owner: {visit.pet?.owner?.first_name} {visit.pet?.owner?.last_name}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-foreground">{visit.reason}</p>
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                          visit.status === 'completed' ? 'bg-green-100 text-green-700' :
                          visit.status === 'scheduled' ? 'bg-blue-100 text-blue-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {visit.status}
                        </span>
                        <p className="text-xs text-muted-foreground mt-1">{formatDate(visit.visit_date)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <PawPrint className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>{isCustomer ? "No pets registered yet" : "No recent visits"}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upcoming / Info Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                {isCustomer ? "Quick Info" : "Today's Schedule"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isCustomer ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-primary/10">
                    <p className="font-semibold text-foreground mb-2">Need to schedule a visit?</p>
                    <p className="text-sm text-muted-foreground mb-3">
                      Contact our clinic to book an appointment for your pet.
                    </p>
                    <Link to="/visits">
                      <Button size="sm" variant="hero">View My Visits</Button>
                    </Link>
                  </div>
                </div>
              ) : recentVisits.filter(v => v.status === 'scheduled').length > 0 ? (
                <div className="space-y-4">
                  {recentVisits.filter(v => v.status === 'scheduled').slice(0, 3).map((visit) => (
                    <div 
                      key={visit.id}
                      className="p-4 rounded-xl border border-border/50 hover:border-primary/30 hover:shadow-soft transition-all"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-foreground">{visit.pet?.name}</span>
                        <span className="text-sm font-medium text-primary">
                          {new Date(visit.visit_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {visit.pet?.owner?.first_name} {visit.pet?.owner?.last_name}
                      </p>
                      <span className="inline-block mt-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                        {visit.reason}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No scheduled appointments</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions - Only for Admin/Doctor */}
        {(isAdmin || isDoctor) && (
          <div className="mt-8">
            <h2 className="text-xl font-bold text-foreground mb-4">Quick Actions</h2>
            <div className={`grid sm:grid-cols-2 gap-4 ${isAdmin ? 'lg:grid-cols-4' : 'lg:grid-cols-3'}`}>
              <Link to="/owners">
                <Card hover className="p-6 text-center">
                  <Users className="w-8 h-8 text-primary mx-auto mb-3" />
                  <p className="font-semibold text-foreground">Add Owner</p>
                </Card>
              </Link>
              <Link to="/pets">
                <Card hover className="p-6 text-center">
                  <PawPrint className="w-8 h-8 text-accent mx-auto mb-3" />
                  <p className="font-semibold text-foreground">Register Pet</p>
                </Card>
              </Link>
              <Link to="/visits">
                <Card hover className="p-6 text-center">
                  <Calendar className="w-8 h-8 text-green-600 mx-auto mb-3" />
                  <p className="font-semibold text-foreground">Schedule Visit</p>
                </Card>
              </Link>
              {isAdmin && (
                <Link to="/vets">
                  <Card hover className="p-6 text-center">
                    <Stethoscope className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                    <p className="font-semibold text-foreground">Manage Vets</p>
                  </Card>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
