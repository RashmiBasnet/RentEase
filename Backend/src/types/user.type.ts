import z from "zod";

const GeoPointSchema = z.object({
    type: z.literal("Point").default("Point"),
    // GeoJSON format: [longitude, latitude]
    coordinates: z.tuple([z.number(), z.number()]),
});

export const UserSchema = z.object({
    fullName: z.string().trim().min(2, "Full name must be at least 2 characters"),
    email: z.email(),
    password: z.string().trim().min(6, "Password can't be less than 6 characters"),
    phoneNumber: z.string().trim().length(10, "Phone number must be 10 digits"),
    role: z.enum(["admin", "user"]).default("user"),
    profilePicture: z.string().optional(),
    isVerified: z.boolean().default(false),
    location: GeoPointSchema.optional(),
});

export type UserType = z.infer<typeof UserSchema>;