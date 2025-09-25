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
import { CreateModInput } from "@/lib/validations";
import { useState } from "react";
import { useApiClient } from "@/hooks/useApiClient";
import { toast } from "sonner";
import { ModCategoryResponseDTO } from "@/types/AdminDashboardDTO";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ModDialogProps {
  onSuccess: () => void;
}

export function ModDialog({ onSuccess }: ModDialogProps) {
  const [form, setForm] = useState<CreateModInput>({ name: "", brand: "", category: "", modCategoryId: "", description: "" });
  const [modCategoryData, setModCategoryData] = useState<ModCategoryResponseDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const { apiCall } = useApiClient();

  const fetchModCategories = async () => {
    try {
      setLoading(true);

      const res = await apiCall("/api/admin/mod-categories");
      if (!res.ok) throw new Error(`Failed to fetch mod categories: ${res.status}`);

      const data = await res.json();
      setModCategoryData(data.data);
    } catch (error) {
      if (error instanceof Error) {
        toast(error.message);
      } else {
        toast("Unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelectChange = (value: string) => {
    setForm({
      ...form,
      modCategoryId: value,
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await apiCall("/api/admin/mods", {
        method: "POST",
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error(`Failed to create mod: ${res.status}`);

      toast("Mod created!");
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
    <Dialog onOpenChange={() => fetchModCategories()}>
      <DialogTrigger asChild>
        <Button variant="outline">Add Mod</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSave}>
          <DialogHeader>
            <DialogTitle>Add Mod</DialogTitle>
            <DialogDescription>
              Create a bew Mod here. Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 mt-4">
            <Label htmlFor="modCategory">Mod Category</Label>
            <Select onValueChange={(value) => handleSelectChange(value)}>
              <SelectTrigger className="w-full" onClick={fetchModCategories}>
                <SelectValue placeholder="Select a mod category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {modCategoryData.map((modCategory) => (
                    <SelectItem key={modCategory.id} value={modCategory.id.toString()}>
                      {modCategory.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <div className="grid gap-3">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" onChange={handleChange} />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="brand">Brand</Label>
              <Input id="brand" name="brand" onChange={handleChange} />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="category">Category</Label>
              <Input id="category" name="category" onChange={handleChange} />
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
            <Button type="submit" className="w-24">
              {loading ? <LoadingSpinner size="sm" /> : "Add Mod"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
