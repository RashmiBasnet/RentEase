import { VehicleRepository } from "../repositories/vehicle.repository";
import { ReviewRepository } from "../repositories/review.repository";
import { IVehicle } from "../models/vehicle.model";
import { HttpError } from "../errors/http-error";
import { CreateVehicleDto, UpdateVehicleDto, VehicleFilterDto } from "../dtos/vehicle.dto";

const vehicleRepository = new VehicleRepository();
const reviewRepository = new ReviewRepository();

export class VehicleService {
    async createVehicle(data: CreateVehicleDto): Promise<IVehicle> {
        const existing = await vehicleRepository
            .getAllVehicles({ page: 1, size: 1, search: data.registrationNumber })
            .then(({ vehicles }) =>
                vehicles.find(
                    (v) =>
                        v.registrationNumber.toLowerCase() ===
                        data.registrationNumber.toLowerCase()
                )
            );

        if (existing) {
            throw new HttpError(409, "A vehicle with this registration number already exists");
        }

        const vehicle = await vehicleRepository.createVehicle(data);
        return vehicle;
    }

    async getAllVehicles(
        filters: VehicleFilterDto & { page: number; size: number }
    ): Promise<{ vehicles: any[]; total: number; page: number; size: number }> {
        const { page, size, ...rest } = filters;
        const { vehicles, total } = await vehicleRepository.getAllVehicles({
            page,
            size,
            ...rest,
        });

        const ratings = await reviewRepository.getRatingsForVehicles(
            vehicles.map((v) => v._id)
        );
        const enriched = vehicles.map((v) => {
            const obj = typeof v.toObject === "function" ? v.toObject() : v;
            const r = ratings.get(String(v._id));
            return { ...obj, rating: r?.avg ?? 0, reviewCount: r?.count ?? 0 };
        });

        return { vehicles: enriched, total, page, size };
    }

    async getVehicleById(id: string): Promise<IVehicle> {
        const vehicle = await vehicleRepository.getVehicleById(id);
        if (!vehicle) {
            throw new HttpError(404, "Vehicle not found");
        }
        return vehicle;
    }

    async updateVehicle(id: string, data: UpdateVehicleDto): Promise<IVehicle> {
        const vehicle = await vehicleRepository.getVehicleById(id);
        if (!vehicle) {
            throw new HttpError(404, "Vehicle not found");
        }
        const updated = await vehicleRepository.updateVehicle(id, data);
        return updated!;
    }

    async deleteVehicle(id: string): Promise<IVehicle> {
        const vehicle = await vehicleRepository.getVehicleById(id);
        if (!vehicle) {
            throw new HttpError(404, "Vehicle not found");
        }
        const deleted = await vehicleRepository.deleteVehicle(id);
        return deleted!;
    }

    async toggleAvailability(id: string): Promise<IVehicle> {
        const vehicle = await vehicleRepository.getVehicleById(id);
        if (!vehicle) {
            throw new HttpError(404, "Vehicle not found");
        }
        const updated = await vehicleRepository.updateVehicle(id, {
            isAvailable: !vehicle.isAvailable,
        });
        return updated!;
    }

    async toggleVerification(id: string): Promise<IVehicle> {
        const vehicle = await vehicleRepository.getVehicleById(id);
        if (!vehicle) {
            throw new HttpError(404, "Vehicle not found");
        }
        const updated = await vehicleRepository.updateVehicle(id, {
            isVerified: !vehicle.isVerified,
        });
        return updated!;
    }

    async getVehiclesNear(
        lng: number,
        lat: number,
        maxDistanceKm: number = 10
    ): Promise<IVehicle[]> {
        return vehicleRepository.getVehiclesNear(lng, lat, maxDistanceKm);
    }
}
