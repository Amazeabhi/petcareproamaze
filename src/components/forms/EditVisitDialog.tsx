import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";

const visitSchema = z.object({
  doctor_id: z.string().optional(),
  visit_date: z.string().min(1, "Visit date is required"),
  visit_time: z.string().min(1, "Visit time is required"),
  reason: z.string().min(1, "Reason is required").max(200),
  status: z.string().min(1, "Status is required"),
  notes: z.string().max(500).optional(),
  diagnosis: z.string().max(500).optional(),
  treatment: z.string().max(500).optional(),
});

type VisitFormData = z.infer<typeof visitSchema>;

interface Vet {
  id: string;
  first_name: string;
  last_name: string;
  specialty: string;
}

interface EditVisitDialogProps {
  visit: {
    id: string;
    visit_date: string;
    reason: string;
    status: string;
    notes: string | null;
    diagnosis: string | null;
    treatment: string | null;
    doctor_id?: string;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function EditVisitDialog({ visit, open, onOpenChange, onSuccess }: EditVisitDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [vets, setVets] = useState<Vet[]>([]);

  const visitDate = new Date(visit.visit_date);

  const form = useForm<VisitFormData>({
    resolver: zodResolver(visitSchema),
    defaultValues: {
      doctor_id: visit.doctor_id || "none",
      visit_date: format(visitDate, "yyyy-MM-dd"),
      visit_time: format(visitDate, "HH:mm"),
      reason: visit.reason,
      status: visit.status,
      notes: visit.notes || "",
      diagnosis: visit.diagnosis || "",
      treatment: visit.treatment || "",
    },
  });

  useEffect(() => {
    if (open) {
      fetchVets();
      // Reset form with visit data when dialog opens
      const visitDate = new Date(visit.visit_date);
      form.reset({
        doctor_id: visit.doctor_id || "none",
        visit_date: format(visitDate, "yyyy-MM-dd"),
        visit_time: format(visitDate, "HH:mm"),
        reason: visit.reason,
        status: visit.status,
        notes: visit.notes || "",
        diagnosis: visit.diagnosis || "",
        treatment: visit.treatment || "",
      });
    }
  }, [open, visit]);

  const fetchVets = async () => {
    try {
      const session = await supabase.auth.getSession();
      const token = session.data.session?.access_token;
      
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/veterinarians?select=id,first_name,last_name,specialty&order=first_name`,
        {
          headers: {
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            Authorization: token ? `Bearer ${token}` : '',
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setVets(data as Vet[]);
      }
    } catch (e) {
      console.error("Failed to fetch vets", e);
    }
  };

  const onSubmit = async (data: VisitFormData) => {
    setIsLoading(true);
    try {
      const visitDateTime = `${data.visit_date}T${data.visit_time}:00`;
      
      const { error } = await supabase
        .from("visits")
        .update({
          doctor_id: data.doctor_id && data.doctor_id !== "none" ? data.doctor_id : null,
          visit_date: visitDateTime,
          reason: data.reason,
          status: data.status,
          notes: data.notes || null,
          diagnosis: data.diagnosis || null,
          treatment: data.treatment || null,
        })
        .eq("id", visit.id);

      if (error) throw error;

      toast.success("Visit updated successfully");
      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.message || "Failed to update visit");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Visit</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="doctor_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Veterinarian</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select veterinarian" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">Unassigned</SelectItem>
                      {vets.map((vet) => (
                        <SelectItem key={vet.id} value={vet.id}>
                          Dr. {vet.first_name} {vet.last_name} - {vet.specialty}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="visit_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="visit_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reason</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select reason" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Annual Checkup">Annual Checkup</SelectItem>
                        <SelectItem value="Vaccination">Vaccination</SelectItem>
                        <SelectItem value="Dental Cleaning">Dental Cleaning</SelectItem>
                        <SelectItem value="Surgery">Surgery</SelectItem>
                        <SelectItem value="Emergency">Emergency</SelectItem>
                        <SelectItem value="Follow-up">Follow-up</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                        <SelectItem value="in progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="diagnosis"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Diagnosis</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter diagnosis..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="treatment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Treatment</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter treatment..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Any additional notes..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}