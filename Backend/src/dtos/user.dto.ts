import z from "zod";
import { UserSchema } from "../types/user.type";

export const CreateUserDto = UserSchema.pick({
    fullName: true,
    email: true,
    password: true,
    phoneNumber: true,
}).extend({
    confirmPassword: z.string().trim().min(6, "Password can't be less than 6 characters"),
}).refine(
    (data) => data.password === data.confirmPassword,
    { message: "Passwords do not match", path: ["confirmPassword"] }
);
export type CreateUserDto = z.infer<typeof CreateUserDto>;

export const UpdateUserDto = UserSchema.pick({
    fullName: true,
    email: true,
    password: true,
    phoneNumber: true,
    profilePicture: true,
}).partial();
export type UpdateUserDto = z.infer<typeof UpdateUserDto>;

export const UpdateUserLocationDto = z.object({
    lng: z.number(),
    lat: z.number(),
});
export type UpdateUserLocationDto = z.infer<typeof UpdateUserLocationDto>;

export const LoginUserDto = z.object({
    email: z.email(),
    password: z.string().trim().min(6, "Password can't be less than 6 characters"),
});
export type LoginUserDto = z.infer<typeof LoginUserDto>;
