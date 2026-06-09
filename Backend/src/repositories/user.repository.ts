import { QueryFilter } from "mongoose";
import { IUser, UserModel } from "../models/user.model";

export interface IUserRepository {
    createUser(data: Partial<IUser>): Promise<IUser>;
    getAllUsers({ page, size, search }: { page: number; size: number; search?: string }): Promise<{ users: IUser[]; totalUsers: number }>;
    getUserById(id: string): Promise<IUser | null>;
    updateOneUser(id: string, data: Partial<IUser>): Promise<IUser | null>;
    deleteOneUser(id: string): Promise<boolean | null>;
    getUserByEmail(email: string): Promise<IUser | null>;
    getUserByPhoneNumber(phoneNumber: string): Promise<IUser | null>;
    uploadProfilePicture(id: string, profilePicture: string): Promise<IUser | null>;
    updateUserLocation(userId: string, lng: number, lat: number): Promise<IUser | null>;
}

export class UserRepository implements IUserRepository {
    async createUser(data: Partial<IUser>): Promise<IUser> {
        const user = new UserModel(data);
        return await user.save();
    }

    async getAllUsers({ page, size, search }: { page: number; size: number; search?: string }): Promise<{ users: IUser[]; totalUsers: number }> {
        let filter: QueryFilter<IUser> = { role: "user" };
        if (search) {
            filter.$or = [
                { fullName: { $regex: search, $options: "i" } },
                { phoneNumber: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
            ];
        }
        const [users, totalUsers] = await Promise.all([
            UserModel.find(filter)
                .skip((page - 1) * size)
                .limit(size),
            UserModel.countDocuments(filter),
        ]);
        return { users, totalUsers };
    }

    async getUserById(id: string): Promise<IUser | null> {
        return await UserModel.findById(id);
    }

    async updateOneUser(id: string, data: Partial<IUser>): Promise<IUser | null> {
        return await UserModel.findByIdAndUpdate(id, data, { new: true });
    }

    async deleteOneUser(id: string): Promise<boolean | null> {
        const result = await UserModel.findByIdAndDelete(id);
        return result ? true : null;
    }

    async getUserByEmail(email: string): Promise<IUser | null> {
        return await UserModel.findOne({ email });
    }

    async getUserByPhoneNumber(phoneNumber: string): Promise<IUser | null> {
        return await UserModel.findOne({ phoneNumber });
    }

    async uploadProfilePicture(id: string, profilePicture: string): Promise<IUser | null> {
        return await UserModel.findByIdAndUpdate(id, { profilePicture }, { new: true });
    }

    async updateUserLocation(userId: string, lng: number, lat: number): Promise<IUser | null> {
        return await UserModel.findByIdAndUpdate(
            userId,
            { $set: { location: { type: "Point", coordinates: [lng, lat] } } },
            { new: true }
        );
    }
}