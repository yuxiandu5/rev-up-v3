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
import { CreateModCompatibilityInput } from "@/lib/validations";
import { useState, useEffect } from "react";
import { useApiClient } from "@/hooks/useApiClient";
import { toast } from "sonner";
import { ModResponseDTO } from "@/types/DTO/AdminDashboardDTO";
import { CarSelectDialog } from "./CarSelectDialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuthStore } from "@/stores/authStore";

interface CreateModCompatibilityDialogProps {
  onSuccess: () => void;
}

interface SelectedCar {
  makeId: string;
  makeName: string;
  modelId: string;
  modelName: string;
  badgeId: string;
  badgeName: string;
  yearRangeId: string;
  yearRangeDisplay: string;
}

export function CreateModCompatibilityDialog({ onSuccess }: CreateModCompatibilityDialogProps) {
  const [form, setForm] = useState<CreateModCompatibilityInput>({
    modId: "",
    modelYearRangeId: "",
    badgeId: "",
    modelId: "",
    makeId: "",
    modelYearRange: "",
    hpGain: 0,
    nmGain: 0,
    handlingDelta: 0,
    zeroToHundredDelta: 0,
    price: 0,
    notes: "",
  });
  const [mods, setMods] = useState<ModResponseDTO[]>([]);
  const [selectedCar, setSelectedCar] = useState<SelectedCar | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [carDialogOpen, setCarDialogOpen] = useState<boolean>(false);

  const { apiCall } = useApiClient();
  const { isInitialized } = useAuthStore();

  useEffect(() => {
    fetchMods();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchMods = async () => {
    try {
      setLoading(true);
      if (!isInitialized) return;

      const res = await apiCall("/api/admin/mods");
      if (!res.ok) throw new Error(`Failed to fetch mods: ${res.status}`);

      const data = await res.json();
      setMods(data.data);
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

  const handleCarSelected = (car: SelectedCar) => {
    setSelectedCar(car);
    setForm((prev) => ({
      ...prev,
      makeId: car.makeId,
      modelId: car.modelId,
      badgeId: car.badgeId,
      modelYearRangeId: car.yearRangeId,
      modelYearRange: car.yearRangeDisplay,
    }));
  };

  const handleInputChange = (field: keyof CreateModCompatibilityInput, value: string | number) => {
    setForm((prev) => ({
      ...prev,
      [field]: value === "" ? undefined : value,
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.modId || !form.modelYearRangeId) {
      toast("Please select both a car and a mod");
      return;
    }

    try {
      setLoading(true);
      const res = await apiCall("/api/admin/mod-compatibilities", {
        method: "POST",
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error(`Failed to create mod compatibility: ${res.status}`);

      toast("Mod compatibility created!");
      onSuccess();
      resetForm();
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

  const resetForm = () => {
    setForm({
      modId: "",
      modelYearRangeId: "",
      badgeId: "",
      modelId: "",
      makeId: "",
      modelYearRange: "",
      hpGain: 0,
      nmGain: 0,
      handlingDelta: 0,
      zeroToHundredDelta: 0,
      price: 0,
      notes: "",
    });
    setSelectedCar(null);
  };

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Add Mod Compatibility</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <form onSubmit={handleSave}>
            <DialogHeader>
              <DialogTitle>Add Mod Compatibility</DialogTitle>
              <DialogDescription>
                Select a car configuration and mod, then set performance data.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-6 mt-4">
              {/* Car Selection Section */}
              <div className="space-y-4 p-4 border rounded-lg bg-muted/20">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-sm">Car Selection</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setCarDialogOpen(true)}
                  >
                    {selectedCar ? "Change Car" : "Select Car"}
                  </Button>
                </div>

                {selectedCar ? (
                  <div className="p-3 bg-secondary/20 border border-secondary rounded-md">
                    <p className="text-sm text-secondary-foreground">
                      Selected:{" "}
                      <strong className="text-foreground">
                        {selectedCar.makeName} {selectedCar.modelName} {selectedCar.badgeName}
                      </strong>{" "}
                      <span className="text-muted-foreground">
                        ({selectedCar.yearRangeDisplay})
                      </span>
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No car selected</p>
                )}
              </div>

              {/* Mod Selection */}
              <div className="grid gap-2">
                <Label htmlFor="mod">Mod</Label>
                <Select
                  onValueChange={(value) => handleInputChange("modId", value)}
                  value={form.modId}
                  disabled={!selectedCar}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        loading ? "Loading..." : !selectedCar ? "Select car first" : "Select mod"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {mods.map((mod) => (
                        <SelectItem key={mod.id} value={mod.id}>
                          {mod.name} - {mod.brand}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              {/* Performance Data */}
              {form.modId && (
                <div className="space-y-4 p-4 border rounded-lg bg-muted/20">
                  <h3 className="font-medium text-sm">Performance Data</h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="hpGain">HP Gain</Label>
                      <Input
                        id="hpGain"
                        type="number"
                        placeholder="e.g. 25"
                        value={form.hpGain || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "hpGain",
                            e.target.value ? parseInt(e.target.value) : ""
                          )
                        }
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="nmGain">Torque Gain (Nm)</Label>
                      <Input
                        id="nmGain"
                        type="number"
                        placeholder="e.g. 40"
                        value={form.nmGain || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "nmGain",
                            e.target.value ? parseInt(e.target.value) : ""
                          )
                        }
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="handlingDelta">Handling Delta</Label>
                      <Input
                        id="handlingDelta"
                        type="number"
                        placeholder="e.g. 2 or -1"
                        value={form.handlingDelta || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "handlingDelta",
                            e.target.value ? parseInt(e.target.value) : ""
                          )
                        }
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="zeroToHundredDelta">0-100 Delta (tenths of second)</Label>
                      <Input
                        id="zeroToHundredDelta"
                        type="number"
                        placeholder="e.g. -5 (0.5s faster)"
                        value={form.zeroToHundredDelta || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "zeroToHundredDelta",
                            e.target.value ? parseInt(e.target.value) : ""
                          )
                        }
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
                      onChange={(e) =>
                        handleInputChange("price", e.target.value ? parseInt(e.target.value) : "")
                      }
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
              )}
            </div>

            <DialogFooter className="mt-6">
              <DialogClose asChild>
                <Button variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                className="min-w-24"
                disabled={!form.modId || !form.modelYearRangeId || loading}
              >
                {loading ? <LoadingSpinner size="sm" /> : "Add Compatibility"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Car Selection Dialog */}
      <CarSelectDialog
        open={carDialogOpen}
        onOpenChange={setCarDialogOpen}
        onCarSelected={handleCarSelected}
      />
    </>
  );
}
