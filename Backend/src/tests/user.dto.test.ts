import { CreateUserDto, LoginUserDto } from "../dtos/user.dto";

describe("CreateUserDto", () => {
    const valid = {
        fullName: "Test User",
        email: "test@example.com",
        password: "secret123",
        confirmPassword: "secret123",
        phoneNumber: "9800000000",
    };

    it("accepts a well-formed registration payload", () => {
        const result = CreateUserDto.safeParse(valid);
        expect(result.success).toBe(true);
    });

    it("rejects mismatched passwords", () => {
        const result = CreateUserDto.safeParse({ ...valid, confirmPassword: "different" });
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues.some((i) => i.message === "Passwords do not match")).toBe(true);
        }
    });

    it("rejects an invalid email", () => {
        const result = CreateUserDto.safeParse({ ...valid, email: "not-an-email" });
        expect(result.success).toBe(false);
    });

    it("rejects a phone number that is not 10 digits", () => {
        const result = CreateUserDto.safeParse({ ...valid, phoneNumber: "123" });
        expect(result.success).toBe(false);
    });

    it("rejects a password shorter than 6 characters", () => {
        const result = CreateUserDto.safeParse({ ...valid, password: "abc", confirmPassword: "abc" });
        expect(result.success).toBe(false);
    });
});

describe("LoginUserDto", () => {
    it("accepts valid credentials", () => {
        expect(LoginUserDto.safeParse({ email: "a@b.com", password: "secret123" }).success).toBe(true);
    });

    it("rejects a missing password", () => {
        expect(LoginUserDto.safeParse({ email: "a@b.com" }).success).toBe(false);
    });
});
