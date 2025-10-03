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
import { UpdateMediaAssetInput } from "@/lib/validations";
import { useEffect, useState } from "react";
import { useApiClient } from "@/hooks/useApiClient";
import { toast } from "sonner";
import { MediaAssetResponseDTO } from "@/types/DTO/AdminDashboardDTO";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UpdateMediaAssetDialogProps {
  fetchData: () => void;
  open: boolean;
  data: (MediaAssetResponseDTO & { modId?: string; modelYearRangeId?: string }) | null;
  setOpen: (open: boolean) => void;
}

export function UpdateMediaAssetDialog({
  fetchData,
  open,
  data,
  setOpen,
}: UpdateMediaAssetDialogProps) {
  const [form, setForm] = useState<
    UpdateMediaAssetInput & { modId?: string; modelYearRangeId?: string }
  >({
    name: data?.name,
    url: data?.url,
    modId: data?.modId,
    modelYearRangeId: data?.modelYearRangeId,
  });
  const [loading, setLoading] = useState<boolean>(false);

  const { apiCall } = useApiClient();

  useEffect(() => {
    if (data) {
      setForm({
        name: data.name,
        url: data.url,
        modId: data.modId,
        modelYearRangeId: data.modelYearRangeId,
      });
    } else {
      setForm({
        name: "",
        url: "",
        modId: undefined,
        modelYearRangeId: undefined,
      });
    }
  }, [data]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleTypeChange = (value: string) => {
    if (value === "mod") {
      setForm({
        ...form,
        modId: form.modId || "",
        modelYearRangeId: undefined,
      });
    } else if (value === "car") {
      setForm({
        ...form,
        modId: undefined,
        modelYearRangeId: form.modelYearRangeId || "",
      });
    }
  };

  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "modId") {
      setForm({
        ...form,
        modId: value,
        modelYearRangeId: undefined,
      });
    } else if (name === "modelYearRangeId") {
      setForm({
        ...form,
        modId: undefined,
        modelYearRangeId: value,
      });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await apiCall(`/api/admin/media-assets/${data?.id}`, {
        method: "PATCH",
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error(`Failed to update media asset: ${res.status}`);

      toast("Media asset updated!");
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

  const getSelectedType = () => {
    if (form.modId !== undefined) return "mod";
    if (form.modelYearRangeId !== undefined) return "car";
    return "";
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
            <DialogTitle>Update Media Asset</DialogTitle>
            <DialogDescription>
              Update a Media Asset here. Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 mt-4">
            <div className="grid gap-3">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" onChange={handleChange} value={form.name ?? ""} />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                name="url"
                type="url"
                onChange={handleChange}
                value={form.url ?? ""}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="type">Type</Label>
              <Select onValueChange={handleTypeChange} value={getSelectedType()}>
                <SelectTrigger>
                  <SelectValue placeholder="Select asset type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mod">Mod</SelectItem>
                  <SelectItem value="car">Car</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {form.modId !== undefined && (
              <div className="grid gap-3">
                <Label htmlFor="modId">Mod ID</Label>
                <Input
                  id="modId"
                  name="modId"
                  value={form.modId}
                  onChange={handleIdChange}
                  placeholder="Enter Mod ID"
                />
              </div>
            )}
            {form.modelYearRangeId !== undefined && (
              <div className="grid gap-3">
                <Label htmlFor="modelYearRangeId">Model Year Range ID</Label>
                <Input
                  id="modelYearRangeId"
                  name="modelYearRangeId"
                  value={form.modelYearRangeId}
                  onChange={handleIdChange}
                  placeholder="Enter Model Year Range ID"
                />
              </div>
            )}
          </div>
          <DialogFooter className="mt-6">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" className="min-w-24">
              {loading ? <LoadingSpinner size="sm" /> : "Update Media Asset"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
