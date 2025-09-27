"use client";

import { Button } from "@/components/ui/button";
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
import { useState, useEffect } from "react";
import { useApiClient } from "@/hooks/useApiClient";
import { toast } from "sonner";
import {
  BadgeResponseDTO,
  MakeItemListDTO,
  ModelResponseDTO,
  YearRangeResponseDTO,
} from "@/types/AdminDashboardDTO";

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

interface CarSelectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCarSelected: (car: SelectedCar) => void;
  triggerButton?: React.ReactNode;
}

export function CarSelectDialog({
  open,
  onOpenChange,
  onCarSelected,
  triggerButton,
}: CarSelectDialogProps) {
  const [makeData, setMakeData] = useState<MakeItemListDTO[]>([]);
  const [modelData, setModelData] = useState<ModelResponseDTO[]>([]);
  const [badgeData, setBadgeData] = useState<BadgeResponseDTO[]>([]);
  const [yearRangeData, setYearRangeData] = useState<YearRangeResponseDTO[]>([]);

  // Selection state
  const [selectedMake, setSelectedMake] = useState<MakeItemListDTO | null>(null);
  const [selectedModel, setSelectedModel] = useState<ModelResponseDTO | null>(null);
  const [selectedBadge, setSelectedBadge] = useState<BadgeResponseDTO | null>(null);
  const [selectedYearRange, setSelectedYearRange] = useState<YearRangeResponseDTO | null>(null);

  // Loading states
  const [loadingStates, setLoadingStates] = useState({
    makes: false,
    models: false,
    badges: false,
    yearRanges: false,
  });

  const { apiCall } = useApiClient();

  // Fetch makes when dialog opens
  useEffect(() => {
    if (open) {
      fetchMakes();
    }
  }, [open]);

  const fetchMakes = async () => {
    setLoadingStates((prev) => ({ ...prev, makes: true }));
    try {
      const res = await apiCall("/api/car");
      if (!res.ok) throw new Error(`Failed to fetch makes: ${res.status}`);

      const data = await res.json();
      setMakeData(data);
    } catch (error) {
      if (error instanceof Error) {
        toast(error.message);
      } else {
        toast("Unknown error occurred");
      }
    } finally {
      setLoadingStates((prev) => ({ ...prev, makes: false }));
    }
  };

  const fetchModels = async (makeId: string) => {
    setLoadingStates((prev) => ({ ...prev, models: true }));
    try {
      const res = await apiCall(`/api/car?makeId=${makeId}`);
      if (!res.ok) throw new Error(`Failed to fetch models: ${res.status}`);

      const data = await res.json();
      setModelData(data);
    } catch (error) {
      if (error instanceof Error) {
        toast(error.message);
      } else {
        toast("Unknown error occurred");
      }
    } finally {
      setLoadingStates((prev) => ({ ...prev, models: false }));
    }
  };

  const fetchBadges = async (modelId: string) => {
    setLoadingStates((prev) => ({ ...prev, badges: true }));
    try {
      const res = await apiCall(`/api/car?modelId=${modelId}`);
      if (!res.ok) throw new Error(`Failed to fetch badges: ${res.status}`);

      const data = await res.json();
      setBadgeData(data);
    } catch (error) {
      if (error instanceof Error) {
        toast(error.message);
      } else {
        toast("Unknown error occurred");
      }
    } finally {
      setLoadingStates((prev) => ({ ...prev, badges: false }));
    }
  };

  const fetchYearRanges = async (badgeId: string) => {
    setLoadingStates((prev) => ({ ...prev, yearRanges: true }));
    try {
      const res = await apiCall(`/api/car?badgeId=${badgeId}`);
      if (!res.ok) throw new Error(`Failed to fetch year ranges: ${res.status}`);

      const data = await res.json();
      setYearRangeData(data);
    } catch (error) {
      if (error instanceof Error) {
        toast(error.message);
      } else {
        toast("Unknown error occurred");
      }
    } finally {
      setLoadingStates((prev) => ({ ...prev, yearRanges: false }));
    }
  };

  const handleMakeSelect = (makeId: string) => {
    const make = makeData.find((m) => m.id === makeId);
    if (!make) return;

    setSelectedMake(make);
    setSelectedModel(null);
    setSelectedBadge(null);
    setSelectedYearRange(null);
    setModelData([]);
    setBadgeData([]);
    setYearRangeData([]);

    fetchModels(makeId);
  };

  const handleModelSelect = (modelId: string) => {
    const model = modelData.find((m) => m.id === modelId);
    if (!model) return;

    setSelectedModel(model);
    setSelectedBadge(null);
    setSelectedYearRange(null);
    setBadgeData([]);
    setYearRangeData([]);

    fetchBadges(modelId);
  };

  const handleBadgeSelect = (badgeId: string) => {
    const badge = badgeData.find((b) => b.id === badgeId);
    if (!badge) return;

    setSelectedBadge(badge);
    setSelectedYearRange(null);
    setYearRangeData([]);

    fetchYearRanges(badgeId);
  };

  const handleYearRangeSelect = (yearRangeId: string) => {
    const yearRange = yearRangeData.find((yr) => yr.id === yearRangeId);
    if (!yearRange) return;

    setSelectedYearRange(yearRange);
  };

  const handleConfirm = () => {
    if (!selectedMake || !selectedModel || !selectedBadge || !selectedYearRange) {
      toast("Please complete all car selections");
      return;
    }

    const selectedCar: SelectedCar = {
      makeId: selectedMake.id,
      makeName: selectedMake.name,
      modelId: selectedModel.id,
      modelName: selectedModel.name,
      badgeId: selectedBadge.id,
      badgeName: selectedBadge.name,
      yearRangeId: selectedYearRange.id,
      yearRangeDisplay: selectedYearRange.endYear
        ? `${selectedYearRange.startYear}-${selectedYearRange.endYear}`
        : `${selectedYearRange.startYear}+`,
    };

    onCarSelected(selectedCar);
    onOpenChange(false);
    resetSelections();
  };

  const resetSelections = () => {
    setSelectedMake(null);
    setSelectedModel(null);
    setSelectedBadge(null);
    setSelectedYearRange(null);
    setMakeData([]);
    setModelData([]);
    setBadgeData([]);
    setYearRangeData([]);
  };

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      resetSelections();
    }
    onOpenChange(open);
  };

  const isSelectionComplete = selectedMake && selectedModel && selectedBadge && selectedYearRange;

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      {triggerButton && <DialogTrigger asChild>{triggerButton}</DialogTrigger>}
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Select Car Configuration</DialogTitle>
          <DialogDescription>
            Select a car configuration step by step: Make → Model → Badge → Year Range.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 mt-4">
          {/* Car Selection Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Make Selection */}
            <div className="grid gap-2">
              <Label htmlFor="make">Make</Label>
              <Select
                onValueChange={handleMakeSelect}
                value={selectedMake?.id || ""}
                disabled={loadingStates.makes}
              >
                <SelectTrigger>
                  <SelectValue placeholder={loadingStates.makes ? "Loading..." : "Select make"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {makeData.map((make) => (
                      <SelectItem key={make.id} value={make.id}>
                        {make.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Model Selection */}
            <div className="grid gap-2">
              <Label htmlFor="model">Model</Label>
              <Select
                onValueChange={handleModelSelect}
                value={selectedModel?.id || ""}
                disabled={!selectedMake || loadingStates.models}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      loadingStates.models
                        ? "Loading..."
                        : !selectedMake
                          ? "Select make first"
                          : "Select model"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {modelData.map((model) => (
                      <SelectItem key={model.id} value={model.id}>
                        {model.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Badge Selection */}
            <div className="grid gap-2">
              <Label htmlFor="badge">Badge</Label>
              <Select
                onValueChange={handleBadgeSelect}
                value={selectedBadge?.id || ""}
                disabled={!selectedModel || loadingStates.badges}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      loadingStates.badges
                        ? "Loading..."
                        : !selectedModel
                          ? "Select model first"
                          : "Select badge"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {badgeData.map((badge) => (
                      <SelectItem key={badge.id} value={badge.id}>
                        {badge.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Year Range Selection */}
            <div className="grid gap-2">
              <Label htmlFor="yearRange">Year Range</Label>
              <Select
                onValueChange={handleYearRangeSelect}
                value={selectedYearRange?.id || ""}
                disabled={!selectedBadge || loadingStates.yearRanges}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      loadingStates.yearRanges
                        ? "Loading..."
                        : !selectedBadge
                          ? "Select badge first"
                          : "Select year range"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {yearRangeData.map((yearRange) => (
                      <SelectItem key={yearRange.id} value={yearRange.id}>
                        {yearRange.endYear
                          ? `${yearRange.startYear}-${yearRange.endYear}`
                          : `${yearRange.startYear}+`}
                        {yearRange.chassis && ` (${yearRange.chassis})`}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Selected Car Summary */}
          {isSelectionComplete && (
            <div className="p-4 bg-secondary/20 border border-secondary rounded-md">
              <div className="space-y-1">
                <p className="text-sm font-medium text-secondary-foreground">Selected Car:</p>
                <p className="text-sm text-secondary-foreground">
                  <strong className="text-foreground">
                    {selectedMake.name} {selectedModel.name} {selectedBadge.name}
                  </strong>
                  <span className="ml-2 text-muted-foreground">
                    (
                    {selectedYearRange.endYear
                      ? `${selectedYearRange.startYear}-${selectedYearRange.endYear}`
                      : `${selectedYearRange.startYear}+`}
                    )
                  </span>
                </p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="mt-6">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleConfirm} disabled={!isSelectionComplete} className="min-w-24">
            Confirm Selection
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
