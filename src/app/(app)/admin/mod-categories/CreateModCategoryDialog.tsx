import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/Loading";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreateModCategoryInput } from "@/lib/validations";
import { useState } from "react";
import { useApiClient } from "@/hooks/useApiClient";
import { toast } from "sonner";

interface CreateModCategoryDialogProps {
  onSuccess: () => void;
}

export function CreateModCategoryDialog({ onSuccess }: CreateModCategoryDialogProps) {
  const [form, setForm] = useState<CreateModCategoryInput>({ name: "", description: "" });
  const [loading, setLoading] = useState<boolean>(false);

  const { apiCall } = useApiClient();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await apiCall("/api/admin/mod-categories", {
        method: "POST",
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error(`Failed to create mod category: ${res.status}`);

      toast("Mod category created!");
      onSuccess();
    } catch (e) {
      if (e instanceof Error) {
        toast(e.message);
      } else {
        toast("Unknown error occurred!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Add Mod Category</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSave}>
          <DialogHeader>
            <DialogTitle>Add Mod Category</DialogTitle>
            <DialogDescription>
              Create a bew Mod Category here. Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 mt-4">
            <div className="grid gap-3">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" onChange={handleChange} />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="description">Description</Label>
              <Input id="description" name="description" onChange={handleChange} />
            </div>
          </div>
          <DialogFooter className="mt-6">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" className="min-w-24">
              {loading ? <LoadingSpinner size="sm" /> : "Add Mod Category"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
