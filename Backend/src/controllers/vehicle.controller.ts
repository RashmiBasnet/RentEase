import { Request, Response } from "express";
import { VehicleService } from "../services/vehicle.service";
import { CreateVehicleDto, UpdateVehicleDto, VehicleFilterDto } from "../dtos/vehicle.dto";

const vehicleService = new VehicleService();

type ControllerError = Error & { statusCode?: number };

const getFirstZodMessage = (error: { issues: { message: string }[] }) =>
    error.issues[0]?.message || "Invalid request data";

const parseJsonField = (value: unknown) => {
    if (typeof value !== "string") return value;
    try {
        return JSON.parse(value);
    } catch {
        return value;
    }
};

const parseStringArray = (value: unknown): string[] => {
    const parsed = parseJsonField(value);
    if (Array.isArray(parsed)) {
        return parsed.map(String).map((item) => item.trim()).filter(Boolean);
    }
    if (typeof parsed === "string") {
        return parsed
            .split(/[\n,]/)
            .map((item) => item.trim())
            .filter(Boolean);
    }
    return [];
};

const parseNumber = (value: unknown) =>
    value === undefined || value === "" ? undefined : Number(value);

const parseVehiclePayload = (req: Request, isUpdate = false) => {
    const body = req.body as Record<string, unknown>;
    const files = Array.isArray(req.files) ? (req.files as Express.Multer.File[]) : [];
    const uploadedImages = files.map((file) => file.filename);
    const bodyImages = parseStringArray(body.images);
    const imageUrls = parseStringArray(body.imageUrls);
    const images = [...bodyImages, ...imageUrls, ...uploadedImages];

    const rawLocation = parseJsonField(body.location);
    const lng = parseNumber(body.lng);
    const lat = parseNumber(body.lat);
    const location =
        rawLocation && typeof rawLocation === "object"
            ? rawLocation
            : lng !== undefined && lat !== undefined
              ? { type: "Point", coordinates: [lng, lat] }
              : undefined;

    const rawInsurance = parseJsonField(body.insurance);
    const insurance =
        rawInsurance && typeof rawInsurance === "object"
            ? rawInsurance
            : undefined;

    const payload: Record<string, unknown> = {
        title: body.title,
        description: body.description,
        type: body.type,
        brand: body.brand,
        vehicleModel: body.vehicleModel,
        year: parseNumber(body.year),
        registrationNumber: body.registrationNumber,
        fuelType: body.fuelType,
        transmission: body.transmission,
        seats: parseNumber(body.seats),
        pricePerDay: parseNumber(body.pricePerDay),
        deposit: parseNumber(body.deposit),
        pickupAddress: body.pickupAddress,
        location,
        conditionRating: parseNumber(body.conditionRating),
        conditionNotes: body.conditionNotes,
        insurance,
    };

    if (body.features !== undefined) {
        payload.features = parseStringArray(body.features);
    }

    if (images.length > 0) {
        payload.images = images;
    }

    Object.keys(payload).forEach((key) => {
        if (payload[key] === undefined || (isUpdate && payload[key] === "")) {
            delete payload[key];
        }
    });

    return payload;
};

export class VehicleController {
    async createVehicle(req: Request, res: Response) {
        try {
            const parsedData = CreateVehicleDto.safeParse(parseVehiclePayload(req));
            if (!parsedData.success) {
                return res.status(400).json({
                    success: false,
                    message: getFirstZodMessage(parsedData.error),
                });
            }
            const vehicle = await vehicleService.createVehicle(parsedData.data);
            return res.status(201).json({
                success: true,
                data: vehicle,
                message: "Vehicle created successfully",
            });
        } catch (error) {
            const controllerError = error as ControllerError;
            return res.status(controllerError.statusCode || 500).json({
                success: false,
                message: controllerError.message || "Internal Server Error",
            });
        }
    }

    async getAllVehicles(req: Request, res: Response) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const size = parseInt(req.query.size as string) || 10;

