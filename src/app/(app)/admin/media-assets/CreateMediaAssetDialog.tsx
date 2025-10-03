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
import { CreateMediaAssetInput } from "@/lib/validations";
import { useState } from "react";
import { useApiClient } from "@/hooks/useApiClient";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MediaAssetUploadDTOSchema } from "@/types/DTO/AdminDashboardDTO";

interface CreateMediaAssetDialogProps {
  onSuccess: () => void;
}

export function CreateMediaAssetDialog({ onSuccess }: CreateMediaAssetDialogProps) {
  const [form, setForm] = useState<CreateMediaAssetInput>({
    name: "",
    url: "",
    modId: undefined,
    modelYearRangeId: undefined,
    type: "mod",
  });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const { apiCall } = useApiClient();

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
        modId: "",
        modelYearRangeId: undefined,
        type: "mod",
      });
    } else if (value === "car") {
      setForm({
        ...form,
        modId: undefined,
        modelYearRangeId: "",
        type: "car",
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
        type: "mod",
      });
    } else if (name === "modelYearRangeId") {
      setForm({
        ...form,
        modId: undefined,
        modelYearRangeId: value,
        type: "car",
      });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (file) {
        const res = await apiCall("/api/admin/media-assets/upload", {
          method: "POST",
          body: JSON.stringify({ fileName: file.name, contentType: file.type, type: form.type }),
        });
        const data = await res.json();
        const { uploadUrl, publicUrl } = data.data;
        if (!res.ok) throw new Error(`Failed to upload file: ${res.status}`);

        const uploadRes = await fetch(uploadUrl, {
          method: "PUT",
          body: file,
          headers: {
            "Content-Type": file.type,
          },
        });
        if (!uploadRes.ok) throw new Error(`Failed to upload file: ${uploadRes.status}`);
        form.url = publicUrl;

        const saveRes = await apiCall("/api/admin/media-assets", {
          method: "POST",
          body: JSON.stringify({ ...form, url: publicUrl }),
        });
        if (!saveRes.ok) throw new Error(`Failed to create media asset: ${saveRes.status}`);

        toast("Media asset created!");
        onSuccess();
        setForm({ name: "", url: "", modId: undefined, modelYearRangeId: undefined, type: "mod" });
        return;
      }

      const res = await apiCall("/api/admin/media-assets", {
        method: "POST",
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error(`Failed to create media asset: ${res.status}`);

      toast("Media asset created!");
      onSuccess();
      setForm({ name: "", url: "", modId: undefined, modelYearRangeId: undefined, type: "mod" });
    } catch (e) {
      if (e instanceof Error) {
        console.log(e.message);
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setFile(selectedFile || null);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Add Media Asset</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSave}>
          <DialogHeader>
            <DialogTitle>Add Media Asset</DialogTitle>
            <DialogDescription>
              Create a new Media Asset here. Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 mt-4">
            <div className="grid gap-3">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" value={form.name} onChange={handleChange} required />
            </div>
            <div className="grid gap-3">
              <Label>File</Label>
              <Input
                id="file"
                name="file"
                type="file"
                onChange={handleFileChange}
                className="cursor-pointer hover:scale-98 transition-all duration-300"
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="url">URL (Optional)</Label>
              <Input
                id="url"
                name="url"
                type="url"
                value={form.url}
                onChange={handleChange}
                disabled={!!file}
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
                  required
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
                  required
                />
              </div>
            )}
          </div>
          <DialogFooter className="mt-6">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" className="min-w-24">
              {loading ? <LoadingSpinner size="sm" /> : "Add Media Asset"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
