
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { UserData } from "@/contexts/AuthContext";
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
import { Edit, Save, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters").optional(),
  age: z.union([
    z.number().min(1, "Age must be positive").max(120, "Age must be realistic"),
    z.string().transform((val) => {
      const parsed = parseInt(val);
      if (isNaN(parsed)) return undefined;
      return parsed;
    }).optional(),
  ]).optional(),
  gender: z.string().optional(),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface ProfileFormProps {
  userData: UserData | null;
  onSave: (data: Partial<UserData>) => Promise<void>;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ userData, onSave }) => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: userData?.fullName || userData?.displayName || "",
      age: userData?.age || undefined,
      gender: userData?.gender || undefined,
      bio: userData?.bio || "",
    },
  });
  
  const isSubmitting = form.formState.isSubmitting;

  const onSubmit = async (data: FormValues) => {
    try {
      await onSave({
        fullName: data.fullName,
        age: data.age as number | undefined,
        gender: data.gender,
        bio: data.bio,
      });
      
      toast({
        title: "Success",
        description: "Profile updated successfully!",
      });
      
      setIsEditing(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    }
  };
  
  const handleCancel = () => {
    form.reset();
    setIsEditing(false);
  };
  
  if (!isEditing) {
    // View mode
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="space-y-4">
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-slate-400">Full Name</h3>
            <p className="text-slate-50 text-base">
              {userData?.fullName || userData?.displayName || "Not specified"}
            </p>
          </div>
          
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-slate-400">Age</h3>
            <p className="text-slate-50 text-base">
              {userData?.age || "Not specified"}
            </p>
          </div>
          
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-slate-400">Gender</h3>
            <p className="text-slate-50 text-base">
              {userData?.gender ? 
                userData.gender.charAt(0).toUpperCase() + userData.gender.slice(1) : 
                "Not specified"}
            </p>
          </div>
          
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-slate-400">Bio</h3>
            <p className="text-slate-50 text-base whitespace-pre-wrap">
              {userData?.bio || "Not specified"}
            </p>
          </div>
        </div>
        
        <Button 
          onClick={() => setIsEditing(true)} 
          className="gap-1 w-full sm:w-auto"
          type="button"
        >
          <Edit className="h-4 w-4" />
          Edit Profile
        </Button>
      </div>
    );
  }
  
  // Edit mode
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 animate-fade-in">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your full name" {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Age</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="Your age" 
                    {...field}
                    value={field.value === undefined ? "" : field.value}
                    onChange={(e) => {
                      const value = e.target.value === "" ? undefined : parseInt(e.target.value);
                      field.onChange(value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your gender" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Tell us a bit about yourself" 
                    className="min-h-[120px]" 
                    {...field} 
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-3 flex-col sm:flex-row">
          <Button type="submit" className="gap-1" disabled={isSubmitting}>
            <Save className="h-4 w-4" />
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
          
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleCancel}
            className="gap-1"
            disabled={isSubmitting}
          >
            <X className="h-4 w-4" />
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProfileForm;
