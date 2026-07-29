const mockVehicleRepo = {
    getAllVehicles: jest.fn(),
    createVehicle: jest.fn(),
    getVehicleById: jest.fn(),
    updateVehicle: jest.fn(),
    deleteVehicle: jest.fn(),
    getVehiclesNear: jest.fn(),
};

const mockReviewRepo = {
    getRatingsForVehicles: jest.fn(),
};

jest.mock("../repositories/vehicle.repository", () => ({
    VehicleRepository: jest.fn(() => mockVehicleRepo),
}));
jest.mock("../repositories/review.repository", () => ({
    ReviewRepository: jest.fn(() => mockReviewRepo),
}));

import { VehicleService } from "../services/vehicle.service";

describe("VehicleService", () => {
    let service: VehicleService;
    beforeEach(() => {
        service = new VehicleService();
    });

    describe("createVehicle", () => {
        const data = { registrationNumber: "BA-1-CHA-1234", title: "Car" } as any;

        it("creates a vehicle when the registration number is unique", async () => {
            mockVehicleRepo.getAllVehicles.mockResolvedValue({ vehicles: [], total: 0 });
            mockVehicleRepo.createVehicle.mockResolvedValue({ _id: "1", ...data });

            const result = await service.createVehicle(data);

            expect(mockVehicleRepo.createVehicle).toHaveBeenCalledWith(data);
            expect(result).toMatchObject({ _id: "1" });
        });

        it("throws 409 on a duplicate registration number (case-insensitive)", async () => {
            mockVehicleRepo.getAllVehicles.mockResolvedValue({
                vehicles: [{ registrationNumber: "ba-1-cha-1234" }],
                total: 1,
            });

            await expect(service.createVehicle(data)).rejects.toMatchObject({ statusCode: 409 });
            expect(mockVehicleRepo.createVehicle).not.toHaveBeenCalled();
        });
    });

    describe("getAllVehicles", () => {
        it("enriches each vehicle with its rating and review count", async () => {
            mockVehicleRepo.getAllVehicles.mockResolvedValue({
                vehicles: [
                    { _id: "v1", toObject: () => ({ _id: "v1", title: "A" }) },
                    { _id: "v2", toObject: () => ({ _id: "v2", title: "B" }) },
                ],
                total: 2,
            });
            mockReviewRepo.getRatingsForVehicles.mockResolvedValue(
                new Map([["v1", { avg: 4.5, count: 3 }]])
            );

            const result = await service.getAllVehicles({ page: 1, size: 10 } as any);

            expect(result.total).toBe(2);
            expect(result.vehicles[0]).toMatchObject({ _id: "v1", rating: 4.5, reviewCount: 3 });
            // v2 has no ratings -> defaults to 0
            expect(result.vehicles[1]).toMatchObject({ _id: "v2", rating: 0, reviewCount: 0 });
        });
    });

    describe("getVehicleById", () => {
        it("returns the vehicle when found", async () => {
            mockVehicleRepo.getVehicleById.mockResolvedValue({ _id: "1" });
            await expect(service.getVehicleById("1")).resolves.toMatchObject({ _id: "1" });
        });
        it("throws 404 when not found", async () => {
            mockVehicleRepo.getVehicleById.mockResolvedValue(null);
            await expect(service.getVehicleById("1")).rejects.toMatchObject({ statusCode: 404 });
        });
    });

    describe("updateVehicle / deleteVehicle", () => {
        it("updateVehicle throws 404 for a missing vehicle", async () => {
            mockVehicleRepo.getVehicleById.mockResolvedValue(null);
            await expect(service.updateVehicle("1", {} as any)).rejects.toMatchObject({ statusCode: 404 });
        });
        it("deleteVehicle returns the deleted vehicle", async () => {
            mockVehicleRepo.getVehicleById.mockResolvedValue({ _id: "1" });
            mockVehicleRepo.deleteVehicle.mockResolvedValue({ _id: "1" });
            await expect(service.deleteVehicle("1")).resolves.toMatchObject({ _id: "1" });
        });
    });

    describe("toggleAvailability / toggleVerification", () => {
        it("flips isAvailable", async () => {
            mockVehicleRepo.getVehicleById.mockResolvedValue({ _id: "1", isAvailable: true });
            mockVehicleRepo.updateVehicle.mockResolvedValue({ _id: "1", isAvailable: false });

            await service.toggleAvailability("1");

            expect(mockVehicleRepo.updateVehicle).toHaveBeenCalledWith("1", { isAvailable: false });
        });

        it("flips isVerified", async () => {
            mockVehicleRepo.getVehicleById.mockResolvedValue({ _id: "1", isVerified: false });
            mockVehicleRepo.updateVehicle.mockResolvedValue({ _id: "1", isVerified: true });

            await service.toggleVerification("1");

            expect(mockVehicleRepo.updateVehicle).toHaveBeenCalledWith("1", { isVerified: true });
        });

        it("toggleAvailability throws 404 for a missing vehicle", async () => {
            mockVehicleRepo.getVehicleById.mockResolvedValue(null);
            await expect(service.toggleAvailability("1")).rejects.toMatchObject({ statusCode: 404 });
        });
    });

    describe("getVehiclesNear", () => {
        it("delegates to the repository with a default radius", async () => {
            mockVehicleRepo.getVehiclesNear.mockResolvedValue([{ _id: "1" }]);
            await service.getVehiclesNear(85, 27);
            expect(mockVehicleRepo.getVehiclesNear).toHaveBeenCalledWith(85, 27, 10);
        });
    });
});
