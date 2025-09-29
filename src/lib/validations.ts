import { z } from "zod";

// Backend schemas (for API validation)
export const registerSchema = z.object({
  userName: z.string().max(254),
  password: z.string().min(8).max(128),
  recoverQuestion: z.string().max(254),
  answer: z.string().max(254),
});

export const loginSchema = z.object({
  userName: z.string().max(254),
  password: z.string(),
});

export const verifyAnswerSchema = z.object({
  userName: z.string().max(254),
  answer: z.string().max(254),
});

export const requestPasswordResetSchema = z.object({
  userName: z.string().max(254),
  answer: z.string().max(254),
});

// Frontend schemas (with additional UI requirements)
export const registerFormSchema = z
  .object({
    userName: z.string().min(1, "User name is required").max(254, "User name is too long"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters")
      .max(128, "Password is too long"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    recoverQuestion: z
      .string()
      .min(1, "Recover question is required")
      .max(254, "Recover question is too long"),
    answer: z.string().min(1, "Answer is required").max(254, "Answer is too long"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginFormSchema = z.object({
  userName: z.string().min(1, "User name is required").max(254, "User name is too long"),
  password: z.string().min(1, "Password is required"),
});

export const verifyUsernameSchema = z.object({
  userName: z.string().max(254),
});

export const verifyAnswerFormSchema = z.object({
  answer: z.string().max(254),
});

export const requestPasswordResetFormSchema = z
  .object({
    newPassword: z
      .string()
      .min(1, "New password is required")
      .min(8, "New password must be at least 8 characters")
      .max(128, "New password is too long"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// ============================================================================
// DTO Validation Schemas
// ============================================================================

// Car Info Schema
export const carInfoSchema = z.object({
  makeId: z.string().min(1),
  make: z.string().min(1),
  modelId: z.string().min(1),
  model: z.string().min(1),
  badgeId: z.string().min(1),
  badge: z.string().min(1),
  yearRangeId: z.string().min(1),
  startYear: z.number().int().min(1900).max(2100),
  endYear: z.number().int().min(1900).max(2100).nullable(),
  chassis: z.string().nullable(),
});

// Car Specs Schema
export const carSpecsSchema = z.object({
  hp: z.number().int().min(0).max(2000),
  torque: z.number().int().min(0).max(2000),
  zeroToHundred: z.number().int().min(10).max(1000), // 1.0s to 100.0s in tenths
  handling: z.number().int().min(0).max(10),
  imageUrl: z.string().url().or(z.string().length(0)), // Allow empty string
});

// Modification Schema
export const modificationSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  brand: z.string().min(1),
  category: z.string().min(1),
  description: z.string().optional(),
  imageUrl: z.string().url().optional(),
  performance: z.object({
    hpGain: z.number().int().min(-500).max(500),
    torqueGain: z.number().int().min(-500).max(500),
    handlingDelta: z.number().int().min(-10).max(10),
    zeroToHundredDelta: z.number().int().min(-500).max(500),
  }),
  price: z.number().int().min(0).optional(),
  notes: z.string().optional(),
});

// Build DTO Schemas
export const createBuildDTOSchema = z.object({
  selectedCar: carInfoSchema,
  baseSpecs: carSpecsSchema,
  selectedMods: z.record(z.string(), modificationSchema),
  nickname: z.string().max(100).optional(),
  notes: z.string().max(1000).optional(),
});

export const updateBuildDTOSchema = z.object({
  selectedCar: carInfoSchema.partial().optional(),
  baseSpecs: carSpecsSchema.partial().optional(),
  selectedMods: z.record(z.string(), modificationSchema).optional(),
  nickname: z.string().max(100).optional(),
  notes: z.string().max(1000).optional(),
});

// Legacy Build validation schemas (for backward compatibility with existing JSON storage)
export const createBuildSchema = z.object({
  selectedCar: z.record(z.string(), z.any()), // JSON object
  baseSpecs: z.record(z.string(), z.any()), // JSON object
  selectedMods: z.record(z.string(), z.any()), // JSON object
  nickname: z.string().max(100).optional(),
  notes: z.string().max(1000).optional(),
});

export const updateBuildSchema = z.object({
  selectedCar: z.record(z.string(), z.any()).optional(),
  baseSpecs: z.record(z.string(), z.any()).optional(),
  selectedMods: z.record(z.string(), z.any()).optional(),
  nickname: z.string().max(100).optional(),
  notes: z.string().max(1000).optional(),
});

// Pagination validation
export const PaginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(1000).default(500),
  q: z.string().max(100).optional(),
});

export const UserFilterSchema = z.object({
  userName: z.preprocess((val) => (val === null ? undefined : val), z.string().optional()),
  role: z.preprocess(
    (val) => (val === null ? undefined : val),
    z.enum(["USER", "MODERATOR", "ADMIN"]).optional()
  ),
  isActive: z.preprocess((val) => (val === null ? undefined : val), z.coerce.boolean().optional()),
});

// General Validation
export const IdSchema = z.object({
  id: z.string().cuid(),
});

export const ManyIdSchema = z.object({
  ids: z.array(z.string().cuid()),
});

// AdminUserApi validation
export const AdminToggleActiveSchema = z.object({
  isActive: z.union([z.boolean(), z.enum(["true", "false"]).transform((val) => val === "true")]),
});

export const UserIdFormatSchema = IdSchema;

// Car CRUD endpoints validation
export const CarYearRangeCreateSchema = z.object({
  badgeId: z.string(),
  startYear: z.coerce.number().int().min(1900).max(2025),
  endYear: z.coerce.number().int().min(1900).max(2025).optional(),
  chassis: z.string().optional(),
  hp: z.coerce.number().int().min(0).max(1500),
  torque: z.coerce.number().int().min(0).max(1000),
  zeroToHundred: z.coerce.number().min(0).max(200),
  handling: z.coerce.number().int().min(0).max(10),
  imageUrl: z.string(),
  imageDescription: z.string().optional(),
  imageName: z.string(),
});

export const CarYearRangeUpdateSchema = z
  .object({
    startYear: z.coerce.number().int().min(1900).max(2025).optional(),
    endYear: z.coerce.number().int().min(1900).max(2025).optional(),
    chassis: z.string().optional(),
    hp: z.coerce.number().int().min(0).max(1500).optional(),
    torque: z.coerce.number().int().min(0).max(1000).optional(),
    zeroToHundred: z.coerce.number().int().min(0).max(200).optional(),
    handling: z.coerce.number().int().min(0).max(10).optional(),
    imageUrl: z.string().optional(),
    imageDescription: z.string().optional(),
    imageName: z.string(),
  })
  .strip();

export const YearRangeIdFormatSchema = IdSchema;

// Makes / Models / Badges CRUD endpoints validation
export const MakeCreateSchema = z.object({
  name: z.string().min(1).max(100),
  slug: z
    .string()
    .nullable()
    .optional()
    .transform((val) => {
      if (val === null || val?.trim() === "") return undefined;
      return val;
    }),
});

export const ModelCreateSchema = z.object({
  makeId: z.string().cuid(),
  name: z.string().min(1).max(100),
  slug: z
    .string()
    .nullable()
    .optional()
    .transform((val) => {
      if (val === null || val?.trim() === "") return undefined;
      return val;
    }),
});

export const BadgeCreateSchema = z.object({
  modelId: z.string().cuid(),
  name: z.string().min(1).max(100),
  slug: z
    .string()
    .nullable()
    .optional()
    .transform((val) => {
      if (val === null || val?.trim() === "") return undefined;
      return val;
    }),
});

export const ModCategoryCreateSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string(),
});

export const ModCategoryUpdateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().optional(),
});

