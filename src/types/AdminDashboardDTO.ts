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
});

export const ModCategoryDTOSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  mods: z.array(z.string()),
});

export function toModCategoryDTO(value: {
  id: string,
  name: string,
  description: string | null,
  mods: { name: string }[],
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

export type ModelResponseDTO = z.infer<typeof ModelDTOSchema>;
export type BadgeResponseDTO = z.infer<typeof BadgeDTOSchema>;
export type YearRangeResponseDTO = z.infer<typeof YearRangeDTOSchema>;

// Mod related
export type ModCategoryResponseDTO = z.infer<typeof ModCategoryDTOSchema>;
export type ModResponseDTO = z.infer<typeof ModDTOSchema>;