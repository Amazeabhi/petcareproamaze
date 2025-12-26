import { useState } from "react";
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

const vetSchema = z.object({
  first_name: z.string().min(1, "First name is required").max(50),
  last_name: z.string().min(1, "Last name is required").max(50),
  specialty: z.string().min(1, "Specialty is required"),
  email: z.string().email("Invalid email address").max(100),
  phone: z.string().max(20).optional(),
  experience_years: z.string().optional(),
  availability: z.string().max(100).optional(),
});

type VetFormData = z.infer<typeof vetSchema>;

interface AddVetDialogProps {
  onSuccess?: () => void;
}

export function AddVetDialog({ onSuccess }: AddVetDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<VetFormData>({
    resolver: zodResolver(vetSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      specialty: "",
      email: "",
      phone: "",
      experience_years: "",
      availability: "",
    },
  });

  const onSubmit = async (data: VetFormData) => {
    setIsLoading(true);
    try {
      // Using fetch directly since the types might not be updated yet
      const session = await supabase.auth.getSession();
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/veterinarians`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            Authorization: `Bearer ${session.data.session?.access_token}`,
            Prefer: "return=minimal",
          },
          body: JSON.stringify({
            first_name: data.first_name,
            last_name: data.last_name,
            specialty: data.specialty,
            email: data.email,
            phone: data.phone || null,
            experience_years: data.experience_years ? parseInt(data.experience_years) : null,
            availability: data.availability || null,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add veterinarian");
      }

      toast.success("Veterinarian added successfully");
      form.reset();
      setOpen(false);
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.message || "Failed to add veterinarian");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="hero">
          <Plus className="w-4 h-4 mr-2" />
          Add Veterinarian
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Veterinarian</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Sarah" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Johnson" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="specialty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Specialty</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select specialty" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="General Practice">General Practice</SelectItem>
                      <SelectItem value="Surgery & Emergency">Surgery & Emergency</SelectItem>
                      <SelectItem value="Dentistry">Dentistry</SelectItem>
                      <SelectItem value="Dermatology">Dermatology</SelectItem>
                      <SelectItem value="Cardiology">Cardiology</SelectItem>
                      <SelectItem value="Orthopedics">Orthopedics</SelectItem>
                      <SelectItem value="Oncology">Oncology</SelectItem>
                      <SelectItem value="Neurology">Neurology</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="sarah@clinic.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="+1 (555) 123-4567" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="experience_years"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Experience (years)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="10" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="availability"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Availability</FormLabel>
                    <FormControl>
                      <Input placeholder="Mon-Fri, 9AM-5PM" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Adding..." : "Add Veterinarian"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
