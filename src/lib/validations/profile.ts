import { z } from "zod";

export const childfreeStatusEnum = z.enum([
  "CHOICE",
  "STERILIZED",
  "CIRCUMSTANCE",
  "PARENT_DONE",
]);

export const relationshipStatusEnum = z.enum([
  "SINGLE",
  "RELATIONSHIP",
  "COMPLICATED",
  "ENM",
]);

export const seekingTypeEnum = z.enum(["DATING", "FRIENDSHIP", "COMMUNITY"]);

export const createProfileSchema = z.object({
  displayName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters"),
  birthdate: z.string().refine((date) => {
    const age = calculateAge(new Date(date));
    return age >= 18;
  }, "You must be at least 18 years old"),
  gender: z.string().min(1, "Please select your gender"),
  genderPreferences: z
    .array(z.string())
    .min(1, "Please select at least one preference"),
  childfreeStatus: childfreeStatusEnum,
  relationshipStatus: relationshipStatusEnum,
  seeking: z.array(seekingTypeEnum).min(1, "Please select at least one option"),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  locationCity: z.string().optional(),
  ageMin: z.number().min(18).max(99).default(18),
  ageMax: z.number().min(18).max(99).default(99),
  distanceMax: z.number().min(1).max(500).default(50),
});

export const updateProfileSchema = createProfileSchema.partial();

export const photoSchema = z.object({
  url: z.string().url("Invalid photo URL"),
  position: z.number().min(0).max(5),
});

export const promptSchema = z.object({
  promptType: z.string().min(1),
  answer: z
    .string()
    .min(10, "Answer must be at least 10 characters")
    .max(300, "Answer must be less than 300 characters"),
  position: z.number().min(0).max(2),
});

// Helper function
function calculateAge(birthdate: Date): number {
  const today = new Date();
  let age = today.getFullYear() - birthdate.getFullYear();
  const monthDiff = today.getMonth() - birthdate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthdate.getDate())
  ) {
    age--;
  }
  return age;
}

export type CreateProfileInput = z.infer<typeof createProfileSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