export const ModCreateSchema = z.object({
  name: z.string().min(1).max(100),
  brand: z.string().min(1).max(100),
  category: z.string().min(1).max(100),
  description: z.string().optional(),
  modCategoryId: z.string().cuid(),
});

export const ModUpdateSchema = z
  .object({
    name: z.string().min(1).max(100).optional(),
    brand: z.string().min(1).max(100).optional(),
    category: z.string().min(1).max(100).optional(),
    description: z.string().optional(),
  })
  .strip();

export const ModCompatibilityCreateSchema = z.object({
  modId: z.string().cuid(),
  modelYearRangeId: z.string().cuid(),
  badgeId: z.string().cuid(),
  modelId: z.string().cuid(),
  makeId: z.string().cuid(),
  modelYearRange: z.coerce.string(),
  hpGain: z.coerce.number().int().min(-1000).max(1000).optional(),
  nmGain: z.coerce.number().int().min(-1000).max(1000).optional(),
  handlingDelta: z.coerce.number().int().min(-10).max(10).optional(),
  zeroToHundredDelta: z.coerce.number().int().min(-100).max(100).optional(),
  price: z.coerce.number().int().min(0).max(10000).optional(),
  notes: z.string().optional(),
});

export const ModCompatibilityUpdateSchema = z.object({
  hpGain: z.coerce.number().int().min(-1000).max(1000).optional(),
  nmGain: z.coerce.number().int().min(-1000).max(1000).optional(),
  handlingDelta: z.coerce.number().int().min(-10).max(10).optional(),
  zeroToHundredDelta: z.coerce.number().int().min(-100).max(100).optional(),
  price: z.coerce.number().int().min(0).max(10000).optional(),
  notes: z.string().optional(),
});

