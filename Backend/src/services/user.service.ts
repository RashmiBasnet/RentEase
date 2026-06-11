import { UpdateUserDto } from "../dtos/user.dto";
import { UserRepository } from "../repositories/user.repository";
import { HttpError } from "../errors/http-error";
import bcryptjs from "bcryptjs";
import fs from "fs";
import path from "path";

let userRepository = new UserRepository();

interface UploadedFile {
    filename: string;
}

export class UserService {
    async getUserById(userId: string) {
        const user = await userRepository.getUserById(userId);
        if (!user) {
            throw new HttpError(404, "User not found");
        }
        return user;
    }

    async getAllUsers({ page, size, search }: { page: number; size: number; search?: string }) {
        return await userRepository.getAllUsers({ page, size, search });
    }

    async updateUser(userId: string, data: UpdateUserDto) {
        const user = await userRepository.getUserById(userId);
        if (!user) {
            throw new HttpError(404, "User not found");
        }
        if (data.email && data.email !== user.email) {
            const emailExists = await userRepository.getUserByEmail(data.email);
            if (emailExists) {
                throw new HttpError(403, "Email already in use");
            }
        }
        if (data.phoneNumber && data.phoneNumber !== user.phoneNumber) {
            const phoneExists = await userRepository.getUserByPhoneNumber(data.phoneNumber);
            if (phoneExists) {
                throw new HttpError(403, "Phone number already in use");
            }
        }
        if (data.password) {
            data.password = await bcryptjs.hash(data.password, 10);
        }
        return await userRepository.updateOneUser(userId, data);
    }

    async updateUserLocation(userId: string, lng: number, lat: number) {
        const updatedUser = await userRepository.updateUserLocation(userId, lng, lat);
        if (!updatedUser) {
            throw new HttpError(404, "User not found");
        }
        return updatedUser;
    }

    async uploadProfilePicture(userId: string, file?: UploadedFile) {
        if (!file) {
            throw new HttpError(400, "Please upload a file");
        }
        const user = await userRepository.getUserById(userId);
        if (!user) {
            throw new HttpError(404, "User not found");
        }
        if (user.profilePicture) {
            const oldFilePath = path.join(process.cwd(), "uploads", user.profilePicture);
            if (fs.existsSync(oldFilePath)) {
                await fs.promises.unlink(oldFilePath);
            }
        }
        return await userRepository.uploadProfilePicture(userId, file.filename);
    }

    async deleteUser(userId: string) {
        const deleted = await userRepository.deleteOneUser(userId);
        if (!deleted) {
            throw new HttpError(404, "User not found");
        }
        return deleted;
    }
}
