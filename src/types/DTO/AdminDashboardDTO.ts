import { Role } from "./dtos";
import { z } from "zod";

export interface AdminUserListItemDTO {
  id: string;
  userName: string;
  isActive: boolean;
  role: Role;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string | null;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface AdminUserListResponse {
  success: boolean;
  message: string;
  data: AdminUserListItemDTO[];
  meta: PaginationMeta;
}

export interface MakeItemListDTO {
  id: string;
  name: string;
  slug: string;
}

// Model related
export const ModelDTOSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  make: z.string(),
  badges: z.array(z.string()).optional(),
});

export function toModelDTO(raw: {
  id: string;
  name: string;
  slug: string;
  make: { name: string };
  badges?: { name: string }[] | null;
}): ModelResponseDTO {
  return {
    id: raw.id,
    name: raw.name,
    slug: raw.slug,
    make: raw.make.name,
    badges: raw.badges?.map((b) => b.name) ?? [],
  };
}

// Badge Related
export const BadgeDTOSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  make: z.string(),
  model: z.string(),
  yearRanges: z.array(z.string()).optional(),
});

export function toBadgeDTO(raw: {
  id: string;
  name: string;
  slug: string;
  model: { name: string; make: { name: string } };
  yearRanges: { startYear: number; endYear: number | null }[] | null;
}): BadgeResponseDTO {
  return {
    id: raw.id,
    name: raw.name,
    slug: raw.slug,
    model: raw.model.name,
    make: raw.model.make.name,
    yearRanges: raw.yearRanges?.map((y) =>
      y.endYear ? `${y.startYear}-${y.endYear}` : `${y.startYear}-present`
    ),
  };
}

// YeaRange related
export const YearRangeDTOSchema = z.object({
  id: z.string(),
  badge: z.string(),
  startYear: z.number().int(),
  endYear: z.number().int().optional(),
  chassis: z.string().optional(),
  hp: z.number().int(),
  torque: z.number().int(),
  zeroToHundred: z.number().int(),
  handling: z.number().int(),
  mediaAsset: z.string(),
  make: z.string(),
  model: z.string(),
  imageName: z.string().optional(),
});

export const ModCategoryDTOSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  mods: z.array(z.string()),
});

export function toModCategoryDTO(value: {
  id: string;
  name: string;
  description: string | null;
  mods: { name: string }[];
}): ModCategoryResponseDTO {
  return {
    id: value.id,
    name: value.name,
    description: value.description ?? undefined,
    mods: value.mods.map((m) => m.name),
  };
}

export const ModDTOSchema = z.object({
  id: z.string(),
  name: z.string(),
  brand: z.string(),
  description: z.string().optional(),
  category: z.string(),
  compatibilitiesCount: z.number(),
});

export function toModDTO(raw: {
  id: string;
  name: string;
  brand: string;
  description: string | null;
  category: string;
  compatibilities: { id: string }[];
}): ModResponseDTO {
  return {
    id: raw.id,
    name: raw.name,
    brand: raw.brand,
    description: raw.description ?? undefined,
    category: raw.category,
    compatibilitiesCount: raw.compatibilities?.length ?? 0,
  };
}

export const ModCompatibilityDTOSchema = z.object({
  id: z.string(),
  mod: z.string(),
  carName: z.string(),
  startYear: z.number().int(),
  endYear: z.number().int().optional(),
  badge: z.string(),
  model: z.string(),
  make: z.string(),
  hpGain: z.number().int().optional(),
  nmGain: z.number().int().optional(),
  handlingDelta: z.number().int().optional(),
  zeroToHundredDelta: z.number().int().optional(),
  price: z.number().int().optional(),
  notes: z.string().optional(),
});

export function toModCompatibilityDTO(raw: {
  id: string;
  mod: {
    name: string;
  };
  modelYearRangeObj: {
    startYear: number;
    endYear: number | null;
    badge: {
      name: string;
      model: {
        name: string;
        make: {
          name: string;
        };
      };
    };
  };
  hpGain: number | null;
  nmGain: number | null;
  handlingDelta: number | null;
  zeroToHundredDelta: number | null;
  price: number | null;
  notes: string | null;
}): ModCompatibilityResponseDTO {
  return {
    id: raw.id,
    mod: raw.mod.name,
    carName:
      raw.modelYearRangeObj.badge.model.make.name +
      " " +
      raw.modelYearRangeObj.badge.model.name +
      " " +
      raw.modelYearRangeObj.badge.name +
      " " +
      raw.modelYearRangeObj.startYear +
      "-" +
      (raw.modelYearRangeObj.endYear ?? "present"),
    startYear: raw.modelYearRangeObj.startYear,
    endYear: raw.modelYearRangeObj.endYear ?? undefined,
    badge: raw.modelYearRangeObj.badge.name,
    model: raw.modelYearRangeObj.badge.model.name,
    make: raw.modelYearRangeObj.badge.model.make.name,
    hpGain: raw.hpGain ?? undefined,
    nmGain: raw.nmGain ?? undefined,
    handlingDelta: raw.handlingDelta ?? undefined,
    zeroToHundredDelta: raw.zeroToHundredDelta ?? undefined,
    price: raw.price ?? undefined,
    notes: raw.notes ?? undefined,
  };
}

export const ModRequirementDTOSchema = z.object({
  id: z.string(),
  dependent: z.string(),
  category: z.string(),
  prerequisiteCategory: z.string().array(),
});

type ModRequirementItem = {
  id: string;
  dependent: string;
  category: string;
  prerequisiteCategory: string[];
};

export function toModRequirementDTO(
  data: {
    id: string;
    prerequisiteCategory: { name: string };
    dependent: { name: string; brand: string; category: string };
  }[]
): ModRequirementItem[] {
  const formattedResults = Object.values(
    data.reduce(
      (acc, curr) => {
        if (!acc[curr.dependent.name]) {
          acc[curr.dependent.name] = {
            id: curr.id,
            dependent: curr.dependent.brand + " " + curr.dependent.name,
            category: curr.dependent.category,
            prerequisiteCategory: [],
          };
        }

        acc[curr.dependent.name].prerequisiteCategory.push(curr.prerequisiteCategory.name);
        return acc;
      },
      {} as Record<string, ModRequirementItem>
    )
  );
  return formattedResults;
}

export const MediaAssetDTOSchema = z.object({
  id: z.string(),
  name: z.string(),
  url: z.string(),
});

export function toMediaAssetDTO(raw: {
  id: string;
  name: string;
  url: string;
}): MediaAssetResponseDTO {
  return {
    id: raw.id,
    name: raw.name,
    url: raw.url,
  };
}

export const MediaAssetUploadDTOSchema = z.object({
  uploadUrl: z.string(),
  publicUrl: z.string(),
});

export type ModCompatibilityResponseDTO = z.infer<typeof ModCompatibilityDTOSchema>;
export type ModelResponseDTO = z.infer<typeof ModelDTOSchema>;
export type BadgeResponseDTO = z.infer<typeof BadgeDTOSchema>;
export type YearRangeResponseDTO = z.infer<typeof YearRangeDTOSchema>;
export type MediaAssetResponseDTO = z.infer<typeof MediaAssetDTOSchema>;
export type MediaAssetUploadResponseDTO = z.infer<typeof MediaAssetUploadDTOSchema>;

// Mod related
export type ModCategoryResponseDTO = z.infer<typeof ModCategoryDTOSchema>;
export type ModResponseDTO = z.infer<typeof ModDTOSchema>;
export type ModRequirementResponseDTO = z.infer<typeof ModRequirementDTOSchema>;