            const parsedFilters = VehicleFilterDto.safeParse(req.query);
            if (!parsedFilters.success) {
                return res.status(400).json({
                    success: false,
                    message: getFirstZodMessage(parsedFilters.error),
                });
            }

            const result = await vehicleService.getAllVehicles({
                page,
                size,
                ...parsedFilters.data,
            });
            return res.status(200).json({
                success: true,
                data: result,
                message: "Vehicles fetched successfully",
            });
        } catch (error) {
            const controllerError = error as ControllerError;
            return res.status(controllerError.statusCode || 500).json({
                success: false,
                message: controllerError.message || "Internal Server Error",
            });
        }
    }

    async getVehicleById(req: Request, res: Response) {
        try {
            const id = String(req.params.id);
            const vehicle = await vehicleService.getVehicleById(id);
            return res.status(200).json({
                success: true,
                data: vehicle,
                message: "Vehicle fetched successfully",
            });
        } catch (error) {
            const controllerError = error as ControllerError;
            return res.status(controllerError.statusCode || 500).json({
                success: false,
                message: controllerError.message || "Internal Server Error",
            });
        }
    }

    async updateVehicle(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const parsedData = UpdateVehicleDto.safeParse(parseVehiclePayload(req, true));
            if (!parsedData.success) {
                return res.status(400).json({
                    success: false,
                    message: getFirstZodMessage(parsedData.error),
                });
            }
            const vehicle = await vehicleService.updateVehicle(String(id), parsedData.data);
            return res.status(200).json({
                success: true,
                data: vehicle,
                message: "Vehicle updated successfully",
            });
        } catch (error) {
            const controllerError = error as ControllerError;
            return res.status(controllerError.statusCode || 500).json({
                success: false,
                message: controllerError.message || "Internal Server Error",
            });
        }
    }

    async deleteVehicle(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const vehicle = await vehicleService.deleteVehicle(String(id));
            return res.status(200).json({
                success: true,
                data: vehicle,
                message: "Vehicle deleted successfully",
            });
        } catch (error) {
            const controllerError = error as ControllerError;
            return res.status(controllerError.statusCode || 500).json({
                success: false,
                message: controllerError.message || "Internal Server Error",
            });
        }
    }

    async toggleAvailability(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const vehicle = await vehicleService.toggleAvailability(String(id));
            return res.status(200).json({
                success: true,
                data: vehicle,
                message: `Vehicle is now ${vehicle.isAvailable ? "available" : "unavailable"}`,
            });
        } catch (error) {
            const controllerError = error as ControllerError;
            return res.status(controllerError.statusCode || 500).json({
                success: false,
                message: controllerError.message || "Internal Server Error",
            });
        }
    }

    async toggleVerification(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const vehicle = await vehicleService.toggleVerification(String(id));
            return res.status(200).json({
                success: true,
                data: vehicle,
                message: `Vehicle ${vehicle.isVerified ? "verified" : "unverified"} successfully`,
            });
        } catch (error) {
            const controllerError = error as ControllerError;
            return res.status(controllerError.statusCode || 500).json({
                success: false,
                message: controllerError.message || "Internal Server Error",
            });
        }
    }

    async getVehiclesNear(req: Request, res: Response) {
        try {
            const lng = parseFloat(req.query.lng as string);
            const lat = parseFloat(req.query.lat as string);
            const maxDistanceKm = parseFloat(req.query.maxDistanceKm as string) || 10;

            if (isNaN(lng) || isNaN(lat)) {
                return res.status(400).json({
                    success: false,
                    message: "Valid lng and lat query params are required",
                });
            }

            const vehicles = await vehicleService.getVehiclesNear(lng, lat, maxDistanceKm);
            return res.status(200).json({
                success: true,
                data: vehicles,
                message: "Nearby vehicles fetched successfully",
            });
        } catch (error) {
            const controllerError = error as ControllerError;
            return res.status(controllerError.statusCode || 500).json({
                success: false,
                message: controllerError.message || "Internal Server Error",
            });
        }
    }
}
