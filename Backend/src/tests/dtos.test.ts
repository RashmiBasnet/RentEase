import { CreateVehicleDto, VehicleFilterDto } from "../dtos/vehicle.dto";
import { CreateBookingDto } from "../dtos/booking.dto";
import { CreateReviewDto } from "../dtos/review.dto";
import { CreateReportDto } from "../dtos/report.dto";
import { InitiateKhaltiPaymentDto, VerifyKhaltiPaymentDto } from "../dtos/payment.dto";
import mongoose from "mongoose";

const oid = () => new mongoose.Types.ObjectId().toString();

describe("CreateVehicleDto", () => {
    const valid = {
        title: "Toyota Corolla",
        description: "A reliable sedan for city trips",
        type: "car",
        brand: "Toyota",
        vehicleModel: "Corolla",
        year: 2020,
        registrationNumber: "BA-1-CHA-1234",
        fuelType: "petrol",
        transmission: "automatic",
        seats: 5,
        pricePerDay: 3000,
        images: ["a.png"],
        pickupAddress: "Kathmandu",
        location: { type: "Point", coordinates: [85.3, 27.7] },
        conditionRating: 4,
    };

    it("accepts a valid vehicle", () => {
        expect(CreateVehicleDto.safeParse(valid).success).toBe(true);
    });

    it("rejects an invalid vehicle type", () => {
        expect(CreateVehicleDto.safeParse({ ...valid, type: "plane" }).success).toBe(false);
    });

    it("rejects a non-positive price", () => {
        expect(CreateVehicleDto.safeParse({ ...valid, pricePerDay: 0 }).success).toBe(false);
    });

    it("requires at least one image", () => {
        expect(CreateVehicleDto.safeParse({ ...valid, images: [] }).success).toBe(false);
    });
});

describe("VehicleFilterDto", () => {
    it("coerces numeric query strings", () => {
        const result = VehicleFilterDto.safeParse({ minPrice: "1000", seats: "4" });
        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data.minPrice).toBe(1000);
            expect(result.data.seats).toBe(4);
        }
    });
});

describe("CreateBookingDto", () => {
    const valid = {
        vehicleId: oid(),
        startDate: "2026-08-01",
        endDate: "2026-08-05",
        pickupAddress: "Kathmandu",
        paymentMethod: "cash",
    };

    it("accepts a valid booking payload and coerces dates", () => {
        const result = CreateBookingDto.safeParse(valid);
        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data.startDate).toBeInstanceOf(Date);
        }
    });

    it("rejects an end date not after the start date", () => {
        expect(CreateBookingDto.safeParse({ ...valid, endDate: "2026-07-01" }).success).toBe(false);
    });
});

describe("CreateReviewDto", () => {
    const valid = { vehicleId: oid(), bookingId: oid(), rating: 5, comment: "Great" };

    it("accepts a valid review", () => {
        expect(CreateReviewDto.safeParse(valid).success).toBe(true);
    });

    it("rejects a rating out of range", () => {
        expect(CreateReviewDto.safeParse({ ...valid, rating: 6 }).success).toBe(false);
    });
});

describe("CreateReportDto", () => {
    it("rejects a missing reason", () => {
        expect(CreateReportDto.safeParse({ vehicleId: oid(), description: "x" }).success).toBe(false);
    });
});

describe("Payment DTOs", () => {
    it("InitiateKhaltiPaymentDto requires a booking id", () => {
        expect(InitiateKhaltiPaymentDto.safeParse({ bookingId: "" }).success).toBe(false);
        expect(InitiateKhaltiPaymentDto.safeParse({ bookingId: "abc" }).success).toBe(true);
    });

    it("VerifyKhaltiPaymentDto requires a pidx", () => {
        expect(VerifyKhaltiPaymentDto.safeParse({ pidx: "" }).success).toBe(false);
        expect(VerifyKhaltiPaymentDto.safeParse({ pidx: "pidx_1" }).success).toBe(true);
    });
});
