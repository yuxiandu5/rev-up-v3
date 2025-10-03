/**
 * DTO Mappers - Transform database entities to DTOs
 *
 * These functions ensure consistent data transformation between database models
 * and the DTOs consumed by the frontend. They handle data validation,
 * type conversion, and computed fields.
 */

import { UserBuild, User } from "@prisma/client";
import {
  BuildSummaryDTO,
  BuildDetailDTO,
  CarInfoDTO,
  CarSpecsDTO,
  ModificationDTO,
  UserSummaryDTO,
  UserProfileDTO,
} from "@/types/DTO/dtos";

// ============================================================================
// Database Entity Types (extend Prisma types for better type safety)
// ============================================================================

// Real structure from frontend (SelectedCar type)
interface DatabaseBuildCar {
  makeId: string;
  make: string;
  modelId: string;
  model: string;
  badgeId: string;
  badge: string;
  yearRangeId: string;
  yearRange: string; // e.g., "2020-2023" or "2020-Present"
}

// Real structure from frontend (CarSpecs type)
interface DatabaseBuildSpecs {
  hp: number;
  torque: number;
  zeroToHundred: number;
  handling: number;
  url?: string;
  chassis?: string | null;
}

// Real structure from frontend (Mod objects with compatibilities)
interface DatabaseBuildMods {
  [categoryId: string]: {
    id: string;
    name: string;
    slug: string;
    category: string;
    description?: string;
    compatibilities?: Array<{
      id: string;
      modId: string;
      badgeId: string;
      modelId: string;
      makeId: string;
      hpGain?: number;
      nmGain?: number;
      handlingDelta?: number;
      zeroToHundredDelta?: number;
      price: number;
      notes?: string;
    }>;
    dependentOn?: Array<{
      prerequisiteCategory: {
        id: string;
        name: string;
        slug: string;
        description: string;
      };
    }>;
  };
}

type DatabaseBuild = UserBuild & {
  user?: Pick<User, "userName">;
};

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Safely parse JSON fields from database
 */
function safeParseJSON<T>(jsonData: unknown, fallback: T): T {
  try {
    if (typeof jsonData === "object" && jsonData !== null) {
      return jsonData as T;
    }
    return fallback;
  } catch {
    return fallback;
  }
}

/**
 * Calculate total performance from base specs and modifications
 */
function calculateTotalPerformance(
  baseSpecs: CarSpecsDTO,
  modifications: ModificationDTO[]
): {
  totalHp: number;
  totalTorque: number;
  totalHandling: number;
  zeroToHundred: number;
} {
  const totalHpGain = modifications.reduce((sum, mod) => sum + mod.performance.hpGain, 0);
  const totalTorqueGain = modifications.reduce((sum, mod) => sum + mod.performance.torqueGain, 0);
  const totalHandlingDelta = modifications.reduce(
    (sum, mod) => sum + mod.performance.handlingDelta,
    0
  );
  const totalZeroToHundredDelta = modifications.reduce(
    (sum, mod) => sum + mod.performance.zeroToHundredDelta,
    0
  );

  return {
    totalHp: Math.max(0, baseSpecs.hp + totalHpGain),
    totalTorque: Math.max(0, baseSpecs.torque + totalTorqueGain),
    totalHandling: Math.max(0, Math.min(10, baseSpecs.handling + totalHandlingDelta)), // Clamp between 0-10
    zeroToHundred: Math.max(10, baseSpecs.zeroToHundred + totalZeroToHundredDelta), // Minimum 1.0s (10 tenths)
  };
}

/**
 * Calculate total price of modifications
 */
function calculateTotalPrice(modifications: ModificationDTO[]): number {
  return modifications.reduce((sum, mod) => sum + (mod.price || 0), 0);
}

/**
 * Format date to ISO string safely
 */
function formatDate(date: Date | string): string {
  if (date instanceof Date) {
    return date.toISOString();
  }
  if (typeof date === "string") {
    return new Date(date).toISOString();
  }
  return new Date().toISOString();
}

// ============================================================================
// Car/Specs Mappers
// ============================================================================

export function mapToCarInfoDTO(carData: unknown): CarInfoDTO {
  const car = safeParseJSON<DatabaseBuildCar>(carData, {
    makeId: "",
    make: "Unknown Make",
    modelId: "",
    model: "Unknown Model",
    badgeId: "",
    badge: "",
    yearRangeId: "",
    yearRange: "2020-Present",
  });

  // Parse year range string (e.g., "2020-2023" or "2020-Present")
  const parseYearRange = (yearRange: string) => {
    if (yearRange.includes("Present")) {
      const startYear = parseInt(yearRange.split("-")[0]) || 2020;
      return { startYear, endYear: null };
    } else if (yearRange.includes("-")) {
      const [start, end] = yearRange.split("-");
      return {
        startYear: parseInt(start) || 2020,
        endYear: parseInt(end) || null,
      };
    } else {
      const year = parseInt(yearRange) || 2020;
      return { startYear: year, endYear: null };
    }
  };

  const { startYear, endYear } = parseYearRange(car.yearRange);

  return {
    makeId: car.makeId,
    make: car.make,
    modelId: car.modelId,
    model: car.model,
    badgeId: car.badgeId,
    badge: car.badge,
    yearRangeId: car.yearRangeId,
    startYear,
    endYear,
    chassis: null, // Not available in SelectedCar, would need to be fetched separately
  };
}

