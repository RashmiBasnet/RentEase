import bcryptjs from "bcryptjs";
import mongoose, { Types } from "mongoose";
import { connectDatabase } from "./mongoose";
import { BookingModel } from "../models/booking.model";
import { ReportModel } from "../models/report.model";
import { ReviewModel } from "../models/review.model";
import { IUser, UserModel } from "../models/user.model";
import { IVehicle, VehicleModel } from "../models/vehicle.model";

const password = "Password123";

const users = [
    {
        fullName: "RentEase Admin",
        email: "admin@rentease.com",
        phoneNumber: "9800000001",
        role: "admin",
        isVerified: true,
        profilePicture: "https://i.pravatar.cc/240?img=12",
        location: { type: "Point", coordinates: [85.324, 27.7172] },
    },
    {
        fullName: "Aarav Sharma",
        email: "aarav@rentease.com",
        phoneNumber: "9800000002",
        role: "user",
        isVerified: true,
        profilePicture: "https://i.pravatar.cc/240?img=32",
        location: { type: "Point", coordinates: [85.3188, 27.7044] },
    },
    {
        fullName: "Maya Gurung",
        email: "maya@rentease.com",
        phoneNumber: "9800000003",
        role: "user",
        isVerified: true,
        profilePicture: "https://i.pravatar.cc/240?img=44",
        location: { type: "Point", coordinates: [85.338, 27.671] },
    },
    {
        fullName: "Niraj Karki",
        email: "niraj@rentease.com",
        phoneNumber: "9800000004",
        role: "user",
        isVerified: false,
        profilePicture: "https://i.pravatar.cc/240?img=53",
        location: { type: "Point", coordinates: [85.3001, 27.7089] },
    },
] as const;

const vehicles = [
    {
        title: "Toyota Corolla Hybrid",
        description: "Comfortable automatic sedan for city rides and longer trips.",
        type: "car",
        brand: "Toyota",
        vehicleModel: "Corolla Hybrid",
        year: 2022,
        registrationNumber: "BA-21-PA-1001",
        fuelType: "hybrid",
        transmission: "automatic",
        seats: 5,
        pricePerDay: 5200,
        deposit: 12000,
        images: [
            "https://images.unsplash.com/photo-1623869675781-80aa31012a5a?auto=format&fit=crop&w=1200&q=80",
        ],
        pickupAddress: "Lazimpat, Kathmandu",
        location: { type: "Point", coordinates: [85.322, 27.721] },
        features: ["AC", "Bluetooth", "Rear camera", "Fuel efficient"],
        isVerified: true,
        isAvailable: true,
        conditionRating: 5,
        conditionNotes: "Recently serviced with new tires.",
        insurance: {
            included: true,
            details: "Comprehensive insurance with standard excess.",
        },
    },
    {
        title: "Hyundai Creta SUV",
        description: "Spacious SUV with high ground clearance for family travel.",
        type: "suv",
        brand: "Hyundai",
        vehicleModel: "Creta",
        year: 2021,
        registrationNumber: "BA-18-CHA-2323",
        fuelType: "petrol",
        transmission: "manual",
        seats: 5,
        pricePerDay: 6500,
        deposit: 15000,
        images: [
            "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1200&q=80",
        ],
        pickupAddress: "Pulchowk, Lalitpur",
        location: { type: "Point", coordinates: [85.3182, 27.6788] },
        features: ["AC", "ABS", "Roof rails", "Large boot"],
        isVerified: true,
        isAvailable: true,
        conditionRating: 4,
        conditionNotes: "Minor cosmetic scratches on rear bumper.",
        insurance: {
            included: true,
            details: "Third-party plus accidental damage cover.",
        },
    },
    {
        title: "Honda Dio Scooter",
        description: "Lightweight scooter ideal for quick errands around town.",
        type: "scooter",
        brand: "Honda",
        vehicleModel: "Dio",
        year: 2023,
        registrationNumber: "BA-95-PA-4421",
        fuelType: "petrol",
        transmission: "automatic",
        seats: 2,
        pricePerDay: 1300,
        deposit: 4000,
        images: [
            "https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?auto=format&fit=crop&w=1200&q=80",
        ],
        pickupAddress: "Baneshwor, Kathmandu",
        location: { type: "Point", coordinates: [85.345, 27.689] },
        features: ["Helmet included", "Mobile holder", "Under-seat storage"],
        isVerified: true,
        isAvailable: true,
        conditionRating: 5,
        conditionNotes: "Almost new, excellent mileage.",
        insurance: {
            included: false,
            details: "Renter is responsible for incident costs.",
        },
    },
    {
        title: "Royal Enfield Classic 350",
        description: "Classic touring bike suited for scenic day rides.",
        type: "bike",
        brand: "Royal Enfield",
        vehicleModel: "Classic 350",
        year: 2020,
        registrationNumber: "BA-80-PA-7710",
        fuelType: "petrol",
        transmission: "manual",
        seats: 2,
        pricePerDay: 2800,
        deposit: 7000,
        images: [
            "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=80",
        ],
        pickupAddress: "Thamel, Kathmandu",
        location: { type: "Point", coordinates: [85.3109, 27.7154] },
        features: ["Helmet included", "Touring seat", "Phone mount"],
        isVerified: true,
        isAvailable: false,
        conditionRating: 4,
        conditionNotes: "Good condition, clutch recently adjusted.",
        insurance: {
            included: true,
            details: "Basic accident coverage included.",
        },
    },
    {
        title: "Nissan Urvan Passenger Van",
        description: "Large van for group tours, airport runs, and events.",
        type: "van",
        brand: "Nissan",
        vehicleModel: "Urvan",
        year: 2019,
        registrationNumber: "BA-15-CHA-9002",
        fuelType: "diesel",
        transmission: "manual",
        seats: 12,
        pricePerDay: 9800,
        deposit: 22000,
        images: [
            "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80",
        ],
        pickupAddress: "Koteshwor, Kathmandu",
        location: { type: "Point", coordinates: [85.3497, 27.678] },
        features: ["AC", "Luggage space", "Driver available on request"],
        isVerified: false,
        isAvailable: true,
        conditionRating: 3,
        conditionNotes: "Interior is clean; exterior paint has visible wear.",
        insurance: {
            included: true,
            details: "Commercial passenger insurance active.",
        },
    },
] as const;

