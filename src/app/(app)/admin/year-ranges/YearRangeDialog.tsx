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
import { CreateYearRangeInput, UpdateYearRangeInput } from "@/lib/validations";
import { useContext, useEffect, useState } from "react";
import { useApiClient } from "@/hooks/useApiClient";
import { toast } from "sonner";
import { BadgeResponseDTO } from "@/types/AdminDashboardDTO";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OpenDialogContext } from "./context";
import { useAuthStore } from "@/stores/authStore";

interface YearRangeDialogProps {
  onSuccess: () => void;
}

export function YearRangeDialog({ onSuccess }: YearRangeDialogProps) {
  const { apiCall } = useApiClient();
  const { isInitialized } = useAuthStore();
  const dialog = useContext(OpenDialogContext);
  if (!dialog) throw new Error("no!");
  const { setOpenDialog, open, isEdit, data, id } = dialog;

  const [form, setForm] = useState<CreateYearRangeInput | UpdateYearRangeInput>({
    badgeId: "",
    startYear: 0,
    hp: 0,
    torque: 0,
    zeroToHundred: 0,
    handling: 0,
    imageUrl: "",
    imageDescription: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [badgeData, setBadgeData] = useState<BadgeResponseDTO[]>([]);
  const fetchBadges = async () => {
    try {
      setLoading(true);

      const res = await apiCall("/api/admin/badges");
      if (!res.ok) throw new Error(`Failed to fetch badges: ${res.status}`);

      const data = await res.json();
      setBadgeData(data.data);
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

  const formForUpdate = {
    startYear: form.startYear,
    endYear: form.endYear ?? undefined,
    hp: form.hp,
    torque: form.torque,
    zeroToHundred: form.zeroToHundred,
    handling: form.handling,
    imageUrl: form.imageUrl,
    imageDescription: form.imageDescription,
  };

  useEffect(() => {
    if (!isInitialized) return;

    if (!badgeData[0]) {
      fetchBadges();
    }

    if (isEdit && data) {
      setForm(data);
    } else {
      setForm({
        badgeId: "",
        startYear: 0,
        hp: 0,
        torque: 0,
        zeroToHundred: 0,
        handling: 0,
        imageUrl: "",
        imageDescription: "",
      });
    }
  }, [isEdit, data]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelectChange = (value: string) => {
    setForm({
      ...form,
      badgeId: value,
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const apiUrl = isEdit ? `/api/admin/year-ranges/${id}` : "/api/admin/year-ranges";

    try {
      setLoading(true);
      const res = await apiCall(apiUrl, {
        method: isEdit ? "PATCH" : "POST",
        body: JSON.stringify(isEdit ? formForUpdate : form),
      });

      if (!res.ok) throw new Error(`Failed to create YearRange: ${res.status}`);

      toast(`YearRange ${isEdit ? "updated!" : "created"}!`);
      onSuccess();
      setOpenDialog(false);
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
    <Dialog onOpenChange={(isOpen) => !isOpen && setOpenDialog(false)} open={open}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSave}>
          <DialogHeader>
            <DialogTitle>{isEdit ? "Update YearRange" : "Add YearRange"}</DialogTitle>
            {!isEdit && (
              <DialogDescription>
                Create a bew YearRange here. Click save when you&apos;re done.
              </DialogDescription>
            )}
          </DialogHeader>
          <div className="grid gap-4 mt-4">
            {!isEdit && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="badge" className="text-sm font-medium">
                      Badge
                    </Label>
                    <Select
                      onValueChange={(value) => handleSelectChange(value)}
                      value={!isEdit ? (form as CreateYearRangeInput).badgeId?.toString() : ""}
                    >
                      <SelectTrigger className="w-full" onClick={fetchBadges}>
                        <SelectValue placeholder="Select a badge" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {badgeData.map((badge) => (
                            <SelectItem key={badge.id} value={badge.id.toString()}>
                              {badge.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="chassis" className="text-sm font-medium">
                      Chassis
                    </Label>
                    <Input
                      id="chassis"
                      name="chassis"
                      onChange={handleChange}
                      className="w-full"
                      value={form.chassis ?? ""}
                    />
                  </div>
                </div>
              </>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startYear" className="text-sm font-medium">
                  Start Year
                </Label>
                <Input
                  id="startYear"
                  name="startYear"
                  onChange={handleChange}
                  className="w-full"
                  value={form.startYear ?? ""}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endYear" className="text-sm font-medium">
                  End Year
                </Label>
                <Input
                  id="endYear"
                  name="endYear"
                  onChange={handleChange}
                  className="w-full"
                  value={form.endYear ?? ""}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="hp" className="text-sm font-medium">
                  Horse Power
                </Label>
                <Input
                  id="hp"
                  name="hp"
                  onChange={handleChange}
                  className="w-full"
                  type="number"
                  value={form.hp ?? ""}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="torque" className="text-sm font-medium">
                  Torque
                </Label>
                <Input
                  id="torque"
                  name="torque"
                  onChange={handleChange}
                  className="w-full"
                  type="number"
                  value={form.torque ?? ""}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="zeroToHundred" className="text-sm font-medium">
                  0-100 (tenth seconds)
                </Label>
                <Input
                  id="zeroToHundred"
                  name="zeroToHundred"
                  onChange={handleChange}
                  className="w-full"
                  type="number"
                  step="1"
                  value={form.zeroToHundred ?? ""}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="handling" className="text-sm font-medium">
                  Handling
                </Label>
                <Input
                  id="handling"
                  name="handling"
                  onChange={handleChange}
                  className="w-full"
                  type="number"
                  step="0.1"
                  value={form.handling ?? ""}
                />
              </div>
            </div>
            <div>
              <div className="space-y-2">
                <Label htmlFor="imageUrl" className="text-sm font-medium">
                  Image URL
                </Label>
                <Input
                  id="imageUrl"
                  name="imageUrl"
                  onChange={handleChange}
                  className="w-full"
                  value={form.imageUrl ?? ""}
                />
              </div>
            </div>
          </div>
          <DialogFooter className="mt-6">
            <DialogClose asChild>
              <Button variant="outline" onClick={() => setOpenDialog(false)}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" className="min-w-24">
              {loading ? <LoadingSpinner size="sm" /> : isEdit ? "Save" : "Add YearRange"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
