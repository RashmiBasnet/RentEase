import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { HttpError } from "../errors/http-error";
import type { GoogleIdentity } from "../services/google.service";

// --- Mocks ---------------------------------------------------------------
// A single shared repository instance so we can drive the service's behaviour.
// The name must start with "mock" for jest.mock's hoisting to allow the reference.
const mockRepo = {
    getUserByEmail: jest.fn(),
    getUserByPhoneNumber: jest.fn(),
    getUserByGoogleId: jest.fn(),
    getUserById: jest.fn(),
    createUser: jest.fn(),
    linkGoogleId: jest.fn(),
    updateOneUser: jest.fn(),
};

jest.mock("../repositories/user.repository", () => ({
    UserRepository: jest.fn(() => mockRepo),
}));

jest.mock("bcryptjs", () => ({
    hash: jest.fn(),
    compare: jest.fn(),
}));

jest.mock("jsonwebtoken", () => ({
    sign: jest.fn(() => "signed.jwt.token"),
    verify: jest.fn(),
}));

// Avoid touching nodemailer / sending real email.
jest.mock("../config/email", () => ({
    sendEmail: jest.fn().mockResolvedValue(undefined),
}));

import { AuthService } from "../services/auth.service";
import { sendEmail } from "../config/email";

const bcryptHash = bcryptjs.hash as jest.Mock;
const bcryptCompare = bcryptjs.compare as jest.Mock;
const jwtSign = jwt.sign as unknown as jest.Mock;
const jwtVerify = jwt.verify as unknown as jest.Mock;

