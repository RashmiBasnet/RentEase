import { CreateUserDto, LoginUserDto } from "../dtos/user.dto";
import { UserRepository } from "../repositories/user.repository";
import { HttpError } from "../errors/http-error";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";

const CLIENT_URL = process.env.CLIENT_URL as string;

let userRepository = new UserRepository();

export class AuthService {
    async registerUser(data: CreateUserDto) {
        const emailExists = await userRepository.getUserByEmail(data.email);
        if (emailExists) {
            throw new HttpError(403, "Email is already in use");
        }
        const phoneExists = await userRepository.getUserByPhoneNumber(data.phoneNumber);
        if (phoneExists) {
            throw new HttpError(403, "Phone number is already in use");
        }
        const hashedPassword = await bcryptjs.hash(data.password, 10);
        const newUser = await userRepository.createUser({
            ...data,
            password: hashedPassword,
        });
        return newUser;
    }

    async loginUser(data: LoginUserDto) {
        const user = await userRepository.getUserByEmail(data.email);
        if (!user) {
            throw new HttpError(404, "User not found");
        }
        const isPasswordValid = await bcryptjs.compare(data.password, user.password);
        if (!isPasswordValid) {
            throw new HttpError(401, "Invalid credentials");
        }
        const payload = {
            id: user._id,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
        };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "30d" });
        return { token, user };
    }

    async sendResetPasswordEmail(email?: string) {
        if (!email) {
            throw new HttpError(400, "Email is required");
        }
        const user = await userRepository.getUserByEmail(email);
        if (!user) {
            throw new HttpError(404, "User not found");
        }
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });
        const resetLink = `${CLIENT_URL}/reset-password?token=${token}`;
        return user;
    }

    async resetPassword(token?: string, newPassword?: string) {
        if (!token || !newPassword) {
            throw new HttpError(400, "Token and new password are required");
        }
        try {
            const decoded: any = jwt.verify(token, JWT_SECRET);
            const user = await userRepository.getUserById(decoded.id);
            if (!user) {
                throw new HttpError(404, "User not found");
            }
            const hashedPassword = await bcryptjs.hash(newPassword, 10);
            await userRepository.updateOneUser(String(user._id), { password: hashedPassword });
            return user;
        } catch {
            throw new HttpError(400, "Invalid or expired token");
        }
    }
}