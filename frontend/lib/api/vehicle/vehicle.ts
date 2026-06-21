import { API } from "../endpoints";
import axios from "../axios";

export type VehicleLocation = {
    type?: "Point";
    coordinates: [number, number]; // [lng, lat]
};

export type CreateVehiclePayload = {
    title: string;
    description: string;
    type: "car" | "bike" | "scooter" | "suv" | "van";
    brand: string;
    vehicleModel: string;
    year: number;
    registrationNumber: string;
    fuelType: "petrol" | "diesel" | "electric" | "hybrid";
    transmission: "manual" | "automatic";
    seats: number;
    pricePerDay: number;
    deposit?: number;
    images: string[];
    pickupAddress: string;
    location: VehicleLocation;
    features?: string[];
    conditionRating: number;
    conditionNotes?: string;
    insurance?: { included: boolean; details?: string };
};

export type UpdateVehiclePayload = Partial<CreateVehiclePayload>;
export type VehicleWritePayload = CreateVehiclePayload | FormData;
type VehicleRequestPayload = CreateVehiclePayload | UpdateVehiclePayload | FormData;

// Reuse the filter/query param shapes defined in endpoints.ts
export type VehicleFilterParams = Parameters<typeof API.VEHICLE.GET_ALL>[0];
export type VehicleNearParams = Parameters<typeof API.VEHICLE.GET_NEAR>[0];

export const getAllVehicles = async (params?: VehicleFilterParams) => {
    try {
        const response = await axios.get(
            API.VEHICLE.GET_ALL(params)
        );
        return response.data;
    } catch (err: Error | any) {
        throw new Error(
            err.response?.data?.message
            || err.message
            || "Failed to fetch vehicles"
        );
    }
}

export const getVehiclesNear = async (params: VehicleNearParams) => {
    try {
        const response = await axios.get(
            API.VEHICLE.GET_NEAR(params)
        );
        return response.data;
    } catch (err: Error | any) {
        throw new Error(
            err.response?.data?.message
            || err.message
            || "Failed to fetch nearby vehicles"
        );
    }
}

export const getVehicleById = async (id: string) => {
    try {
        const response = await axios.get(
            API.VEHICLE.GET_BY_ID(id)
        );
        return response.data;
    } catch (err: Error | any) {
        throw new Error(
            err.response?.data?.message
            || err.message
            || "Failed to fetch vehicle"
        );
    }
}

const multipartHeaders = (data: VehicleRequestPayload) =>
    data instanceof FormData ? { "Content-Type": "multipart/form-data" } : undefined;

export const createVehicle = async (data: VehicleWritePayload) => {
    try {
        const response = await axios.post(
            API.VEHICLE.CREATE,
            data,
            { headers: multipartHeaders(data) }
        );
        return response.data;
    } catch (err: Error | any) {
        throw new Error(
            err.response?.data?.message
            || err.message
            || "Failed to create vehicle"
        );
    }
}

export const updateVehicle = async (id: string, data: UpdateVehiclePayload | FormData) => {
    try {
        const response = await axios.patch(
            API.VEHICLE.UPDATE(id),
            data,
            { headers: multipartHeaders(data) }
        );
        return response.data;
    } catch (err: Error | any) {
        throw new Error(
            err.response?.data?.message
            || err.message
            || "Failed to update vehicle"
        );
    }
}

export const deleteVehicle = async (id: string) => {
    try {
        const response = await axios.delete(
            API.VEHICLE.DELETE(id)
        );
        return response.data;
    } catch (err: Error | any) {
        throw new Error(
            err.response?.data?.message
            || err.message
            || "Failed to delete vehicle"
        );
    }
}

export const toggleVehicleAvailability = async (id: string) => {
    try {
        const response = await axios.patch(
            API.VEHICLE.TOGGLE_AVAILABILITY(id)
        );
        return response.data;
    } catch (err: Error | any) {
        throw new Error(
            err.response?.data?.message
            || err.message
            || "Failed to update availability"
        );
    }
}

export const toggleVehicleVerification = async (id: string) => {
    try {
        const response = await axios.patch(
            API.VEHICLE.TOGGLE_VERIFICATION(id)
        );
        return response.data;
    } catch (err: Error | any) {
        throw new Error(
            err.response?.data?.message
            || err.message
            || "Failed to update verification"
        );
    }
}
