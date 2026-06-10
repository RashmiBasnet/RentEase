import { QueryFilter } from "mongoose";
import { IVehicle, VehicleModel } from "../models/vehicle.model";
import { VehicleType } from "../types/vehicle.type";

type VehicleListFilters = {
    page: number;
    size: number;
    search?: string;
    type?: VehicleType["type"];
    fuelType?: VehicleType["fuelType"];
    transmission?: VehicleType["transmission"];
    minPrice?: number;
    maxPrice?: number;
    seats?: number;
    isAvailable?: boolean;
    pickupAddress?: string;
};

export interface IVehicleRepository {
    createVehicle(data: Partial<IVehicle>): Promise<IVehicle>;
    getAllVehicles({
        page,
        size,
        search,
        type,
        fuelType,
        transmission,
        minPrice,
        maxPrice,
        seats,
        isAvailable,
        pickupAddress,
    }: VehicleListFilters): Promise<{ vehicles: IVehicle[]; total: number }>;
    getVehicleById(id: string): Promise<IVehicle | null>;
    updateVehicle(id: string, data: Partial<IVehicle>): Promise<IVehicle | null>;
    deleteVehicle(id: string): Promise<IVehicle | null>;
    getVehiclesNear(lng: number, lat: number, maxDistanceKm: number): Promise<IVehicle[]>;
}

export class VehicleRepository implements IVehicleRepository {
    async createVehicle(data: Partial<IVehicle>): Promise<IVehicle> {
        const vehicle = await VehicleModel.create(data);
        return vehicle;
    }

    async getAllVehicles({
        page,
        size,
        search,
        type,
        fuelType,
        transmission,
        minPrice,
        maxPrice,
        seats,
        isAvailable,
        pickupAddress,
    }: VehicleListFilters): Promise<{ vehicles: IVehicle[]; total: number }> {
        const query: QueryFilter<IVehicle> = {};

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: "i" } },
                { brand: { $regex: search, $options: "i" } },
                { vehicleModel: { $regex: search, $options: "i" } },
                { pickupAddress: { $regex: search, $options: "i" } },
            ];
        }
        if (type) query.type = type;
        if (fuelType) query.fuelType = fuelType;
        if (transmission) query.transmission = transmission;
        if (seats !== undefined) query.seats = seats;
        if (isAvailable !== undefined) query.isAvailable = isAvailable;
        if (pickupAddress) query.pickupAddress = { $regex: pickupAddress, $options: "i" };
        if (minPrice !== undefined || maxPrice !== undefined) {
            query.pricePerDay = {};
            if (minPrice !== undefined) query.pricePerDay.$gte = minPrice;
            if (maxPrice !== undefined) query.pricePerDay.$lte = maxPrice;
        }

        const skip = (page - 1) * size;
        const [vehicles, total] = await Promise.all([
            VehicleModel.find(query).skip(skip).limit(size).sort({ createdAt: -1 }),
            VehicleModel.countDocuments(query),
        ]);

        return { vehicles, total };
    }

    async getVehicleById(id: string): Promise<IVehicle | null> {
        return VehicleModel.findById(id);
    }

    async updateVehicle(id: string, data: Partial<IVehicle>): Promise<IVehicle | null> {
        return VehicleModel.findByIdAndUpdate(id, data, { new: true });
    }

    async deleteVehicle(id: string): Promise<IVehicle | null> {
        return VehicleModel.findByIdAndDelete(id);
    }

    async getVehiclesNear(
        lng: number,
        lat: number,
        maxDistanceKm: number
    ): Promise<IVehicle[]> {
        return VehicleModel.find({
            location: {
                $near: {
                    $geometry: { type: "Point", coordinates: [lng, lat] },
                    $maxDistance: maxDistanceKm * 1000,
                },
            },
            isAvailable: true,
        });
    }
}