describe("AuthService", () => {
    let service: AuthService;

    beforeEach(() => {
        service = new AuthService();
    });

    describe("registerUser", () => {
        const input = {
            fullName: "Test User",
            email: "test@example.com",
            password: "secret123",
            confirmPassword: "secret123",
            phoneNumber: "9800000000",
        } as any;

        it("hashes the password and creates the user when email/phone are free", async () => {
            mockRepo.getUserByEmail.mockResolvedValue(null);
            mockRepo.getUserByPhoneNumber.mockResolvedValue(null);
            bcryptHash.mockResolvedValue("hashed_pw");
            mockRepo.createUser.mockResolvedValue({ _id: "1", ...input, password: "hashed_pw" });

            const result = await service.registerUser(input);

            expect(bcryptHash).toHaveBeenCalledWith("secret123", 10);
            expect(mockRepo.createUser).toHaveBeenCalledWith({ ...input, password: "hashed_pw" });
            expect(result).toMatchObject({ _id: "1", email: input.email });
        });

        it("rejects a duplicate email with 403", async () => {
            mockRepo.getUserByEmail.mockResolvedValue({ _id: "existing" });

            await expect(service.registerUser(input)).rejects.toMatchObject({
                statusCode: 403,
                message: "Email is already in use",
            });
            expect(mockRepo.createUser).not.toHaveBeenCalled();
        });

        it("rejects a duplicate phone number with 403", async () => {
            mockRepo.getUserByEmail.mockResolvedValue(null);
            mockRepo.getUserByPhoneNumber.mockResolvedValue({ _id: "existing" });

            await expect(service.registerUser(input)).rejects.toMatchObject({
                statusCode: 403,
                message: "Phone number is already in use",
            });
        });
    });

    describe("loginUser", () => {
        const creds = { email: "test@example.com", password: "secret123" };

        it("returns a token and user for valid credentials", async () => {
            mockRepo.getUserByEmail.mockResolvedValue({ _id: "1", email: creds.email, password: "hashed" });
            bcryptCompare.mockResolvedValue(true);

            const result = await service.loginUser(creds);

            expect(bcryptCompare).toHaveBeenCalledWith("secret123", "hashed");
            expect(jwtSign).toHaveBeenCalled();
            expect(result.token).toBe("signed.jwt.token");
            expect(result.user).toMatchObject({ _id: "1" });
        });

        it("throws 404 when the user does not exist", async () => {
            mockRepo.getUserByEmail.mockResolvedValue(null);

            await expect(service.loginUser(creds)).rejects.toMatchObject({
                statusCode: 404,
                message: "User not found",
            });
        });

        it("throws 401 and steers Google-only accounts to Google sign-in", async () => {
            mockRepo.getUserByEmail.mockResolvedValue({ _id: "1", email: creds.email, password: undefined });

            await expect(service.loginUser(creds)).rejects.toMatchObject({
                statusCode: 401,
                message: "This account uses Google sign-in. Please continue with Google.",
            });
        });

        it("throws 401 for an invalid password", async () => {
            mockRepo.getUserByEmail.mockResolvedValue({ _id: "1", email: creds.email, password: "hashed" });
            bcryptCompare.mockResolvedValue(false);

            await expect(service.loginUser(creds)).rejects.toMatchObject({
                statusCode: 401,
                message: "Invalid credentials",
            });
        });
    });

    describe("loginWithGoogle", () => {
        const identity: GoogleIdentity = {
            googleId: "g-123",
            email: "g@example.com",
            emailVerified: true,
            name: "Google User",
        };

        it("logs in a returning Google user matched by googleId", async () => {
            mockRepo.getUserByGoogleId.mockResolvedValue({ _id: "1", email: identity.email });

            const result = await service.loginWithGoogle(identity);

            expect(result.created).toBe(false);
            expect(result.token).toBe("signed.jwt.token");
            expect(mockRepo.getUserByEmail).not.toHaveBeenCalled();
        });

        it("links Google to an existing verified email account", async () => {
            mockRepo.getUserByGoogleId.mockResolvedValue(null);
            mockRepo.getUserByEmail.mockResolvedValue({ _id: "1", email: identity.email });
            mockRepo.linkGoogleId.mockResolvedValue({ _id: "1", email: identity.email, googleId: identity.googleId });

            const result = await service.loginWithGoogle(identity);

            expect(mockRepo.linkGoogleId).toHaveBeenCalledWith("1", "g-123");
            expect(result.created).toBe(false);
        });

        it("refuses to link when Google has not verified the email", async () => {
            mockRepo.getUserByGoogleId.mockResolvedValue(null);
            mockRepo.getUserByEmail.mockResolvedValue({ _id: "1", email: identity.email });

            await expect(
                service.loginWithGoogle({ ...identity, emailVerified: false })
            ).rejects.toBeInstanceOf(HttpError);
            expect(mockRepo.linkGoogleId).not.toHaveBeenCalled();
        });

        it("creates a passwordless account for a brand-new verified Google user", async () => {
            mockRepo.getUserByGoogleId.mockResolvedValue(null);
            mockRepo.getUserByEmail.mockResolvedValue(null);
            mockRepo.createUser.mockResolvedValue({ _id: "new", email: identity.email });

            const result = await service.loginWithGoogle(identity);

            expect(mockRepo.createUser).toHaveBeenCalledWith({
                fullName: identity.name,
                email: identity.email,
                googleId: identity.googleId,
            });
            expect(result.created).toBe(true);
        });
    });

    describe("sendResetPasswordEmail", () => {
        it("throws 400 when email is missing", async () => {
            await expect(service.sendResetPasswordEmail(undefined)).rejects.toMatchObject({
                statusCode: 400,
            });
        });

        it("throws 404 when no account matches the email", async () => {
            mockRepo.getUserByEmail.mockResolvedValue(null);

            await expect(service.sendResetPasswordEmail("nobody@example.com")).rejects.toMatchObject({
                statusCode: 404,
            });
        });

        it("signs a reset token and sends an email for a known user", async () => {
            mockRepo.getUserByEmail.mockResolvedValue({ _id: "1", email: "test@example.com", fullName: "Test User" });

            await service.sendResetPasswordEmail("test@example.com");

            expect(jwtSign).toHaveBeenCalledWith({ id: "1" }, expect.any(String), { expiresIn: "1h" });
            expect(sendEmail).toHaveBeenCalledWith(
                "test@example.com",
                "Reset your RentEase password",
                expect.stringContaining("Reset Password")
            );
        });
    });

    describe("resetPassword", () => {
        it("throws 400 when token or password is missing", async () => {
            await expect(service.resetPassword(undefined, "newpass")).rejects.toMatchObject({ statusCode: 400 });
            await expect(service.resetPassword("token", undefined)).rejects.toMatchObject({ statusCode: 400 });
        });

        it("updates the password for a valid token", async () => {
            jwtVerify.mockReturnValue({ id: "1" });
            mockRepo.getUserById.mockResolvedValue({ _id: "1" });
            bcryptHash.mockResolvedValue("hashed_new");

            await service.resetPassword("valid.token", "newpass123");

            expect(mockRepo.updateOneUser).toHaveBeenCalledWith("1", { password: "hashed_new" });
        });

        it("throws 400 for an invalid/expired token", async () => {
            jwtVerify.mockImplementation(() => {
                throw new Error("jwt expired");
            });

            await expect(service.resetPassword("bad.token", "newpass123")).rejects.toMatchObject({
                statusCode: 400,
                message: "Invalid or expired token",
            });
        });
    });
});
