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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreateModRequirementInput } from "@/lib/validations";
import { ModCategoryResponseDTO, ModResponseDTO } from "@/types/DTO/AdminDashboardDTO";
import { useState } from "react";
import { useApiClient } from "@/hooks/useApiClient";
import { toast } from "sonner";

interface CreateModRequirementDialogProps {
  onSuccess: () => void;
}

export function CreateModRequirementDialog({ onSuccess }: CreateModRequirementDialogProps) {
  const [form, setForm] = useState<CreateModRequirementInput>({
    prerequisiteCategoryId: "",
    dependentId: "",
  });
  const [modCategories, setModCategories] = useState<ModCategoryResponseDTO[]>([]);
  const [mods, setMods] = useState<ModResponseDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [dataLoading, setDataLoading] = useState<boolean>(false);

  const { apiCall } = useApiClient();

  const fetchData = async () => {
    setDataLoading(true);
    try {
      // Fetch mod categories and mods in parallel
      const [categoriesRes, modsRes] = await Promise.all([
        apiCall("/api/admin/mod-categories"),
        apiCall("/api/admin/mods"),
      ]);

      if (!categoriesRes.ok)
        throw new Error(`Failed to fetch mod categories: ${categoriesRes.status}`);
      if (!modsRes.ok) throw new Error(`Failed to fetch mods: ${modsRes.status}`);

      const [categoriesData, modsData] = await Promise.all([categoriesRes.json(), modsRes.json()]);

      setModCategories(categoriesData.data || categoriesData);
      setMods(modsData.data || modsData);
    } catch (error) {
      if (error instanceof Error) {
        toast(error.message);
      } else {
        toast("Unknown error occurred while fetching data");
      }
    } finally {
      setDataLoading(false);
    }
  };

  const handleSelectChange = (field: keyof CreateModRequirementInput, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.prerequisiteCategoryId || !form.dependentId) {
      toast("Please select both prerequisite category and dependent mod");
      return;
    }

    try {
      setLoading(true);
      const res = await apiCall("/api/admin/mod-requirements", {
        method: "POST",
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `Failed to create mod requirement: ${res.status}`);
      }

      toast("Mod requirement created!");
      setForm({ prerequisiteCategoryId: "", dependentId: "" });
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
    <Dialog onOpenChange={(open) => open && fetchData()}>
      <DialogTrigger asChild>
        <Button variant="outline">Add Mod Requirement</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSave}>
          <DialogHeader>
            <DialogTitle>Add Mod Requirement</DialogTitle>
            <DialogDescription>
              Create a new mod requirement relationship. Select a prerequisite category and the
              dependent mod that requires it.
            </DialogDescription>
          </DialogHeader>

          {dataLoading ? (
            <div className="flex justify-center items-center py-8">
              <LoadingSpinner size="md" />
            </div>
          ) : (
            <div className="grid gap-4 mt-4">
              <div className="grid gap-3">
                <Label htmlFor="prerequisiteCategoryId">Prerequisite Category</Label>
                <Select
                  onValueChange={(value) => handleSelectChange("prerequisiteCategoryId", value)}
                  value={form.prerequisiteCategoryId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select prerequisite category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {modCategories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-3">
                <Label htmlFor="dependentId">Dependent Mod</Label>
                <Select
                  onValueChange={(value) => handleSelectChange("dependentId", value)}
                  value={form.dependentId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select dependent mod" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {mods.map((mod) => (
                        <SelectItem key={mod.id} value={mod.id}>
                          {mod.brand} {mod.name} ({mod.category})
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <DialogFooter className="mt-6">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              type="submit"
              className="min-w-24"
              disabled={loading || dataLoading || !form.prerequisiteCategoryId || !form.dependentId}
            >
              {loading ? <LoadingSpinner size="sm" /> : "Add Requirement"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
