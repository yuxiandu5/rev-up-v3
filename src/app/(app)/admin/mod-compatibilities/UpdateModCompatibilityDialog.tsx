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
import { useEffect, useState } from "react";
import { useApiClient } from "@/hooks/useApiClient";
import { toast } from "sonner";
import { ModCompatibilityResponseDTO } from "@/types/AdminDashboardDTO";

interface UpdateModCompatibilityInput {
  hpGain?: number;
  nmGain?: number;
  handlingDelta?: number;
  zeroToHundredDelta?: number;
  price?: number;
  notes?: string;
}

interface UpdateModCompatibilityDialogProps {
  fetchData: () => void;
  open: boolean;
  data: ModCompatibilityResponseDTO | null;
  setOpen: (open: boolean) => void;
}

export function UpdateModCompatibilityDialog({ 
  fetchData, 
  open, 
  data, 
  setOpen 
}: UpdateModCompatibilityDialogProps) {
  const [form, setForm] = useState<UpdateModCompatibilityInput>({});
  const [loading, setLoading] = useState<boolean>(false);

  const { apiCall } = useApiClient();

  useEffect(() => {
    if (data) {
      setForm({
        hpGain: data.hpGain || undefined,
        nmGain: data.nmGain || undefined,
        handlingDelta: data.handlingDelta || undefined,
        zeroToHundredDelta: data.zeroToHundredDelta || undefined,
        price: data.price || undefined,
        notes: data.notes || "",
      });
    } else {
      setForm({});
    }
  }, [data]);

  const handleInputChange = (field: keyof UpdateModCompatibilityInput, value: string | number) => {
    setForm(prev => ({
      ...prev,
      [field]: value === "" ? undefined : value,
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data) return;

    try {
      setLoading(true);
      const res = await apiCall(`/api/admin/mod-compatibilities/${data.id}`, {
        method: "PATCH",
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error(`Failed to update mod compatibility: ${res.status}`);

      toast("Mod compatibility updated!");
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

  const carInfo = data ? `${data.make} ${data.model} ${data.badge} (${data.startYear}${data.endYear ? `-${data.endYear}` : '+'})` : "";

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) {
        setOpen(false);
      }
    }}>
      <DialogContent className="sm:max-w-[500px]" onOpenAutoFocus={(e) => e.preventDefault()}>
        <form onSubmit={handleSave}>
          <DialogHeader>
            <DialogTitle>Update Mod Compatibility</DialogTitle>
            <DialogDescription>
              Update performance data for this mod compatibility. Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>

          {/* Display mod and car info */}
          {data && (
            <div className="p-4 bg-muted/20 rounded-lg mt-4">
              <div className="space-y-1">
                <p className="text-sm font-medium">Mod: {data.mod}</p>
                <p className="text-sm text-muted-foreground">Car: {carInfo}</p>
              </div>
            </div>
          )}

          <div className="grid gap-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="hpGain">HP Gain</Label>
                <Input
                  id="hpGain"
                  type="number"
                  placeholder="e.g. 25"
                  value={form.hpGain || ""}
                  onChange={(e) => handleInputChange("hpGain", e.target.value ? parseInt(e.target.value) : "")}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="nmGain">Torque Gain (Nm)</Label>
                <Input
                  id="nmGain"
                  type="number"
                  placeholder="e.g. 40"
                  value={form.nmGain || ""}
                  onChange={(e) => handleInputChange("nmGain", e.target.value ? parseInt(e.target.value) : "")}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="handlingDelta">Handling Delta</Label>
                <Input
                  id="handlingDelta"
                  type="number"
                  placeholder="e.g. 2 or -1"
                  value={form.handlingDelta || ""}
                  onChange={(e) => handleInputChange("handlingDelta", e.target.value ? parseInt(e.target.value) : "")}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="zeroToHundredDelta">0-100 Delta (tenths)</Label>
                <Input
                  id="zeroToHundredDelta"
                  type="number"
                  placeholder="e.g. -5 (0.5s faster)"
                  value={form.zeroToHundredDelta || ""}
                  onChange={(e) => handleInputChange("zeroToHundredDelta", e.target.value ? parseInt(e.target.value) : "")}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                type="number"
                placeholder="e.g. 299"
                value={form.price || ""}
                onChange={(e) => handleInputChange("price", e.target.value ? parseInt(e.target.value) : "")}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="notes">Notes</Label>
              <Input
                id="notes"
                placeholder="Additional notes or compatibility info"
                value={form.notes || ""}
                onChange={(e) => handleInputChange("notes", e.target.value)}
              />
            </div>
          </div>

          <DialogFooter className="mt-6">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" className="min-w-24" disabled={loading}>
              {loading ? <LoadingSpinner size="sm" /> : "Update Compatibility"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
