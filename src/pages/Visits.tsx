import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Plus, 
  Clock,
  User,
  PawPrint,
  Stethoscope,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";

const visits = [
  { 
    id: 1, 
    pet: "Max",
    petType: "Dog",
    owner: "John Smith",
    vet: "Dr. Sarah Johnson",
    date: "Dec 26, 2024",
    time: "10:00 AM",
    type: "Annual Checkup",
    status: "Completed",
    notes: "All vitals normal. Recommended dental cleaning."
  },
  { 
    id: 2, 
    pet: "Bella",
    petType: "Dog",
    owner: "Emily Davis",
    vet: "Dr. Michael Chen",
    date: "Dec 26, 2024",
    time: "11:30 AM",
    type: "Vaccination",
    status: "Completed",
    notes: "Rabies and DHPP vaccines administered."
  },
  { 
    id: 3, 
    pet: "Charlie",
    petType: "Dog",
    owner: "Robert Wilson",
    vet: "Dr. Sarah Johnson",
    date: "Dec 26, 2024",
    time: "2:00 PM",
    type: "Surgery - Neutering",
    status: "In Progress",
    notes: "Pre-surgery prep completed."
  },
  { 
    id: 4, 
    pet: "Whiskers",
    petType: "Cat",
    owner: "John Smith",
    vet: "Dr. Emma White",
    date: "Dec 27, 2024",
    time: "9:00 AM",
    type: "Dental Cleaning",
    status: "Scheduled",
    notes: "Owner requested mild sedation."
  },
  { 
    id: 5, 
    pet: "Luna",
    petType: "Cat",
    owner: "David Miller",
    vet: "Dr. James Brown",
    date: "Dec 27, 2024",
    time: "10:30 AM",
    type: "General Checkup",
    status: "Scheduled",
    notes: "New patient - first visit."
  },
  { 
    id: 6, 
    pet: "Rocky",
    petType: "Dog",
    owner: "David Miller",
    vet: "Dr. Sarah Johnson",
    date: "Dec 24, 2024",
    time: "3:00 PM",
    type: "Emergency",
    status: "Cancelled",
    notes: "Owner cancelled - issue resolved at home."
  },
];

const getStatusInfo = (status: string) => {
  switch (status) {
    case "Completed":
      return { color: "bg-green-500/10 text-green-600 border-green-200", icon: CheckCircle };
    case "In Progress":
      return { color: "bg-blue-500/10 text-blue-600 border-blue-200", icon: Clock };
    case "Scheduled":
      return { color: "bg-yellow-500/10 text-yellow-600 border-yellow-200", icon: AlertCircle };
    case "Cancelled":
      return { color: "bg-red-500/10 text-red-600 border-red-200", icon: XCircle };
    default:
      return { color: "bg-muted text-muted-foreground", icon: AlertCircle };
  }
};

const getTypeColor = (type: string) => {
  if (type.includes("Emergency")) return "bg-red-500/10 text-red-600";
  if (type.includes("Surgery")) return "bg-purple-500/10 text-purple-600";
  if (type.includes("Vaccination")) return "bg-blue-500/10 text-blue-600";
  return "bg-primary/10 text-primary";
};

const Visits = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              Visit Records
            </h1>
            <p className="text-muted-foreground mt-2">Track and manage all pet visits and appointments</p>
          </div>
          <Button variant="hero">
            <Plus className="w-4 h-4 mr-2" />
            Schedule Visit
          </Button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <Button variant="default">All Visits</Button>
          <Button variant="secondary">Scheduled</Button>
          <Button variant="secondary">In Progress</Button>
          <Button variant="secondary">Completed</Button>
          <Button variant="secondary">Cancelled</Button>
        </div>

        {/* Visits List */}
        <div className="space-y-4">
          {visits.map((visit, index) => {
            const statusInfo = getStatusInfo(visit.status);
            const StatusIcon = statusInfo.icon;
            
            return (
              <Card 
                key={visit.id}
                hover
                className="animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    {/* Pet Info */}
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-14 h-14 rounded-2xl gradient-hero flex items-center justify-center text-2xl">
                        {visit.petType === "Dog" ? "🐕" : "🐈"}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                          {visit.pet}
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getTypeColor(visit.type)}`}>
                            {visit.type}
                          </span>
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {visit.owner}
                          </span>
                          <span className="flex items-center gap-1">
                            <Stethoscope className="w-3 h-3" />
                            {visit.vet}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Date & Time */}
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Date</p>
                        <p className="font-semibold text-foreground">{visit.date}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Time</p>
                        <p className="font-semibold text-foreground">{visit.time}</p>
                      </div>
                      <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${statusInfo.color}`}>
                        <StatusIcon className="w-4 h-4" />
                        <span className="font-medium">{visit.status}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Notes */}
                  <div className="mt-4 pt-4 border-t border-border/50">
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">Notes: </span>
                      {visit.notes}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};

export default Visits;
