/**
 * Data Transfer Objects (DTOs)
 * 
 * DTOs define the contract between frontend and backend.
 * They ensure type safety, data consistency, and provide a clean API interface.
 */

// ============================================================================
// Base DTOs
// ============================================================================

export interface CarInfoDTO {
  makeId: string;
  make: string;
  modelId: string;
  model: string;
  badgeId: string;
  badge: string;
  yearRangeId: string;
  startYear: number;
  endYear: number | null;
  chassis: string | null;
}

export interface CarSpecsDTO {
  hp: number;
  torque: number;
  zeroToHundred: number; // in tenths of seconds (e.g., 62 = 6.2s)
  handling: number; // score out of 10
  imageUrl: string;
}

export interface ModificationDTO {
  id: string;
  name: string;
  brand: string;
  category: string;
  description?: string;
  imageUrl?: string;
  performance: {
    hpGain: number;
    torqueGain: number;
    handlingDelta: number;
    zeroToHundredDelta: number; // in tenths of seconds
  };
  price?: number;
  notes?: string;
}

// ============================================================================
// Build DTOs
// ============================================================================

export interface BuildSummaryDTO {
  id: string;
  nickname?: string;
  car: CarInfoDTO;
  specs: CarSpecsDTO;
  modsCount: number;
  totalPrice: number;
  performance: {
    totalHp: number;
    totalTorque: number;
    totalHandling: number;
    zeroToHundred: number; // final calculated time
  };
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface BuildDetailDTO extends BuildSummaryDTO {
  modifications: ModificationDTO[];
  notes?: string;
  createdBy?: string; // For public builds
}

// ============================================================================
// User DTOs
// ============================================================================

export interface UserSummaryDTO {
  id: string;
  userName: string;
  memberSince: string; // ISO date string
  buildCount: number;
  lastActive?: string; // ISO date string
}

export interface UserProfileDTO extends UserSummaryDTO {
  recoverQuestion: string;
  // Note: Never include sensitive data like passwordHash
}

// ============================================================================
// API Response DTOs
// ============================================================================

export interface ApiSuccessResponse<T> {
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  error: string;
  details?: unknown;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ============================================================================
// Create/Update DTOs (Input DTOs)
// ============================================================================

export interface CreateBuildDTO {
  selectedCar: CarInfoDTO;
  baseSpecs: CarSpecsDTO;
  selectedMods: Record<string, ModificationDTO>;
  nickname?: string;
  notes?: string;
}

export interface UpdateBuildDTO {
  selectedCar?: Partial<CarInfoDTO>;
  baseSpecs?: Partial<CarSpecsDTO>;
  selectedMods?: Record<string, ModificationDTO>;
  nickname?: string;
  notes?: string;
}

// ============================================================================
// Car Selection DTOs
// ============================================================================

export interface MakeDTO {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
}

export interface ModelDTO {
  id: string;
  name: string;
  slug: string;
  makeId: string;
}

export interface BadgeDTO {
  id: string;
  name: string;
  slug: string;
  modelId: string;
}

export interface YearRangeDTO {
  id: string;
  startYear: number;
  endYear: number | null;
  chassis: string | null;
  badgeId: string;
  specs: CarSpecsDTO;
}

// ============================================================================
// Type Guards (Runtime type checking)
// ============================================================================

export function isBuildSummaryDTO(obj: unknown): obj is BuildSummaryDTO {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "id" in obj &&
    "car" in obj &&
    "specs" in obj &&
    "modsCount" in obj
  );
}

export function isBuildDetailDTO(obj: unknown): obj is BuildDetailDTO {
  return (
    isBuildSummaryDTO(obj) &&
    "modifications" in obj &&
    Array.isArray((obj as BuildDetailDTO).modifications)
  );
}

// ============================================================================
// Utility Types
// ============================================================================

export type BuildDTO = BuildSummaryDTO | BuildDetailDTO;
export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// For frontend components that need to handle both summary and detail views
export interface BuildCardProps {
  build: BuildSummaryDTO;
  onDelete: (buildId: string) => Promise<void>;
  onShare: (buildId: string) => Promise<string>;
  onEdit?: (buildId: string) => void;
}

export interface BuildDetailProps {
  build: BuildDetailDTO;
  onUpdate: (updates: UpdateBuildDTO) => Promise<void>;
  onDelete: (buildId: string) => Promise<void>;
  onShare: (buildId: string) => Promise<string>;
}
