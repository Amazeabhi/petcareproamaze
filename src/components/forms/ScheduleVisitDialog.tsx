import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Plus } from "lucide-react";

const visitSchema = z.object({
  pet_id: z.string().min(1, "Pet is required"),
  doctor_id: z.string().optional(),
  visit_date: z.string().min(1, "Visit date is required"),
  visit_time: z.string().min(1, "Visit time is required"),
  reason: z.string().min(1, "Reason is required").max(200),
  notes: z.string().max(500).optional(),
});

type VisitFormData = z.infer<typeof visitSchema>;

interface Pet {
  id: string;
  name: string;
  species: string;
  owners: { first_name: string; last_name: string } | null;
}

interface Vet {
  id: string;
  first_name: string;
  last_name: string;
  specialty: string;
}

interface ScheduleVisitDialogProps {
  onSuccess?: () => void;
  triggerLabel?: string;
}

export function ScheduleVisitDialog({ onSuccess, triggerLabel = "Schedule Visit" }: ScheduleVisitDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pets, setPets] = useState<Pet[]>([]);
  const [vets, setVets] = useState<Vet[]>([]);

  const form = useForm<VisitFormData>({
    resolver: zodResolver(visitSchema),
    defaultValues: {
      pet_id: "",
      doctor_id: "",
      visit_date: "",
      visit_time: "09:00",
      reason: "",
      notes: "",
    },
  });

  useEffect(() => {
    if (open) {
      fetchPets();
      fetchVets();
    }
  }, [open]);

  const fetchPets = async () => {
    const { data, error } = await supabase
      .from("pets")
      .select(`
        id, 
        name, 
        species, 
        owners!inner(first_name, last_name)
      `)
      .order("name");

    if (data && !error) {
      const formattedPets = data.map(pet => ({
        id: pet.id,
        name: pet.name,
        species: pet.species,
        owners: pet.owners as { first_name: string; last_name: string } | null
      }));
      setPets(formattedPets);
    }
  };

  const fetchVets = async () => {
    try {
      // Using fetch directly since the types might not be updated yet
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/veterinarians?select=id,first_name,last_name,specialty&order=first_name`,
        {
          headers: {
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
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
      
      const { error } = await supabase.from("visits").insert({
        pet_id: data.pet_id,
        doctor_id: data.doctor_id || null,
        visit_date: visitDateTime,
        reason: data.reason,
        notes: data.notes || null,
        status: "scheduled",
      });

      if (error) throw error;

      toast.success("Visit scheduled successfully");
      form.reset();
      setOpen(false);
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.message || "Failed to schedule visit");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="hero">
          <Plus className="w-4 h-4 mr-2" />
          {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Schedule New Visit</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="pet_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pet</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select pet" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {pets.map((pet) => (
                        <SelectItem key={pet.id} value={pet.id}>
                          {pet.name} ({pet.species}) - {pet.owners?.first_name} {pet.owners?.last_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="doctor_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Veterinarian (Optional)</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select veterinarian" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
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
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason for Visit</FormLabel>
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
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Scheduling..." : "Schedule Visit"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