type SeedContext = {
    usersByEmail: Map<string, IUser>;
    vehiclesByRegistration: Map<string, IVehicle>;
};

function daysFromNow(days: number) {
    const date = new Date();
    date.setUTCHours(9, 0, 0, 0);
    date.setUTCDate(date.getUTCDate() + days);
    return date;
}

async function seedUsers() {
    const hashedPassword = await bcryptjs.hash(password, 10);
    const usersByEmail = new Map<string, IUser>();

    for (const user of users) {
        const saved = await UserModel.findOneAndUpdate(
            { email: user.email },
            { $set: { ...user, password: hashedPassword } },
            { returnDocument: "after", setDefaultsOnInsert: true, upsert: true }
        );
        usersByEmail.set(user.email, requireSeedDoc(saved, user.email));
    }

    console.log(`Seeded users: ${users.length}`);
    return usersByEmail;
}

async function seedVehicles() {
    const vehiclesByRegistration = new Map<string, IVehicle>();

    for (const vehicle of vehicles) {
        const saved = await VehicleModel.findOneAndUpdate(
            { registrationNumber: vehicle.registrationNumber },
            { $set: vehicle },
            { returnDocument: "after", setDefaultsOnInsert: true, upsert: true }
        );
        vehiclesByRegistration.set(
            vehicle.registrationNumber,
            requireSeedDoc(saved, vehicle.registrationNumber)
        );
    }

    console.log(`Seeded vehicles: ${vehicles.length}`);
    return vehiclesByRegistration;
}

function requireSeedDoc<T extends { _id: Types.ObjectId } | null>(
    doc: T,
    label: string
): Exclude<T, null> {
    if (!doc) {
        throw new Error(`Seed dependency missing: ${label}`);
    }
    return doc as Exclude<T, null>;
}

