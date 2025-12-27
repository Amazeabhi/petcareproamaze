import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Clock,
  User,
  Stethoscope,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  Pencil,
  Trash2
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ScheduleVisitDialog } from "@/components/forms/ScheduleVisitDialog";
import { EditVisitDialog } from "@/components/forms/EditVisitDialog";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Visit {
  id: string;
  visit_date: string;
  reason: string;
  status: string;
  notes: string | null;
  diagnosis: string | null;
  treatment: string | null;
  doctor_id?: string;
  pets: {
    name: string;
    species: string;
    owners: { first_name: string; last_name: string } | null;
  } | null;
  vet_first_name?: string;
  vet_last_name?: string;
}

const getStatusInfo = (status: string) => {
  switch (status.toLowerCase()) {
    case "completed":
      return { color: "bg-green-500/10 text-green-600 border-green-200", icon: CheckCircle };
    case "in progress":
    case "in_progress":
      return { color: "bg-blue-500/10 text-blue-600 border-blue-200", icon: Clock };
    case "scheduled":
      return { color: "bg-yellow-500/10 text-yellow-600 border-yellow-200", icon: AlertCircle };
    case "cancelled":
      return { color: "bg-red-500/10 text-red-600 border-red-200", icon: XCircle };
    default:
      return { color: "bg-muted text-muted-foreground", icon: AlertCircle };
  }
};

const getTypeColor = (type: string) => {
  if (type.toLowerCase().includes("emergency")) return "bg-red-500/10 text-red-600";
  if (type.toLowerCase().includes("surgery")) return "bg-purple-500/10 text-purple-600";
  if (type.toLowerCase().includes("vaccination")) return "bg-blue-500/10 text-blue-600";
  return "bg-primary/10 text-primary";
};

const Visits = () => {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [editingVisit, setEditingVisit] = useState<Visit | null>(null);
  const [deletingVisitId, setDeletingVisitId] = useState<string | null>(null);

  const fetchVisits = async () => {
    setIsLoading(true);
    
    const { data, error } = await supabase
      .from("visits")
      .select(`
        id,
        visit_date,
        reason,
        status,
        notes,
        diagnosis,
        treatment,
        doctor_id,
        pets!inner(
          name,
          species,
          owners!inner(first_name, last_name)
        )
      `)
      .order("visit_date", { ascending: false });

    if (data && !error) {
      // Fetch veterinarian names separately if doctor_id exists
      const visitsWithVets = await Promise.all(
        data.map(async (visit: any) => {
          let vet_first_name = undefined;
          let vet_last_name = undefined;
          
          if (visit.doctor_id) {
            try {
              const response = await fetch(
                `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/veterinarians?id=eq.${visit.doctor_id}&select=first_name,last_name`,
                {
                  headers: {
                    apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
                    Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
                  },
                }
              );
              if (response.ok) {
                const vetData = await response.json();
                if (vetData.length > 0) {
                  vet_first_name = vetData[0].first_name;
                  vet_last_name = vetData[0].last_name;
                }
              }
            } catch (e) {
              console.error("Failed to fetch vet", e);
            }
          }
          
          return {
            ...visit,
            pets: visit.pets as Visit["pets"],
            vet_first_name,
            vet_last_name,
          };
        })
      );
      
      setVisits(visitsWithVets);
    }
    setIsLoading(false);
  };

  const handleDelete = async () => {
    if (!deletingVisitId) return;
    
    try {
      const { error } = await supabase
        .from("visits")
        .delete()
        .eq("id", deletingVisitId);

      if (error) throw error;

      toast.success("Visit deleted successfully");
      setDeletingVisitId(null);
      fetchVisits();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete visit");
    }
  };

  useEffect(() => {
    fetchVisits();
  }, []);

  const filteredVisits = visits.filter(visit => {
    if (statusFilter === "all") return true;
    return visit.status.toLowerCase() === statusFilter.toLowerCase();
  });

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
          <ScheduleVisitDialog onSuccess={fetchVisits} />
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <Button 
            variant={statusFilter === "all" ? "default" : "secondary"}
            onClick={() => setStatusFilter("all")}
          >
            All Visits
          </Button>
          <Button 
            variant={statusFilter === "scheduled" ? "default" : "secondary"}
            onClick={() => setStatusFilter("scheduled")}
          >
            Scheduled
          </Button>
          <Button 
            variant={statusFilter === "in progress" ? "default" : "secondary"}
            onClick={() => setStatusFilter("in progress")}
          >
            In Progress
          </Button>
          <Button 
            variant={statusFilter === "completed" ? "default" : "secondary"}
            onClick={() => setStatusFilter("completed")}
          >
            Completed
          </Button>
          <Button 
            variant={statusFilter === "cancelled" ? "default" : "secondary"}
            onClick={() => setStatusFilter("cancelled")}
          >
            Cancelled
          </Button>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filteredVisits.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No visits found. Schedule your first visit to get started.</p>
          </div>
        ) : (
          /* Visits List */
          <div className="space-y-4">
            {filteredVisits.map((visit, index) => {
              const statusInfo = getStatusInfo(visit.status);
              const StatusIcon = statusInfo.icon;
              const visitDate = new Date(visit.visit_date);
              
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
                          {visit.pets?.species === "Dog" ? "🐕" : visit.pets?.species === "Cat" ? "🐈" : "🐾"}
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                            {visit.pets?.name || "Unknown Pet"}
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getTypeColor(visit.reason)}`}>
                              {visit.reason}
                            </span>
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                            <span className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {visit.pets?.owners ? `${visit.pets.owners.first_name} ${visit.pets.owners.last_name}` : "Unknown"}
                            </span>
                            {(visit.vet_first_name || visit.vet_last_name) && (
                              <span className="flex items-center gap-1">
                                <Stethoscope className="w-3 h-3" />
                                Dr. {visit.vet_first_name} {visit.vet_last_name}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Date & Time */}
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">Date</p>
                          <p className="font-semibold text-foreground">{format(visitDate, "MMM d, yyyy")}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">Time</p>
                          <p className="font-semibold text-foreground">{format(visitDate, "h:mm a")}</p>
                        </div>
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${statusInfo.color}`}>
                          <StatusIcon className="w-4 h-4" />
                          <span className="font-medium capitalize">{visit.status}</span>
                        </div>
                        
                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setEditingVisit(visit)}
                            className="h-9 w-9"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeletingVisitId(visit.id)}
                            className="h-9 w-9 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Notes */}
                    {visit.notes && (
                      <div className="mt-4 pt-4 border-t border-border/50">
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium text-foreground">Notes: </span>
                          {visit.notes}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      {editingVisit && (
        <EditVisitDialog
          visit={editingVisit}
          open={!!editingVisit}
          onOpenChange={(open) => !open && setEditingVisit(null)}
          onSuccess={fetchVisits}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingVisitId} onOpenChange={(open) => !open && setDeletingVisitId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Visit</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this visit? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
};

export default Visits;
