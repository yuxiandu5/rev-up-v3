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
import { UpdateModCategoryInput } from "@/lib/validations";
import { useEffect, useState } from "react";
import { useApiClient } from "@/hooks/useApiClient";
import { toast } from "sonner";
import { ModCategoryResponseDTO } from "@/types/AdminDashboardDTO";

interface UpdateModCategoryDialogProps {
  fetchData: () => void;
  open: boolean;
  data: ModCategoryResponseDTO | null;
  setOpen: (open: boolean) => void;
}

export function UpdateModCategoryDialog({
  fetchData,
  open,
  data,
  setOpen,
}: UpdateModCategoryDialogProps) {
  const [form, setForm] = useState<UpdateModCategoryInput>({
    name: data?.name,
    description: data?.description,
  });
  const [loading, setLoading] = useState<boolean>(false);

  const { apiCall } = useApiClient();

  useEffect(() => {
    if (data) {
      setForm({ name: data.name, description: data.description });
    } else {
      setForm({ name: "", description: "" });
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
      const res = await apiCall(`/api/admin/mod-categories/${data?.id}`, {
        method: "PATCH",
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error(`Failed to update mod category: ${res.status}`);

      toast("Mod category updated!");
      setOpen(false);
      fetchData();
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
            <DialogTitle>Update Mod Category</DialogTitle>
            <DialogDescription>
              Update a Mod Category here. Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 mt-4">
            <div className="grid gap-3">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" onChange={handleChange} value={form.name ?? ""} />
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
              {loading ? <LoadingSpinner size="sm" /> : "Update Mod Category"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
