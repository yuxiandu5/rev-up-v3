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
import { CreateModelInput } from "@/lib/validations";
import { useState } from "react";
import { useApiClient } from "@/hooks/useApiClient";
import { toast } from "sonner";
import { MakeItemListDTO } from "@/types/DTO/AdminDashboardDTO";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ModelDialogProps {
  onSuccess: () => void;
}

export function ModelDialog({ onSuccess }: ModelDialogProps) {
  const [form, setForm] = useState<CreateModelInput>({ makeId: "", name: "", slug: "" });
  const [makeData, setMakeData] = useState<MakeItemListDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const { apiCall } = useApiClient();

  const fetchMakes = async () => {
    try {
      setLoading(true);

      const res = await apiCall("/api/admin/makes");
      if (!res.ok) throw new Error(`Failed to fetch makes: ${res.status}`);

      const data = await res.json();
      setMakeData(data.data);
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
      makeId: value,
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await apiCall("/api/admin/models", {
        method: "POST",
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error(`Failed to create model: ${res.status}`);

      toast("Model created!");
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
    <Dialog onOpenChange={() => fetchMakes()}>
      <DialogTrigger asChild>
        <Button variant="outline">Add Model</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSave}>
          <DialogHeader>
            <DialogTitle>Add Model</DialogTitle>
            <DialogDescription>
              Create a bew Model here. Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 mt-4">
            <Label htmlFor="make">Make</Label>
            <Select onValueChange={(value) => handleSelectChange(value)}>
              <SelectTrigger className="w-full" onClick={fetchMakes}>
                <SelectValue placeholder="Select a make" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {makeData.map((make) => (
                    <SelectItem key={make.id} value={make.id.toString()}>
                      {make.name}
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
              {loading ? <LoadingSpinner size="sm" /> : "Add Model"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
