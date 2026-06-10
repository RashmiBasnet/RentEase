import { Request, Response } from "express";
import { VehicleService } from "../services/vehicle.service";
import { CreateVehicleDto, UpdateVehicleDto, VehicleFilterDto } from "../dtos/vehicle.dto";

const vehicleService = new VehicleService();

type ControllerError = Error & { statusCode?: number };

const getFirstZodMessage = (error: { issues: { message: string }[] }) =>
    error.issues[0]?.message || "Invalid request data";

export class VehicleController {
    async createVehicle(req: Request, res: Response) {
        try {
            const parsedData = CreateVehicleDto.safeParse(req.body);
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
            const parsedData = UpdateVehicleDto.safeParse(req.body);
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
