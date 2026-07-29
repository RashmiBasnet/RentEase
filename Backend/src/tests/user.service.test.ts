const mockRepo = {
    getUserById: jest.fn(),
    getAllUsers: jest.fn(),
    getUserByEmail: jest.fn(),
    getUserByPhoneNumber: jest.fn(),
    updateOneUser: jest.fn(),
    updateUserLocation: jest.fn(),
    uploadProfilePicture: jest.fn(),
    deleteOneUser: jest.fn(),
};

jest.mock("../repositories/user.repository", () => ({
    UserRepository: jest.fn(() => mockRepo),
}));

jest.mock("bcryptjs", () => ({ hash: jest.fn() }));

jest.mock("fs", () => ({
    existsSync: jest.fn(),
    promises: { unlink: jest.fn().mockResolvedValue(undefined) },
}));

import bcryptjs from "bcryptjs";
import fs from "fs";
import { UserService } from "../services/user.service";

const bcryptHash = bcryptjs.hash as jest.Mock;

describe("UserService", () => {
    let service: UserService;
    beforeEach(() => {
        service = new UserService();
    });

    describe("getUserById", () => {
        it("returns the user when found", async () => {
            mockRepo.getUserById.mockResolvedValue({ _id: "1" });
            await expect(service.getUserById("1")).resolves.toMatchObject({ _id: "1" });
        });
        it("throws 404 when not found", async () => {
            mockRepo.getUserById.mockResolvedValue(null);
            await expect(service.getUserById("1")).rejects.toMatchObject({ statusCode: 404 });
        });
    });

    describe("updateUser", () => {
        const existing = { _id: "1", email: "old@example.com", phoneNumber: "9800000000" };

        it("throws 404 when the user does not exist", async () => {
            mockRepo.getUserById.mockResolvedValue(null);
            await expect(service.updateUser("1", { fullName: "New" })).rejects.toMatchObject({ statusCode: 404 });
        });

        it("throws 403 when the new email is taken by someone else", async () => {
            mockRepo.getUserById.mockResolvedValue(existing);
            mockRepo.getUserByEmail.mockResolvedValue({ _id: "2" });
            await expect(service.updateUser("1", { email: "taken@example.com" })).rejects.toMatchObject({
                statusCode: 403,
                message: "Email already in use",
            });
        });

        it("throws 403 when the new phone number is taken", async () => {
            mockRepo.getUserById.mockResolvedValue(existing);
            mockRepo.getUserByPhoneNumber.mockResolvedValue({ _id: "2" });
            await expect(service.updateUser("1", { phoneNumber: "9811111111" })).rejects.toMatchObject({
                statusCode: 403,
                message: "Phone number already in use",
            });
        });

        it("hashes a new password before saving", async () => {
            mockRepo.getUserById.mockResolvedValue(existing);
            bcryptHash.mockResolvedValue("hashed");
            mockRepo.updateOneUser.mockResolvedValue({ _id: "1" });

            await service.updateUser("1", { password: "newpass123" });

            expect(bcryptHash).toHaveBeenCalledWith("newpass123", 10);
            expect(mockRepo.updateOneUser).toHaveBeenCalledWith("1", { password: "hashed" });
        });

        it("updates without a duplicate check when email is unchanged", async () => {
            mockRepo.getUserById.mockResolvedValue(existing);
            mockRepo.updateOneUser.mockResolvedValue({ _id: "1", fullName: "New Name" });

            await service.updateUser("1", { fullName: "New Name" });

            expect(mockRepo.getUserByEmail).not.toHaveBeenCalled();
            expect(mockRepo.updateOneUser).toHaveBeenCalled();
        });
    });

    describe("updateUserLocation", () => {
        it("returns the updated user", async () => {
            mockRepo.updateUserLocation.mockResolvedValue({ _id: "1" });
            await expect(service.updateUserLocation("1", 85, 27)).resolves.toMatchObject({ _id: "1" });
        });
        it("throws 404 when the user is missing", async () => {
            mockRepo.updateUserLocation.mockResolvedValue(null);
            await expect(service.updateUserLocation("1", 85, 27)).rejects.toMatchObject({ statusCode: 404 });
        });
    });

    describe("uploadProfilePicture", () => {
        it("throws 400 when no file is provided", async () => {
            await expect(service.uploadProfilePicture("1", undefined)).rejects.toMatchObject({ statusCode: 400 });
        });

        it("throws 404 when the user does not exist", async () => {
            mockRepo.getUserById.mockResolvedValue(null);
            await expect(service.uploadProfilePicture("1", { filename: "a.png" })).rejects.toMatchObject({
                statusCode: 404,
            });
        });

        it("saves the new filename for a user with no existing picture", async () => {
            mockRepo.getUserById.mockResolvedValue({ _id: "1", profilePicture: undefined });
            mockRepo.uploadProfilePicture.mockResolvedValue({ _id: "1", profilePicture: "new.png" });

            await service.uploadProfilePicture("1", { filename: "new.png" });

            expect(fs.promises.unlink).not.toHaveBeenCalled();
            expect(mockRepo.uploadProfilePicture).toHaveBeenCalledWith("1", "new.png");
        });

        it("deletes the old picture file when one exists", async () => {
            mockRepo.getUserById.mockResolvedValue({ _id: "1", profilePicture: "old.png" });
            (fs.existsSync as jest.Mock).mockReturnValue(true);
            mockRepo.uploadProfilePicture.mockResolvedValue({ _id: "1", profilePicture: "new.png" });

            await service.uploadProfilePicture("1", { filename: "new.png" });

            expect(fs.promises.unlink).toHaveBeenCalled();
        });
    });

    describe("deleteUser", () => {
        it("returns truthy on success", async () => {
            mockRepo.deleteOneUser.mockResolvedValue(true);
            await expect(service.deleteUser("1")).resolves.toBe(true);
        });
        it("throws 404 when nothing was deleted", async () => {
            mockRepo.deleteOneUser.mockResolvedValue(null);
            await expect(service.deleteUser("1")).rejects.toMatchObject({ statusCode: 404 });
        });
    });
});
