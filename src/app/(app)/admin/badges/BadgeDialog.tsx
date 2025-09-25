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
import { CreateBadgeInput } from "@/lib/validations";
import { useState } from "react";
import { useApiClient } from "@/hooks/useApiClient";
import { toast } from "sonner";
import { ModelResponseDTO } from "@/types/AdminDashboardDTO";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface badgeDialogProps {
  onSuccess: () => void;
}

export function BadgeDialog({ onSuccess }: badgeDialogProps) {
  const [form, setForm] = useState<CreateBadgeInput>({ modelId: "", name: "", slug: "" });
  const [modelData, setModelData] = useState<ModelResponseDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const { apiCall } = useApiClient();

  const fetchModels = async () => {
    try {
      setLoading(true);

      const res = await apiCall("/api/admin/models");
      if (!res.ok) throw new Error(`Failed to fetch models: ${res.status}`);

      const data = await res.json();
      setModelData(data.data);
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
      modelId: value,
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await apiCall("/api/admin/badges", {
        method: "POST",
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error(`Failed to create badge: ${res.status}`);

      toast("badge created!");
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
    <Dialog onOpenChange={() => fetchModels()}>
      <DialogTrigger asChild>
        <Button variant="outline">Add badge</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSave}>
          <DialogHeader>
            <DialogTitle>Add badge</DialogTitle>
            <DialogDescription>
              Create a bew badge here. Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 mt-4">
            <Label htmlFor="model">model</Label>
            <Select onValueChange={(value) => handleSelectChange(value)}>
              <SelectTrigger className="w-full" onClick={fetchModels}>
                <SelectValue placeholder="Select a model" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {modelData.map((model) => (
                    <SelectItem key={model.id} value={model.id.toString()}>
                      {model.name}
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
              <Label htmlFor="slug">Slug</Label>
              <Input id="slug" name="slug" onChange={handleChange} />
            </div>
          </div>
          <DialogFooter className="mt-6">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" className="w-24">
              {loading ? <LoadingSpinner size="sm" /> : "Add badge"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
