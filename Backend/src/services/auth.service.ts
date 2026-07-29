import { CreateUserDto, LoginUserDto } from "../dtos/user.dto";
import { UserRepository } from "../repositories/user.repository";
import { HttpError } from "../errors/http-error";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";
import { sendEmail } from "../config/email";
import { IUser } from "../models/user.model";
import type { GoogleIdentity } from "./google.service";

const CLIENT_URL = process.env.CLIENT_URL as string;

let userRepository = new UserRepository();

function signAuthToken(user: IUser): string {
    const payload = {
        id: user._id,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
    };
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "30d" });
}

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
        // Accounts created through Google have no password set — steer them to Google.
        if (!user.password) {
            throw new HttpError(401, "This account uses Google sign-in. Please continue with Google.");
        }
        const isPasswordValid = await bcryptjs.compare(data.password, user.password);
        if (!isPasswordValid) {
            throw new HttpError(401, "Invalid credentials");
        }
        const token = signAuthToken(user);
        return { token, user };
    }

    async loginWithGoogle(identity: GoogleIdentity) {
        // 1. Returning Google user — matched by their stable Google id.
        const byGoogleId = await userRepository.getUserByGoogleId(identity.googleId);
        if (byGoogleId) {
            return { token: signAuthToken(byGoogleId), user: byGoogleId, created: false };
        }

        // 2. Existing email/password account — link Google to it so both work.
        //    Only link when Google has verified the address, otherwise someone could
        //    claim an account by signing up to Google with an email they don't own.
        const byEmail = await userRepository.getUserByEmail(identity.email);
        if (byEmail) {
            if (!identity.emailVerified) {
                throw new HttpError(
                    403,
                    "Your Google account has not verified this email address, so it cannot be linked to an existing RentEase account."
                );
            }
            const linked = await userRepository.linkGoogleId(String(byEmail._id), identity.googleId);
            const user = linked ?? byEmail;
            return { token: signAuthToken(user), user, created: false };
        }

        // 3. Brand-new user — create a passwordless account from the Google profile.
        if (!identity.emailVerified) {
            throw new HttpError(
                403,
                "Your Google account has not verified this email address, so it cannot be used to sign in."
            );
        }
        const created = await userRepository.createUser({
            fullName: identity.name,
            email: identity.email,
            googleId: identity.googleId,
        });
        return { token: signAuthToken(created), user: created, created: true };
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
        const firstName = user.fullName?.split(" ")[0] || "there";
        const html = `
            <div style="max-width:600px;margin:0 auto;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;background:#ffffff;border:1px solid #e4e7ec;border-radius:16px;overflow:hidden;">

                <!-- Header -->
                <div style="background:#0a5be0;color:#ffffff;padding:28px 24px;text-align:center;">
                    <div style="font-size:24px;font-weight:800;letter-spacing:-0.02em;">RentEase</div>
                    <div style="margin-top:4px;font-size:13px;color:#d9e6ff;">Reliable vehicle rentals across Nepal</div>
                </div>

                <!-- Body -->
                <div style="padding:32px 28px;color:#101828;line-height:1.6;">
                    <h2 style="margin:0 0 16px;font-size:20px;color:#101828;">Reset your password</h2>
                    <p style="margin:0 0 16px;color:#475467;">
                        Hi ${firstName}, we received a request to reset the password for your RentEase account.
                    </p>
                    <p style="margin:0 0 8px;color:#475467;">
                        Click the button below to choose a new password. This link will expire in
                        <strong style="color:#101828;">1 hour</strong>.
                    </p>

                    <!-- Button -->
                    <div style="text-align:center;margin:32px 0;">
                        <a
                            href="${resetLink}"
                            style="background:#0a5be0;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:12px;display:inline-block;font-weight:600;font-size:15px;"
                        >
                            Reset Password
                        </a>
                    </div>

                    <p style="margin:0 0 8px;font-size:13px;color:#667085;">
                        If the button doesn't work, copy and paste this link into your browser:
                    </p>
                    <p style="margin:0 0 24px;font-size:13px;word-break:break-all;">
                        <a href="${resetLink}" style="color:#0a5be0;text-decoration:none;">${resetLink}</a>
                    </p>

                    <div style="border-top:1px solid #e4e7ec;padding-top:16px;">
                        <p style="margin:0;font-size:13px;color:#667085;">
                            If you didn't request a password reset, you can safely ignore this email — your password will stay the same.
                        </p>
                    </div>
                </div>

                <!-- Footer -->
                <div style="background:#f2f4f7;padding:20px;text-align:center;font-size:12px;color:#667085;">
                    © ${new Date().getFullYear()} RentEase. All rights reserved.
                </div>

            </div>
        `;

        await sendEmail(user.email, "Reset your RentEase password", html);
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