export function mapToCarSpecsDTO(specsData: unknown): CarSpecsDTO {
  const specs = safeParseJSON<DatabaseBuildSpecs>(specsData, {
    hp: 0,
    torque: 0,
    zeroToHundred: 100, // 10.0s default
    handling: 5,
    url: "",
  });

  return {
    hp: specs.hp,
    torque: specs.torque,
    zeroToHundred: specs.zeroToHundred,
    handling: specs.handling,
    imageUrl: specs.url || "",
  };
}

export function mapToModificationsDTO(modsData: unknown): ModificationDTO[] {
  const mods = safeParseJSON<DatabaseBuildMods>(modsData, {});

  return Object.values(mods).map((mod): ModificationDTO => {
    // Get performance data from first compatibility (or defaults)
    const compatibility = mod.compatibilities?.[0];

    return {
      id: mod.id,
      name: mod.name,
      brand: "Unknown", // Not available in Mod structure, using default
      category: mod.category,
      description: mod.description,
      imageUrl: undefined, // Not available in Mod structure
      performance: {
        hpGain: compatibility?.hpGain || 0,
        torqueGain: compatibility?.nmGain || 0,
        handlingDelta: compatibility?.handlingDelta || 0,
        zeroToHundredDelta: compatibility?.zeroToHundredDelta || 0,
      },
      price: compatibility?.price || 0,
      notes: compatibility?.notes,
    };
  });
}

// ============================================================================
// Build Mappers
// ============================================================================

export function mapToBuildSummaryDTO(build: DatabaseBuild): BuildSummaryDTO {
  const car = mapToCarInfoDTO(build.selectedCar);
  const specs = mapToCarSpecsDTO(build.baseSpecs);
  const modifications = mapToModificationsDTO(build.selectedMods);

  const performance = calculateTotalPerformance(specs, modifications);
  const totalPrice = calculateTotalPrice(modifications);

  return {
    id: build.id,
    nickname: build.nickname || undefined,
    car,
    specs,
    modsCount: modifications.length,
    totalPrice,
    performance,
    createdAt: formatDate(build.createdAt),
    updatedAt: formatDate(build.updatedAt),
  };
}

export function mapToBuildDetailDTO(build: DatabaseBuild): BuildDetailDTO {
  const summaryDTO = mapToBuildSummaryDTO(build);
  const modifications = mapToModificationsDTO(build.selectedMods);

  return {
    ...summaryDTO,
    modifications,
    notes: build.notes || undefined,
    createdBy: build.user?.userName,
  };
}

// ============================================================================
// User Mappers
// ============================================================================

export function mapToUserSummaryDTO(
  user: User,
  buildCount: number = 0,
  lastActive?: Date
): UserSummaryDTO {
  return {
    id: user.id,
    userName: user.userName,
    memberSince: formatDate(user.createdAt),
    buildCount,
    lastActive: lastActive ? formatDate(lastActive) : undefined,
  };
}

export function mapToUserProfileDTO(
  user: User,
  buildCount: number = 0,
  lastActive?: Date
): UserProfileDTO {
  return {
    ...mapToUserSummaryDTO(user, buildCount, lastActive),
    recoverQuestion: user.recoverQuestion,
  };
}

// ============================================================================
// Batch Mappers (for arrays)
// ============================================================================

export function mapToBuildSummaryDTOs(builds: DatabaseBuild[]): BuildSummaryDTO[] {
  return builds.map(mapToBuildSummaryDTO);
}

export function mapToBuildDetailDTOs(builds: DatabaseBuild[]): BuildDetailDTO[] {
  return builds.map(mapToBuildDetailDTO);
}

// ============================================================================
// Validation Helpers
// ============================================================================

/**
 * Validates that a build has the minimum required data
 */
export function validateBuildData(build: DatabaseBuild): boolean {
  try {
    const car = mapToCarInfoDTO(build.selectedCar);
    const specs = mapToCarSpecsDTO(build.baseSpecs);

    return !!(
      build.id &&
      car.makeId &&
      car.make &&
      car.modelId &&
      car.model &&
      specs.hp >= 0 &&
      specs.torque >= 0
    );
  } catch {
    return false;
  }
}

/**
 * Filters out invalid builds from an array
 */
export function filterValidBuilds(builds: DatabaseBuild[]): DatabaseBuild[] {
  return builds.filter(validateBuildData);
}
