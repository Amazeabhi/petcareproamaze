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
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";

const dashboardStats = [
  { 
    title: "Total Owners", 
    value: "1,247", 
    change: "+12%", 
    icon: Users,
    color: "bg-primary/10 text-primary"
  },
  { 
    title: "Registered Pets", 
    value: "2,563", 
    change: "+8%", 
    icon: PawPrint,
    color: "bg-accent/10 text-accent"
  },
  { 
    title: "Visits This Month", 
    value: "342", 
    change: "+24%", 
    icon: Calendar,
    color: "bg-green-500/10 text-green-600"
  },
  { 
    title: "Active Vets", 
    value: "15", 
    change: "0%", 
    icon: Stethoscope,
    color: "bg-blue-500/10 text-blue-600"
  },
];

const recentVisits = [
  { pet: "Max", owner: "John Smith", vet: "Dr. Sarah Johnson", date: "Today, 10:00 AM", type: "Checkup" },
  { pet: "Bella", owner: "Emily Davis", vet: "Dr. Michael Chen", date: "Today, 11:30 AM", type: "Vaccination" },
  { pet: "Charlie", owner: "Robert Wilson", vet: "Dr. Sarah Johnson", date: "Today, 2:00 PM", type: "Surgery" },
  { pet: "Luna", owner: "Jessica Brown", vet: "Dr. Emma White", date: "Yesterday", type: "Dental" },
];

const upcomingAppointments = [
  { pet: "Rocky", owner: "David Miller", time: "3:00 PM", type: "Checkup" },
  { pet: "Milo", owner: "Sarah Taylor", time: "4:30 PM", type: "Vaccination" },
  { pet: "Coco", owner: "James Anderson", time: "5:00 PM", type: "Grooming" },
];

const Dashboard = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here's what's happening today.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Calendar className="w-4 h-4 mr-2" />
              View Calendar
            </Button>
            <Button variant="hero">
              <Plus className="w-4 h-4 mr-2" />
              New Appointment
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
                  <span className="text-sm text-primary flex items-center">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {stat.change}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Visits */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Visits</CardTitle>
              <Link to="/visits">
                <Button variant="ghost" size="sm">
                  View All
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentVisits.map((visit, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl gradient-hero flex items-center justify-center">
                        <PawPrint className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{visit.pet}</p>
                        <p className="text-sm text-muted-foreground">Owner: {visit.owner}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground">{visit.type}</p>
                      <p className="text-sm text-muted-foreground">{visit.vet}</p>
                      <p className="text-xs text-muted-foreground">{visit.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Appointments */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Today's Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingAppointments.map((apt, index) => (
                  <div 
                    key={index}
                    className="p-4 rounded-xl border border-border/50 hover:border-primary/30 hover:shadow-soft transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-foreground">{apt.pet}</span>
                      <span className="text-sm font-medium text-primary">{apt.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{apt.owner}</p>
                    <span className="inline-block mt-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                      {apt.type}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-foreground mb-4">Quick Actions</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
            <Link to="/vets">
              <Card hover className="p-6 text-center">
                <Stethoscope className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <p className="font-semibold text-foreground">View Vets</p>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