export const ModRequirementCreateSchema = z.object({
  prerequisiteCategoryId: z.string().cuid(),
  dependentId: z.string().cuid(),
});

// media asset
export const MediaAssetCreateSchema = z.object({
  name: z.string().min(1).max(100),
  url: z.string().url(),
  modId: z.string().cuid().optional(),
  modelYearRangeId: z.string().cuid().optional(),
})
.refine(
  (data) => (data.modId ? !data.modelYearRangeId : !!data.modelYearRangeId),
  {
    message: "Provide either a modId OR a modelYearRangeId (not both, not neither)",
    path: ["modId"], // where the error will attach
  }
);

export const MediaAssetUpdateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  url: z.string().url().optional(),
  modId: z.string().cuid().optional(),
  modelYearRangeId: z.string().cuid().optional(),
})
.refine(
  (data) => (data.modId ? !data.modelYearRangeId : !!data.modelYearRangeId),
  {
    message: "Provide either a modId OR a modelYearRangeId (not both, not neither)",
    path: ["modId"], // where the error will attach
  }
);

export const fileUploadSchema = z.object({
  fileName: z
    .string()
    .min(1)
    .max(100)
    .regex(/\.(png|jpe?g|webp)$/i, "File must be .png, .jpg, .jpeg, or .webp"),
  contentType: z.enum(["image/png", "image/jpeg", "image/webp"]),
});

// Type exports
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterFormInput = z.infer<typeof registerFormSchema>;
export type LoginFormInput = z.infer<typeof loginFormSchema>;
export type VerifyUsernameInput = z.infer<typeof verifyUsernameSchema>;
export type VerifyAnswerInput = z.infer<typeof verifyAnswerSchema>;
export type VerifyAnswerFormInput = z.infer<typeof verifyAnswerFormSchema>;
export type RequestPasswordResetFormInput = z.infer<typeof requestPasswordResetFormSchema>;
export type MakeInput = z.infer<typeof MakeCreateSchema>;

// DTO Type exports
export type CarInfoInput = z.infer<typeof carInfoSchema>;
export type CarSpecsInput = z.infer<typeof carSpecsSchema>;
export type ModificationInput = z.infer<typeof modificationSchema>;
export type CreateBuildDTOInput = z.infer<typeof createBuildDTOSchema>;
export type UpdateBuildDTOInput = z.infer<typeof updateBuildDTOSchema>;

// Legacy type exports
export type CreateBuildInput = z.infer<typeof createBuildSchema>;
export type UpdateBuildInput = z.infer<typeof updateBuildSchema>;

// make model badge yearRange
export type CreateModelInput = z.infer<typeof ModelCreateSchema>;
export type CreateBadgeInput = z.infer<typeof BadgeCreateSchema>;
export type CreateYearRangeInput = z.infer<typeof CarYearRangeCreateSchema>;
export type UpdateYearRangeInput = z.infer<typeof CarYearRangeUpdateSchema>;

// mod category
export type CreateModCategoryInput = z.infer<typeof ModCategoryCreateSchema>;
export type UpdateModCategoryInput = z.infer<typeof ModCategoryUpdateSchema>;

// mod
export type CreateModInput = z.infer<typeof ModCreateSchema>;
export type UpdateModInput = z.infer<typeof ModUpdateSchema>;

// mod compatibility
export type CreateModCompatibilityInput = z.infer<typeof ModCompatibilityCreateSchema>;
export type UpdateModCompatibilityInput = z.infer<typeof ModCompatibilityUpdateSchema>;

// mod requirement
export type CreateModRequirementInput = z.infer<typeof ModRequirementCreateSchema>;

// media asset
export type CreateMediaAssetInput = z.infer<typeof MediaAssetCreateSchema>;
export type UpdateMediaAssetInput = z.infer<typeof MediaAssetUpdateSchema>;
export type FileUploadInput = z.infer<typeof fileUploadSchema>;