async function seedBookings({ usersByEmail, vehiclesByRegistration }: SeedContext) {
    const bookingInputs = [
        {
            userEmail: "aarav@rentease.com",
            registrationNumber: "BA-21-PA-1001",
            startDate: daysFromNow(2),
            endDate: daysFromNow(5),
            status: "pending",
            paymentStatus: "pending",
            paymentMethod: "cash",
            notes: "Needs pickup early in the morning.",
        },
        {
            userEmail: "maya@rentease.com",
            registrationNumber: "BA-18-CHA-2323",
            startDate: daysFromNow(7),
            endDate: daysFromNow(10),
            status: "confirmed",
            paymentStatus: "paid",
            paymentMethod: "esewa",
            notes: "Family trip to Pokhara.",
        },
        {
            userEmail: "niraj@rentease.com",
            registrationNumber: "BA-80-PA-7710",
            startDate: daysFromNow(-5),
            endDate: daysFromNow(-2),
            status: "completed",
            paymentStatus: "paid",
            paymentMethod: "khalti",
            notes: "Completed ride for review flow.",
        },
        {
            userEmail: "aarav@rentease.com",
            registrationNumber: "BA-95-PA-4421",
            startDate: daysFromNow(12),
            endDate: daysFromNow(14),
            status: "cancelled",
            paymentStatus: "refunded",
            paymentMethod: "card",
            notes: "Cancelled by customer.",
        },
    ] as const;

    const bookings = [];

    for (const input of bookingInputs) {
        const user = requireSeedDoc(usersByEmail.get(input.userEmail) ?? null, input.userEmail);
        const vehicle = requireSeedDoc(
            vehiclesByRegistration.get(input.registrationNumber) ?? null,
            input.registrationNumber
        );
        const totalDays = Math.ceil(
            (input.endDate.getTime() - input.startDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        const totalAmount = totalDays * vehicle.pricePerDay;

        const saved = await BookingModel.findOneAndUpdate(
            {
                userId: user._id,
                vehicleId: vehicle._id,
                startDate: input.startDate,
                endDate: input.endDate,
            },
            {
                $set: {
                    userId: user._id,
                    vehicleId: vehicle._id,
                    startDate: input.startDate,
                    endDate: input.endDate,
                    totalDays,
                    pickupAddress: vehicle.pickupAddress,
                    basePrice: vehicle.pricePerDay,
                    depositAmount: vehicle.deposit ?? 0,
                    insuranceCost: vehicle.insurance?.included ? 0 : 500,
                    extraCharges: [],
                    totalAmount,
                    status: input.status,
                    paymentStatus: input.paymentStatus,
                    paymentMethod: input.paymentMethod,
                    notes: input.notes,
                },
            },
            { returnDocument: "after", setDefaultsOnInsert: true, upsert: true }
        );
        bookings.push(saved);
    }

    console.log(`Seeded bookings: ${bookings.length}`);
    return bookings;
}

async function seedReviews(bookings: Awaited<ReturnType<typeof seedBookings>>) {
    const completedBooking = requireSeedDoc(
        bookings.find((booking) => booking?.status === "completed") ?? null,
        "completed booking"
    );

    await ReviewModel.findOneAndUpdate(
        { userId: completedBooking.userId, bookingId: completedBooking._id },
        {
            $set: {
                userId: completedBooking.userId,
                vehicleId: completedBooking.vehicleId,
                bookingId: completedBooking._id,
                rating: 5,
                comment: "Smooth pickup, reliable bike, and helpful owner.",
                images: [
                    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
                ],
            },
        },
        { returnDocument: "after", setDefaultsOnInsert: true, upsert: true }
    );

    console.log("Seeded reviews: 1");
}

async function seedReports({ usersByEmail, vehiclesByRegistration }: SeedContext) {
    const reportInputs = [
        {
            userEmail: "maya@rentease.com",
            registrationNumber: "BA-15-CHA-9002",
            reason: "poor_condition",
            description: "The listing should mention the exterior paint wear more clearly.",
            status: "pending",
        },
        {
            userEmail: "aarav@rentease.com",
            registrationNumber: "BA-80-PA-7710",
            reason: "misleading_info",
            description: "Availability did not match the listing when I checked.",
            status: "reviewed",
        },
    ] as const;

    for (const input of reportInputs) {
        const user = requireSeedDoc(usersByEmail.get(input.userEmail) ?? null, input.userEmail);
        const vehicle = requireSeedDoc(
            vehiclesByRegistration.get(input.registrationNumber) ?? null,
            input.registrationNumber
        );

        await ReportModel.findOneAndUpdate(
            { reportedBy: user._id, vehicleId: vehicle._id },
            {
                $set: {
                    reportedBy: user._id,
                    vehicleId: vehicle._id,
                    reason: input.reason,
                    description: input.description,
                    status: input.status,
                },
            },
            { returnDocument: "after", setDefaultsOnInsert: true, upsert: true }
        );
    }

    console.log(`Seeded reports: ${reportInputs.length}`);
}

async function seed() {
    await connectDatabase(undefined, { exitOnError: false });

    const usersByEmail = await seedUsers();
    const vehiclesByRegistration = await seedVehicles();
    const context = { usersByEmail, vehiclesByRegistration };
    const bookings = await seedBookings(context);
    await seedReviews(bookings);
    await seedReports(context);

    console.log("");
    console.log("Seed complete.");
    console.log(`Login as admin: admin@rentease.com / ${password}`);
    console.log(`Login as user: aarav@rentease.com / ${password}`);
}

seed()
    .catch((error) => {
        console.error("Seed failed:", error);
        process.exitCode = 1;
    })
    .finally(async () => {
        await mongoose.disconnect();
    });
