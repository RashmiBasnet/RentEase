import request from "supertest";

// Mock the persistence + side-effecting modules so these route tests exercise the
// real controller -> service -> DTO stack without a database, email server, or Google.
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

jest.mock("../config/email", () => ({
    sendEmail: jest.fn().mockResolvedValue(undefined),
}));

import app from "../app";
import { sendEmail } from "../config/email";

describe("Auth routes (integration via supertest)", () => {
    describe("GET /health", () => {
        it("reports the API is running", async () => {
            const res = await request(app).get("/health");
            expect(res.status).toBe(200);
            expect(res.body).toEqual({ success: true, message: "API is running" });
        });
    });

    describe("POST /api/auth/register", () => {
        const payload = {
            fullName: "Test User",
            email: "test@example.com",
            password: "secret123",
            confirmPassword: "secret123",
            phoneNumber: "9800000000",
        };

        it("registers a new user and returns 201", async () => {
            mockRepo.getUserByEmail.mockResolvedValue(null);
            mockRepo.getUserByPhoneNumber.mockResolvedValue(null);
            mockRepo.createUser.mockImplementation(async (data: any) => ({ _id: "1", ...data }));

            const res = await request(app).post("/api/auth/register").send(payload);

            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toMatchObject({ email: payload.email });
        });

        it("returns 400 for an invalid payload (mismatched passwords)", async () => {
            const res = await request(app)
                .post("/api/auth/register")
                .send({ ...payload, confirmPassword: "different" });

            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
            expect(mockRepo.createUser).not.toHaveBeenCalled();
        });

        it("returns 403 when the email already exists", async () => {
            mockRepo.getUserByEmail.mockResolvedValue({ _id: "existing" });

            const res = await request(app).post("/api/auth/register").send(payload);

            expect(res.status).toBe(403);
            expect(res.body.message).toBe("Email is already in use");
        });
    });

    describe("POST /api/auth/login", () => {
        it("returns 400 when the body fails validation", async () => {
            const res = await request(app).post("/api/auth/login").send({ email: "not-an-email" });
            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
        });

        it("returns 404 when the user is not found", async () => {
            mockRepo.getUserByEmail.mockResolvedValue(null);

            const res = await request(app)
                .post("/api/auth/login")
                .send({ email: "nobody@example.com", password: "secret123" });

            expect(res.status).toBe(404);
            expect(res.body.message).toBe("User not found");
        });
    });

    describe("POST /api/auth/forgot-password", () => {
        it("always returns a neutral 200 message and sends an email for a known user", async () => {
            mockRepo.getUserByEmail.mockResolvedValue({ _id: "1", email: "test@example.com", fullName: "Test User" });

            const res = await request(app).post("/api/auth/forgot-password").send({ email: "test@example.com" });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(sendEmail).toHaveBeenCalled();
        });
    });
});
