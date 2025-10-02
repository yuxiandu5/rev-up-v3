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
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UpdateModInput } from "@/lib/validations";
import { useEffect, useState } from "react";
import { useApiClient } from "@/hooks/useApiClient";
import { toast } from "sonner";
import { ModResponseDTO } from "@/types/DTO/AdminDashboardDTO";

interface ModUpdateDialogProps {
  fetchData: () => void;
  open: boolean;
  data: ModResponseDTO | null;
  setOpen: (open: boolean) => void;
}

export function ModUpdateDialog({ fetchData, open, data, setOpen }: ModUpdateDialogProps) {
  const [form, setForm] = useState<UpdateModInput>({
    name: "",
    brand: "",
    category: "",
    description: "",
  });
  const [loading, setLoading] = useState<boolean>(false);

  const { apiCall } = useApiClient();

  useEffect(() => {
    if (data) {
      setForm({
        name: data.name,
        brand: data.brand,
        category: data.category,
        description: data.description,
      });
    } else {
      setForm({ name: "", brand: "", category: "", description: "" });
    }
  }, [data]);

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
      const res = await apiCall(`/api/admin/mods/${data?.id}`, {
        method: "PATCH",
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error(`Failed to update mod: ${res.status}`);

      toast("Mod updated!");
      fetchData();
      setOpen(false);
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
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          setOpen(false);
        }
      }}
    >
      <DialogContent className="sm:max-w-[425px]" onOpenAutoFocus={(e) => e.preventDefault()}>
        <form onSubmit={handleSave}>
          <DialogHeader>
            <DialogTitle>Update Mod</DialogTitle>
            <DialogDescription>
              Update a Mod here. Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 mt-4">
            <div className="grid gap-3">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" onChange={handleChange} value={form.name ?? ""} />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="brand">Brand</Label>
              <Input id="brand" name="brand" onChange={handleChange} value={form.brand ?? ""} />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                name="category"
                onChange={handleChange}
                value={form.category ?? ""}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                onChange={handleChange}
                value={form.description ?? ""}
              />
            </div>
          </div>
          <DialogFooter className="mt-6">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" className="min-w-24">
              {loading ? <LoadingSpinner size="sm" /> : "Update Mod"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
